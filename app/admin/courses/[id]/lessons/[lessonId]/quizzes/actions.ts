"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { recalculateCourseEnrollments } from "@/lib/courses";
import { sql } from "@/lib/db";
import { validateQuizForPublishing } from "@/lib/quizzes";

export async function createQuiz(
  courseId: string,
  lessonId: string,
  formData: FormData
) {
  const title = String(formData.get("title") ?? "").trim();

  const description =
    String(formData.get("description") ?? "").trim() || null;

  const passingScore = Number(formData.get("passingScore"));

  if (!courseId || !lessonId) {
    throw new Error("Course ID and lesson ID are required.");
  }

  if (!title) {
    throw new Error("Quiz title is required.");
  }

  if (
    !Number.isInteger(passingScore) ||
    passingScore < 0 ||
    passingScore > 100
  ) {
    throw new Error(
      "Passing score must be a whole number between 0 and 100."
    );
  }

  const lessons = (await sql`
    SELECT l.id
    FROM lessons l
    WHERE l.id = ${lessonId}
      AND l.course_id = ${courseId}
    LIMIT 1
  `) as { id: string }[];

  if (!lessons[0]) {
    throw new Error("Lesson not found.");
  }

  const positions = (await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS next_position
    FROM quizzes
    WHERE lesson_id = ${lessonId}
  `) as { next_position: number | string }[];

  const position = Number(
    positions[0]?.next_position ?? 0
  );

  const inserted = (await sql`
    INSERT INTO quizzes (
      lesson_id,
      title,
      description,
      passing_score,
      status,
      position
    )
    VALUES (
      ${lessonId},
      ${title},
      ${description},
      ${passingScore},
      'draft',
      ${position}
    )
    RETURNING id
  `) as { id: string }[];

  const quiz = inserted[0];

  if (!quiz) {
    throw new Error("Unable to create quiz.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}`
  );
  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes`
  );

  redirect(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quiz.id}`
  );
}
export async function createQuizQuestion(
  courseId: string,
  lessonId: string,
  quizId: string,
  formData: FormData
) {
  const question = String(
    formData.get("question") ?? ""
  ).trim();

  const questionType = String(
    formData.get("questionType") ?? "single_choice"
  ).trim();

  const explanation =
    String(formData.get("explanation") ?? "").trim() || null;

  const points = Number(formData.get("points"));

  const optionTexts = formData
    .getAll("optionText")
    .map((value) => String(value).trim());

  const correctIndexes = formData
    .getAll("correctOption")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value));

  if (!courseId || !lessonId || !quizId) {
    throw new Error(
      "Course ID, lesson ID, and quiz ID are required."
    );
  }

  if (!question) {
    throw new Error("Question text is required.");
  }

  if (
    ![
      "single_choice",
      "multiple_choice",
      "true_false",
    ].includes(questionType)
  ) {
    throw new Error("Invalid question type.");
  }

  if (!Number.isInteger(points) || points <= 0) {
    throw new Error(
      "Question points must be a whole number greater than 0."
    );
  }

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
    throw new Error("Quiz not found.");
  }

  let normalizedOptions = optionTexts;

  if (questionType === "true_false") {
    normalizedOptions = ["True", "False"];
  }

  if (normalizedOptions.length < 2) {
    throw new Error(
      "A question must have at least two answer options."
    );
  }

  if (
    normalizedOptions.some(
      (option) => option.length === 0
    )
  ) {
    throw new Error(
      "Answer options cannot be empty."
    );
  }

  const normalizedOptionNames = normalizedOptions.map(
    (option) => option.toLowerCase()
  );

  if (
    new Set(normalizedOptionNames).size !==
    normalizedOptionNames.length
  ) {
    throw new Error(
      "Answer options must be unique."
    );
  }

  if (correctIndexes.length === 0) {
    throw new Error(
      "Select at least one correct answer."
    );
  }

  if (
    correctIndexes.some(
      (index) =>
        index < 0 ||
        index >= normalizedOptions.length
    )
  ) {
    throw new Error(
      "A selected correct answer is invalid."
    );
  }

  const uniqueCorrectIndexes = [
    ...new Set(correctIndexes),
  ];

  if (
    questionType === "single_choice" &&
    uniqueCorrectIndexes.length !== 1
  ) {
    throw new Error(
      "Single-choice questions must have exactly one correct answer."
    );
  }

  if (
    questionType === "true_false" &&
    uniqueCorrectIndexes.length !== 1
  ) {
    throw new Error(
      "True/false questions must have exactly one correct answer."
    );
  }

  const positions = (await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS next_position
    FROM quiz_questions
    WHERE quiz_id = ${quizId}
  `) as { next_position: number | string }[];

  const position = Number(
    positions[0]?.next_position ?? 0
  );

  const insertedQuestions = (await sql`
    INSERT INTO quiz_questions (
      quiz_id,
      question,
      question_type,
      explanation,
      points,
      position
    )
    VALUES (
      ${quizId},
      ${question},
      ${questionType},
      ${explanation},
      ${points},
      ${position}
    )
    RETURNING id
  `) as { id: string }[];

  const insertedQuestion = insertedQuestions[0];

  if (!insertedQuestion) {
    throw new Error(
      "Unable to create quiz question."
    );
  }

  try {
    for (
      let optionIndex = 0;
      optionIndex < normalizedOptions.length;
      optionIndex++
    ) {
      const optionText =
        normalizedOptions[optionIndex];

      const isCorrect =
        uniqueCorrectIndexes.includes(optionIndex);

      await sql`
        INSERT INTO quiz_options (
          question_id,
          option_text,
          is_correct,
          position
        )
        VALUES (
          ${insertedQuestion.id},
          ${optionText},
          ${isCorrect},
          ${optionIndex}
        )
      `;
    }
  } catch (error) {
    await sql`
      DELETE FROM quiz_questions
      WHERE id = ${insertedQuestion.id}
    `;

    throw error;
  }

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes`
  );

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );

  redirect(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );
}
export async function updateQuizQuestion(
  courseId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
  formData: FormData
) {
  const question = String(
    formData.get("question") ?? ""
  ).trim();

  const questionType = String(
    formData.get("questionType") ?? "single_choice"
  ).trim();

  const explanation =
    String(formData.get("explanation") ?? "").trim() || null;

  const points = Number(formData.get("points"));

  const optionTexts = formData
    .getAll("optionText")
    .map((value) => String(value).trim());

  const correctIndexes = formData
    .getAll("correctOption")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value));

  if (
    !courseId ||
    !lessonId ||
    !quizId ||
    !questionId
  ) {
    throw new Error(
      "Course, lesson, quiz, and question IDs are required."
    );
  }

  if (!question) {
    throw new Error("Question text is required.");
  }

  if (
    ![
      "single_choice",
      "multiple_choice",
      "true_false",
    ].includes(questionType)
  ) {
    throw new Error("Invalid question type.");
  }

  if (!Number.isInteger(points) || points <= 0) {
    throw new Error(
      "Question points must be a whole number greater than 0."
    );
  }

  const existing = (await sql`
    SELECT qq.id
    FROM quiz_questions qq

    INNER JOIN quizzes q
      ON q.id = qq.quiz_id

    INNER JOIN lessons l
      ON l.id = q.lesson_id

    WHERE qq.id = ${questionId}
      AND qq.quiz_id = ${quizId}
      AND q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}

    LIMIT 1
  `) as { id: string }[];

  if (!existing[0]) {
    throw new Error("Quiz question not found.");
  }

  const normalizedOptions =
    questionType === "true_false"
      ? ["True", "False"]
      : optionTexts;

  if (normalizedOptions.length < 2) {
    throw new Error(
      "A question must have at least two answer options."
    );
  }

  if (
    normalizedOptions.some(
      (option) => option.length === 0
    )
  ) {
    throw new Error(
      "Answer options cannot be empty."
    );
  }

  const normalizedNames =
    normalizedOptions.map((option) =>
      option.toLowerCase()
    );

  if (
    new Set(normalizedNames).size !==
    normalizedNames.length
  ) {
    throw new Error(
      "Answer options must be unique."
    );
  }

  const uniqueCorrectIndexes = [
    ...new Set(correctIndexes),
  ];

  if (uniqueCorrectIndexes.length === 0) {
    throw new Error(
      "Select at least one correct answer."
    );
  }

  if (
    uniqueCorrectIndexes.some(
      (index) =>
        index < 0 ||
        index >= normalizedOptions.length
    )
  ) {
    throw new Error(
      "A selected correct answer is invalid."
    );
  }

  if (
    (questionType === "single_choice" ||
      questionType === "true_false") &&
    uniqueCorrectIndexes.length !== 1
  ) {
    throw new Error(
      "This question type must have exactly one correct answer."
    );
  }

  const existingAttempts = (await sql`
    SELECT COUNT(*)::int AS count
    FROM quiz_attempts
    WHERE quiz_id = ${quizId}
  `) as {
    count: number;
  }[];

  const attemptCount = Number(existingAttempts[0]?.count ?? 0);

  if (attemptCount > 0) {
    throw new Error(
      "This question cannot be structurally edited because learners have already submitted attempts for this quiz. Archive the quiz or create a new quiz version instead."
    );
  }

  await sql`
    UPDATE quiz_questions
    SET
      question = ${question},
      question_type = ${questionType},
      explanation = ${explanation},
      points = ${points},
      updated_at = NOW()
    WHERE id = ${questionId}
      AND quiz_id = ${quizId}
  `;

  /*
   * Rebuild the options so changing between Single Choice,
   * Multiple Choice, and True / False stays consistent.
   */
  await sql`
    DELETE FROM quiz_options
    WHERE question_id = ${questionId}
  `;

  for (
    let index = 0;
    index < normalizedOptions.length;
    index++
  ) {
    await sql`
      INSERT INTO quiz_options (
        question_id,
        option_text,
        is_correct,
        position
      )
      VALUES (
        ${questionId},
        ${normalizedOptions[index]},
        ${uniqueCorrectIndexes.includes(index)},
        ${index}
      )
    `;
  }

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes`
  );

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );

  redirect(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );
}

export async function deleteQuizQuestion(
  courseId: string,
  lessonId: string,
  quizId: string,
  questionId: string,
  formData: FormData
) {
  if (
    !courseId ||
    !lessonId ||
    !quizId ||
    !questionId
  ) {
    throw new Error(
      "Course, lesson, quiz, and question IDs are required."
    );
  }

  const confirmation = String(
    formData.get("confirmDelete") ?? ""
  );

  if (confirmation !== "DELETE_QUESTION") {
    throw new Error(
      "Question deletion was not explicitly confirmed."
    );
  }

  const existing = (await sql`
    SELECT qq.id
    FROM quiz_questions qq

    INNER JOIN quizzes q
      ON q.id = qq.quiz_id

    INNER JOIN lessons l
      ON l.id = q.lesson_id

    WHERE qq.id = ${questionId}
      AND qq.quiz_id = ${quizId}
      AND q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}

    LIMIT 1
  `) as { id: string }[];

  if (!existing[0]) {
    throw new Error("Quiz question not found.");
  }

  /*
   * Preserve assessment history.
   * Questions must not be structurally deleted once
   * learners have started taking this quiz.
   */
  const attempts = (await sql`
    SELECT COUNT(*)::int AS count
    FROM quiz_attempts
    WHERE quiz_id = ${quizId}
  `) as { count: number }[];

  if ((attempts[0]?.count ?? 0) > 0) {
    throw new Error(
      "This question cannot be deleted because the quiz already has learner attempts."
    );
  }

  await sql`
    DELETE FROM quiz_questions
    WHERE id = ${questionId}
      AND quiz_id = ${quizId}
  `;

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes`
  );

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );
}

