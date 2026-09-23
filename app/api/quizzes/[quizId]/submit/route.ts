import { auth } from "@/auth";
import { recalculateUserCourseEnrollment } from "@/lib/courses";
import { sql } from "@/lib/db";
import { resolveSessionUserId } from "@/lib/sessionUser";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    quizId: string;
  }>;
};

type SubmittedAnswer = {
  questionId: string;
  optionIds: string[];
};

type QuestionRow = {
  id: string;
  questionType:
  | "single_choice"
  | "multiple_choice"
  | "true_false";
  points: number;
};

type OptionRow = {
  id: string;
  questionId: string;
  isCorrect: boolean;
};

type QuizRow = {
  id: string;
  passingScore: number;
  courseId: string;
};

function arraysMatch(
  left: string[],
  right: string[]
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();

  return leftSorted.every(
    (value, index) => value === rightSorted[index]
  );
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  const session = await auth();
  const userId = await resolveSessionUserId(session);

  if (!userId) {
    return NextResponse.json(
      {
        error: "You must be signed in to submit a quiz.",
      },
      { status: 401 }
    );
  }

  const { quizId } = await context.params;

  if (!quizId) {
    return NextResponse.json(
      { error: "Quiz ID is required." },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("answers" in body) ||
    !Array.isArray(
      (body as { answers?: unknown }).answers
    )
  ) {
    return NextResponse.json(
      { error: "Quiz answers are required." },
      { status: 400 }
    );
  }

  const rawAnswers = (
    body as { answers: unknown[] }
  ).answers;

  const answers: SubmittedAnswer[] = [];

  for (const rawAnswer of rawAnswers) {
    if (
      typeof rawAnswer !== "object" ||
      rawAnswer === null
    ) {
      return NextResponse.json(
        { error: "Invalid answer submission." },
        { status: 400 }
      );
    }

    const candidate = rawAnswer as {
      questionId?: unknown;
      optionIds?: unknown;
    };

    if (
      typeof candidate.questionId !== "string" ||
      !candidate.questionId.trim() ||
      !Array.isArray(candidate.optionIds) ||
      candidate.optionIds.some(
        (value) => typeof value !== "string"
      )
    ) {
      return NextResponse.json(
        { error: "Invalid answer submission." },
        { status: 400 }
      );
    }

    const optionIds = [
      ...new Set(
        candidate.optionIds.map((value) =>
          String(value).trim()
        )
      ),
    ].filter(Boolean);

    answers.push({
      questionId: candidate.questionId.trim(),
      optionIds,
    });
  }

  const duplicateQuestionIds =
    answers.length !==
    new Set(
      answers.map((answer) => answer.questionId)
    ).size;

  if (duplicateQuestionIds) {
    return NextResponse.json(
      {
        error:
          "A question was submitted more than once.",
      },
      { status: 400 }
    );
  }

  try {
    const quizRows = (await sql`
      SELECT
        q.id,
        q.passing_score AS "passingScore",
        c.id AS "courseId"
    
      FROM quizzes q
    
      INNER JOIN lessons l
        ON l.id = q.lesson_id
       AND l.status = 'published'
    
      INNER JOIN courses c
        ON c.id = l.course_id
       AND c.status = 'published'
    
      WHERE q.id = ${quizId}
        AND q.status = 'published'
    
      LIMIT 1
    `) as QuizRow[];

    const quiz = quizRows[0];

    if (!quiz) {
      return NextResponse.json(
        {
          error:
            "This quiz is not currently available.",
        },
        { status: 404 }
      );
    }

    const questions = (await sql`
      SELECT
        id,
        question_type AS "questionType",
        points
      FROM quiz_questions
      WHERE quiz_id = ${quizId}
      ORDER BY position ASC, created_at ASC
    `) as QuestionRow[];

    if (questions.length === 0) {
      return NextResponse.json(
        {
          error:
            "This quiz does not contain any questions.",
        },
        { status: 400 }
      );
    }

    if (answers.length !== questions.length) {
      return NextResponse.json(
        {
          error:
            "Please answer every question before submitting.",
        },
        { status: 400 }
      );
    }

    const questionIds = new Set(
      questions.map((question) => question.id)
    );

    if (
      answers.some(
        (answer) =>
          !questionIds.has(answer.questionId)
      )
    ) {
      return NextResponse.json(
        {
          error:
            "One or more submitted questions do not belong to this quiz.",
        },
        { status: 400 }
      );
    }

    const options = (await sql`
      SELECT
        qo.id,
        qo.question_id AS "questionId",
        qo.is_correct AS "isCorrect"
      FROM quiz_options qo
      INNER JOIN quiz_questions qq
        ON qq.id = qo.question_id
      WHERE qq.quiz_id = ${quizId}
      ORDER BY
        qq.position ASC,
        qo.position ASC
    `) as OptionRow[];

    const optionsByQuestion =
      new Map<string, OptionRow[]>();

    for (const option of options) {
      const existing =
        optionsByQuestion.get(
          option.questionId
        ) ?? [];

      existing.push(option);

      optionsByQuestion.set(
        option.questionId,
        existing
      );
    }

    let earnedPoints = 0;

    const gradedAnswers: {
      questionId: string;
      selectedOptionIds: string[];
      isCorrect: boolean;
    }[] = [];

    for (const question of questions) {
      const submitted = answers.find(
        (answer) =>
          answer.questionId === question.id
      );

      if (!submitted) {
        return NextResponse.json(
          {
            error:
              "Please answer every question before submitting.",
          },
          { status: 400 }
        );
      }

      if (submitted.optionIds.length === 0) {
        return NextResponse.json(
          {
            error:
              "Please answer every question before submitting.",
          },
          { status: 400 }
        );
      }

      if (
        question.questionType !==
        "multiple_choice" &&
        submitted.optionIds.length !== 1
      ) {
        return NextResponse.json(
          {
            error:
              "Single-choice questions must contain exactly one selected answer.",
          },
          { status: 400 }
        );
      }

      const questionOptions =
        optionsByQuestion.get(question.id) ?? [];

      const validOptionIds = new Set(
        questionOptions.map(
          (option) => option.id
        )
      );

      if (
        submitted.optionIds.some(
          (optionId) =>
            !validOptionIds.has(optionId)
        )
      ) {
        return NextResponse.json(
          {
            error:
              "One or more selected answers are invalid.",
          },
          { status: 400 }
        );
      }

      const correctOptionIds =
        questionOptions
          .filter(
            (option) => option.isCorrect
          )
          .map((option) => option.id);

      const isCorrect = arraysMatch(
        submitted.optionIds,
        correctOptionIds
      );

      if (isCorrect) {
        earnedPoints += Number(
          question.points
        );
      }

      gradedAnswers.push({
        questionId: question.id,
        selectedOptionIds:
          submitted.optionIds,
        isCorrect,
      });
    }

    const totalPoints = questions.reduce(
      (total, question) =>
        total + Number(question.points),
      0
    );

    if (totalPoints <= 0) {
      return NextResponse.json(
        {
          error:
            "This quiz has an invalid point configuration.",
        },
        { status: 400 }
      );
    }

    const scorePercent = Math.round(
      (earnedPoints / totalPoints) * 100
    );

    const passingScore = Number(
      quiz.passingScore
    );

    const passed =
      scorePercent >= passingScore;

    /*
     * Determine the learner's next attempt number.
     */
    const attemptRows = (await sql`
      SELECT
        COALESCE(MAX(attempt_number), 0)::int
          AS "lastAttemptNumber"
      FROM quiz_attempts
      WHERE user_id = ${userId}
        AND quiz_id = ${quizId}
    `) as {
      lastAttemptNumber: number;
    }[];

    const attemptNumber =
      Number(
        attemptRows[0]?.lastAttemptNumber ??
        0
      ) + 1;

    /*
     * Create the completed attempt first.
     */
    const createdAttempts = (await sql`
      INSERT INTO quiz_attempts (
        quiz_id,
        user_id,
        attempt_number,
        score_percent,
        earned_points,
        total_points,
        passed,
        status,
        started_at,
        completed_at
      )
      VALUES (
        ${quizId},
        ${userId},
        ${attemptNumber},
        ${scorePercent},
        ${earnedPoints},
        ${totalPoints},
        ${passed},
        'completed',
        NOW(),
        NOW()
      )
      RETURNING id
    `) as {
      id: string;
    }[];

    const attemptId =
      createdAttempts[0]?.id;

    if (!attemptId) {
      throw new Error(
        "Failed to create quiz attempt."
      );
    }

    /*
     * Store every selected option.
     *
     * For multiple-choice questions there can be more
     * than one row for the same question.
     */
    try {
      for (const gradedAnswer of gradedAnswers) {
        for (
          const optionId of
          gradedAnswer.selectedOptionIds
        ) {
          await sql`
            INSERT INTO quiz_answers (
              attempt_id,
              question_id,
              selected_option_id,
              is_correct
            )
            VALUES (
              ${attemptId},
              ${gradedAnswer.questionId},
              ${optionId},
              ${gradedAnswer.isCorrect}
            )
          `;
        }
      }
    } catch (error) {
      /*
       * The local SQL helper does not expose a transaction
       * abstraction, so remove the attempt if storing any
       * answer fails. ON DELETE CASCADE removes any answer
       * rows already written for this attempt.
       */
      await sql`
        DELETE FROM quiz_attempts
        WHERE id = ${attemptId}
      `;

      throw error;
    }
    /*
 * The attempt and its answers are now safely stored.
 *
 * Recalculate the learner's course enrollment so passing the
 * final required assessment can complete the course.
 */
    await recalculateUserCourseEnrollment(
      userId,
      quiz.courseId
    );

    return NextResponse.json({
      ok: true,
      attemptId,
      attemptNumber,
      scorePercent,
      earnedPoints,
      totalPoints,
      passingScore,
      passed,
    });
  } catch (error) {
    console.error(
      "[api/quizzes/submit] POST failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit the quiz. Please try again.",
      },
      { status: 500 }
    );
  }
}