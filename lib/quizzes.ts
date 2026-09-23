import { sql } from "@/lib/db";

export type QuizStatus = "draft" | "published" | "archived";

export type QuizQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false";

export type AdminQuiz = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string | null;
  passingScore: number;
  status: QuizStatus;
  position: number;
  questionCount: number;
  attemptCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type QuizRow = {
  id: string;
  lesson_id: string;
  lesson_title: string;
  course_id: string;
  course_title: string;
  title: string;
  description: string | null;
  passing_score: number | string;
  status: QuizStatus;
  position: number | string;
  question_count: number | string;
  attempt_count: number | string;
  created_at: Date | string;
  updated_at: Date | string;
};

function mapQuiz(row: QuizRow): AdminQuiz {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    lessonTitle: row.lesson_title,
    courseId: row.course_id,
    courseTitle: row.course_title,
    title: row.title,
    description: row.description,
    passingScore: Number(row.passing_score),
    status: row.status,
    position: Number(row.position),
    questionCount: Number(row.question_count ?? 0),
    attemptCount: Number(row.attempt_count ?? 0),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getAdminQuizzesForLesson(
  courseId: string,
  lessonId: string
): Promise<AdminQuiz[]> {
  const rows = (await sql`
    SELECT
      q.id,
      q.lesson_id,
      l.title AS lesson_title,
      c.id AS course_id,
      c.title AS course_title,
      q.title,
      q.description,
      q.passing_score,
      q.status,
      q.position,
      q.created_at,
      q.updated_at,

      COUNT(DISTINCT qq.id) AS question_count,
      COUNT(DISTINCT qa.id) AS attempt_count

    FROM quizzes q

    INNER JOIN lessons l
      ON l.id = q.lesson_id

    INNER JOIN courses c
      ON c.id = l.course_id

    LEFT JOIN quiz_questions qq
      ON qq.quiz_id = q.id

    LEFT JOIN quiz_attempts qa
      ON qa.quiz_id = q.id

    WHERE q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}

    GROUP BY
      q.id,
      q.lesson_id,
      l.title,
      c.id,
      c.title,
      q.title,
      q.description,
      q.passing_score,
      q.status,
      q.position,
      q.created_at,
      q.updated_at

    ORDER BY
      q.position ASC,
      q.created_at ASC
  `) as QuizRow[];

  return rows.map(mapQuiz);
}

export async function getAdminQuizById(
  courseId: string,
  lessonId: string,
  quizId: string
): Promise<AdminQuiz | null> {
  const rows = (await sql`
    SELECT
      q.id,
      q.lesson_id,
      l.title AS lesson_title,
      c.id AS course_id,
      c.title AS course_title,
      q.title,
      q.description,
      q.passing_score,
      q.status,
      q.position,
      q.created_at,
      q.updated_at,

      COUNT(DISTINCT qq.id) AS question_count,
      COUNT(DISTINCT qa.id) AS attempt_count

    FROM quizzes q

    INNER JOIN lessons l
      ON l.id = q.lesson_id

    INNER JOIN courses c
      ON c.id = l.course_id

    LEFT JOIN quiz_questions qq
      ON qq.quiz_id = q.id

    LEFT JOIN quiz_attempts qa
      ON qa.quiz_id = q.id

    WHERE q.id = ${quizId}
      AND q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}

    GROUP BY
      q.id,
      q.lesson_id,
      l.title,
      c.id,
      c.title,
      q.title,
      q.description,
      q.passing_score,
      q.status,
      q.position,
      q.created_at,
      q.updated_at

    LIMIT 1
  `) as QuizRow[];

  const row = rows[0];

  return row ? mapQuiz(row) : null;
}

export type AdminQuizOption = {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  position: number;
};

export type AdminQuizQuestion = {
  id: string;
  quizId: string;
  question: string;
  questionType: QuizQuestionType;
  explanation: string | null;
  points: number;
  position: number;
  options: AdminQuizOption[];
};

type QuestionRow = {
  id: string;
  quiz_id: string;
  question: string;
  question_type: QuizQuestionType;
  explanation: string | null;
  points: number | string;
  position: number | string;
};

type OptionRow = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  position: number | string;
};

export async function getAdminQuizQuestions(
  courseId: string,
  lessonId: string,
  quizId: string
): Promise<AdminQuizQuestion[]> {
  const quizRows = (await sql`
    SELECT q.id
    FROM quizzes q

    INNER JOIN lessons l
      ON l.id = q.lesson_id

    WHERE q.id = ${quizId}
      AND q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}

    LIMIT 1
  `) as { id: string }[];

  if (!quizRows[0]) {
    return [];
  }

  const questionRows = (await sql`
    SELECT
      id,
      quiz_id,
      question,
      question_type,
      explanation,
      points,
      position

    FROM quiz_questions

    WHERE quiz_id = ${quizId}

    ORDER BY
      position ASC,
      created_at ASC
  `) as QuestionRow[];

  if (questionRows.length === 0) {
    return [];
  }

  const optionRows = (await sql`
    SELECT
      qo.id,
      qo.question_id,
      qo.option_text,
      qo.is_correct,
      qo.position

    FROM quiz_options qo

    INNER JOIN quiz_questions qq
      ON qq.id = qo.question_id

    WHERE qq.quiz_id = ${quizId}

    ORDER BY
      qq.position ASC,
      qo.position ASC,
      qo.created_at ASC
  `) as OptionRow[];

  const optionsByQuestion = new Map<
    string,
    AdminQuizOption[]
  >();

  for (const option of optionRows) {
    const mappedOption: AdminQuizOption = {
      id: option.id,
      questionId: option.question_id,
      optionText: option.option_text,
      isCorrect: option.is_correct,
      position: Number(option.position),
    };

    const existing =
      optionsByQuestion.get(option.question_id) ?? [];

    existing.push(mappedOption);

    optionsByQuestion.set(
      option.question_id,
      existing
    );
  }

  return questionRows.map((row) => ({
    id: row.id,
    quizId: row.quiz_id,
    question: row.question,
    questionType: row.question_type,
    explanation: row.explanation,
    points: Number(row.points),
    position: Number(row.position),
    options: optionsByQuestion.get(row.id) ?? [],
  }));
}