export type QuizFormState = {
  success: boolean;
  message: string | null;
  errors: string[];
};

export async function updateQuiz(
  courseId: string,
  lessonId: string,
  quizId: string,
  _previousState: QuizFormState,
  formData: FormData
): Promise<QuizFormState> {
  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description =
    String(formData.get("description") ?? "").trim() ||
    null;

  const passingScore = Number(
    formData.get("passingScore")
  );

  const status = String(
    formData.get("status") ?? "draft"
  ).trim();

  if (!courseId || !lessonId || !quizId) {
    return {
      success: false,
      message: "Unable to save quiz.",
      errors: [
        "The course, lesson, or quiz information is missing.",
      ],
    };
  }

  const errors: string[] = [];

  if (!title) {
    errors.push("Quiz title is required.");
  }

  if (
    !Number.isInteger(passingScore) ||
    passingScore < 0 ||
    passingScore > 100
  ) {
    errors.push(
      "Passing score must be a whole number between 0 and 100."
    );
  }

  if (
    !["draft", "published", "archived"].includes(
      status
    )
  ) {
    errors.push("Select a valid quiz status.");
  }

  if (errors.length > 0) {
    return {
      success: false,
      message: "Review the quiz settings.",
      errors,
    };
  }

  const existing = (await sql`
    SELECT
      q.id,
      q.status
    FROM quizzes q

    INNER JOIN lessons l
      ON l.id = q.lesson_id

    WHERE q.id = ${quizId}
      AND q.lesson_id = ${lessonId}
      AND l.course_id = ${courseId}

    LIMIT 1
  `) as {
    id: string;
    status: string;
  }[];

  if (!existing[0]) {
    return {
      success: false,
      message: "Unable to save quiz.",
      errors: ["Quiz not found."],
    };
  }

  if (status === "published") {
    const publishingErrors =
      await validateQuizForPublishing(
        courseId,
        lessonId,
        quizId
      );

    if (publishingErrors.length > 0) {
      return {
        success: false,
        message:
          "This quiz is not ready to publish.",
        errors: publishingErrors,
      };
    }
  }

  try {
    await sql`
      UPDATE quizzes
      SET
        title = ${title},
        description = ${description},
        passing_score = ${passingScore},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${quizId}
        AND lesson_id = ${lessonId}
    `;
  } catch {
    return {
      success: false,
      message: "Unable to save quiz.",
      errors: [
        "Something went wrong while saving the quiz. Please try again.",
      ],
    };
  }

  /*
   * Publishing or removing a published assessment changes the
   * requirements for completing this course.
   *
   * Recalculate existing enrollments only when the quiz status
   * actually changed. Metadata-only edits do not affect course
   * completion.
   */
  if (existing[0].status !== status) {
    await recalculateCourseEnrollments(
      courseId
    );
  }

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes`
  );

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );

  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}`
  );

  redirect(
    `/admin/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`
  );
}