
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id
  ON password_reset_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at
  ON password_reset_tokens(expires_at);
CREATE TABLE IF NOT EXISTS roles (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id    TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS user_roles_role_id_idx
  ON user_roles(role_id);


CREATE TABLE IF NOT EXISTS courses (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  status      TEXT NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft', 'published', 'archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS courses_status_idx
  ON courses(status);


CREATE TABLE IF NOT EXISTS lessons (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  position    INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  status      TEXT NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft', 'published', 'archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  content     TEXT,
  section     TEXT,
  difficulty  TEXT
              CHECK (
                difficulty IS NULL OR
                difficulty IN ('beginner', 'intermediate', 'advanced')
              ),
  duration    TEXT,
  CONSTRAINT lessons_course_slug_unique UNIQUE (course_id, slug)
);

CREATE INDEX IF NOT EXISTS lessons_course_id_idx
  ON lessons(course_id);

CREATE INDEX IF NOT EXISTS lessons_status_idx
  ON lessons(status);


CREATE TABLE IF NOT EXISTS enrollments (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'active'
               CHECK (status IN ('active', 'completed', 'cancelled')),
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS enrollments_user_id_idx
  ON enrollments(user_id);

CREATE INDEX IF NOT EXISTS enrollments_course_id_idx
  ON enrollments(course_id);

CREATE INDEX IF NOT EXISTS enrollments_status_idx
  ON enrollments(status);


CREATE TABLE IF NOT EXISTS quizzes (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  passing_score INTEGER NOT NULL DEFAULT 70
                CHECK (passing_score >= 0 AND passing_score <= 100),
  status        TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'published', 'archived')),
  position      INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quizzes_lesson_position_unique UNIQUE (lesson_id, position)
);

CREATE INDEX IF NOT EXISTS quizzes_lesson_id_idx
  ON quizzes(lesson_id);

CREATE INDEX IF NOT EXISTS quizzes_status_idx
  ON quizzes(status);


CREATE TABLE IF NOT EXISTS quiz_questions (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice'
                CHECK (
                  question_type IN (
                    'single_choice',
                    'multiple_choice',
                    'true_false'
                  )
                ),
  explanation   TEXT,
  points        INTEGER NOT NULL DEFAULT 1 CHECK (points > 0),
  position      INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quiz_questions_quiz_position_unique
    UNIQUE (quiz_id, position)
);

CREATE INDEX IF NOT EXISTS quiz_questions_quiz_id_idx
  ON quiz_questions(quiz_id);


CREATE TABLE IF NOT EXISTS quiz_options (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT false,
  position    INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quiz_options_question_position_unique
    UNIQUE (question_id, position)
);

CREATE INDEX IF NOT EXISTS quiz_options_question_id_idx
  ON quiz_options(question_id);


CREATE TABLE IF NOT EXISTS quiz_attempts (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id        TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1 CHECK (attempt_number > 0),
  score_percent  INTEGER
                 CHECK (
                   score_percent IS NULL OR
                   (score_percent >= 0 AND score_percent <= 100)
                 ),
  earned_points  INTEGER
                 CHECK (earned_points IS NULL OR earned_points >= 0),
  total_points   INTEGER
                 CHECK (total_points IS NULL OR total_points >= 0),
  passed         BOOLEAN,
  status         TEXT NOT NULL DEFAULT 'in_progress'
                 CHECK (status IN ('in_progress', 'completed')),
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ,
  CONSTRAINT quiz_attempts_user_quiz_number_unique
    UNIQUE (user_id, quiz_id, attempt_number),
  CONSTRAINT quiz_attempts_points_consistency_check
    CHECK (
      earned_points IS NULL OR
      total_points IS NULL OR
      earned_points <= total_points
    )
);

CREATE INDEX IF NOT EXISTS quiz_attempts_quiz_id_idx
  ON quiz_attempts(quiz_id);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_id_idx
  ON quiz_attempts(user_id);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_quiz_idx
  ON quiz_attempts(user_id, quiz_id);


CREATE TABLE IF NOT EXISTS quiz_answers (
  id                 TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id         TEXT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id        TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_option_id TEXT NOT NULL REFERENCES quiz_options(id) ON DELETE CASCADE,
  is_correct         BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quiz_answers_selection_unique
    UNIQUE (attempt_id, question_id, selected_option_id)
);

CREATE INDEX IF NOT EXISTS quiz_answers_attempt_id_idx
  ON quiz_answers(attempt_id);

CREATE INDEX IF NOT EXISTS quiz_answers_question_id_idx
  ON quiz_answers(question_id);

CREATE INDEX IF NOT EXISTS quiz_answers_selected_option_id_idx
  ON quiz_answers(selected_option_id);


CREATE TABLE IF NOT EXISTS certificates (
  id                 TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id          TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT certificates_user_course_unique
    UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS certificates_user_id_idx
  ON certificates(user_id);

CREATE INDEX IF NOT EXISTS certificates_course_id_idx
  ON certificates(course_id);

CREATE INDEX IF NOT EXISTS certificates_issued_at_idx
  ON certificates(issued_at);