export async function validateQuizForPublishing(
  courseId: string,
  lessonId: string,
  quizId: string
): Promise<string[]> {
  const errors: string[] = [];

  const quizRows = (await sql`
    SELECT q.id
    FROM quizzes q
    INNER JOIN lessons l
      ON l.id = q.lesson_id
    WHERE q.id = ${quizId}
      AND q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}
    LIMIT 1
  `) as { id: string }[];

  if (!quizRows[0]) {
    return ["Quiz not found."];
  }

  const questions = (await sql`
    SELECT
      qq.id,
      qq.question,
      qq.question_type AS "questionType",
      COUNT(qo.id)::int AS "optionCount",
      COUNT(qo.id) FILTER (
        WHERE qo.is_correct = true
      )::int AS "correctCount"
    FROM quiz_questions qq
    LEFT JOIN quiz_options qo
      ON qo.question_id = qq.id
    WHERE qq.quiz_id = ${quizId}
    GROUP BY
      qq.id,
      qq.question,
      qq.question_type,
      qq.position,
      qq.created_at
    ORDER BY
      qq.position ASC,
      qq.created_at ASC
  `) as {
    id: string;
    question: string;
    questionType: QuizQuestionType;
    optionCount: number;
    correctCount: number;
  }[];

  if (questions.length === 0) {
    errors.push(
      "Add at least one question before publishing the quiz."
    );

    return errors;
  }

  questions.forEach((question, index) => {
    const questionNumber = index + 1;

    if (question.optionCount < 2) {
      errors.push(
        `Question ${questionNumber} must have at least two answer options.`
      );
    }

    if (
      question.questionType === "single_choice" ||
      question.questionType === "true_false"
    ) {
      if (question.correctCount !== 1) {
        errors.push(
          `Question ${questionNumber} must have exactly one correct answer.`
        );
      }
    }

    if (
      question.questionType === "multiple_choice" &&
      question.correctCount < 1
    ) {
      errors.push(
        `Question ${questionNumber} must have at least one correct answer.`
      );
    }

    if (
      question.questionType === "true_false" &&
      question.optionCount !== 2
    ) {
      errors.push(
        `Question ${questionNumber} must contain exactly two options for True / False.`
      );
    }
  });

  return errors;
}

export type LearnerQuizOption = {
  id: string;
  optionText: string;
  position: number;
};

export type LearnerQuizQuestion = {
  id: string;
  question: string;
  questionType: QuizQuestionType;
  points: number;
  position: number;
  options: LearnerQuizOption[];
};

export type LearnerQuiz = {
  id: string;
  lessonId: string;
  title: string;
  description: string | null;
  passingScore: number;
  position: number;
  questionCount: number;
  totalPoints: number;
  questions: LearnerQuizQuestion[];
};

export async function getPublishedQuizzesForLesson(
  lessonId: string
): Promise<LearnerQuiz[]> {
  if (!lessonId) {
    return [];
  }

  const quizRows = (await sql`
    SELECT
      q.id,
      q.lesson_id AS "lessonId",
      q.title,
      q.description,
      q.passing_score AS "passingScore",
      q.position,
      COUNT(DISTINCT qq.id)::int AS "questionCount",
      COALESCE(SUM(DISTINCT qq.points), 0)::int AS "totalPoints"
    FROM quizzes q
    LEFT JOIN quiz_questions qq
      ON qq.quiz_id = q.id
    WHERE q.lesson_id = ${lessonId}
      AND q.status = 'published'
    GROUP BY
      q.id,
      q.lesson_id,
      q.title,
      q.description,
      q.passing_score,
      q.position
    ORDER BY
      q.position ASC,
      q.created_at ASC
  `) as {
    id: string;
    lessonId: string;
    title: string;
    description: string | null;
    passingScore: number;
    position: number;
    questionCount: number;
    totalPoints: number;
  }[];

  if (quizRows.length === 0) {
    return [];
  }

  const quizzes: LearnerQuiz[] = [];

  for (const quiz of quizRows) {
    const questionRows = (await sql`
      SELECT
        id,
        question,
        question_type AS "questionType",
        points,
        position
      FROM quiz_questions
      WHERE quiz_id = ${quiz.id}
      ORDER BY
        position ASC,
        created_at ASC
    `) as {
      id: string;
      question: string;
      questionType: QuizQuestionType;
      points: number;
      position: number;
    }[];

    const questions: LearnerQuizQuestion[] = [];

    for (const question of questionRows) {
      const optionRows = (await sql`
        SELECT
          id,
          option_text AS "optionText",
          position
        FROM quiz_options
        WHERE question_id = ${question.id}
        ORDER BY
          position ASC,
          created_at ASC
      `) as LearnerQuizOption[];

      questions.push({
        id: question.id,
        question: question.question,
        questionType: question.questionType,
        points: question.points,
        position: question.position,
        options: optionRows,
      });
    }

    quizzes.push({
      id: quiz.id,
      lessonId: quiz.lessonId,
      title: quiz.title,
      description: quiz.description,
      passingScore: Number(quiz.passingScore),
      position: Number(quiz.position),
      questionCount: Number(quiz.questionCount),
      totalPoints: questionRows.reduce(
        (total, question) => total + Number(question.points),
        0
      ),
      questions,
    });
  }

  return quizzes;
}