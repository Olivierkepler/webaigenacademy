export type PracticeLabData = {
  objective?: string;
  instructions?: string[];
  hints?: string[];
  expectedOutput?: string;
};

/** Generic procedural steps when a lesson has no practiceLab.instructions. */
export const DEFAULT_PRACTICE_INSTRUCTIONS: string[] = [
  "Read the notebook introduction carefully.",
  "Run each code cell in order from top to bottom.",
  "Complete every TODO or exercise cell.",
  "Inspect the outputs and verify they match your expectations.",
  "Revisit the lesson concepts if a step is unclear.",
];

/** Generic hints when a lesson has no practiceLab.hints. */
export const DEFAULT_PRACTICE_HINTS: string[] = [
  "Run notebook cells from top to bottom so dependencies stay consistent.",
  "Restart the kernel if variables become inconsistent or errors persist.",
  "Check spelling and capitalization of variable names before running a cell.",
];

export function resolvePracticeObjective(
  practiceLab: PracticeLabData | undefined,
  description: string | undefined,
  lessonTitle: string
): string {
  return (
    practiceLab?.objective ??
    description ??
    `Practice the concepts covered in ${lessonTitle}.`
  );
}

export function resolvePracticeInstructions(
  practiceLab: PracticeLabData | undefined
): string[] {
  if (practiceLab?.instructions && practiceLab.instructions.length > 0) {
    return practiceLab.instructions;
  }
  return DEFAULT_PRACTICE_INSTRUCTIONS;
}

export function resolvePracticeHints(
  practiceLab: PracticeLabData | undefined
): string[] {
  if (practiceLab?.hints && practiceLab.hints.length > 0) {
    return practiceLab.hints;
  }
  return DEFAULT_PRACTICE_HINTS;
}
