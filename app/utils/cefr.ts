export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export const CEFR_STEPS: readonly LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// How many of the six CEFR steps are reached; Native fills all of them.
export function cefrStepsReached(level: LanguageLevel): number {
  if (level === "Native") return CEFR_STEPS.length;
  return CEFR_STEPS.indexOf(level) + 1;
}

export function cefrLabel(level: LanguageLevel): string {
  const labels: Record<LanguageLevel, string> = {
    A1: "Beginner",
    A2: "Elementary",
    B1: "Intermediate",
    B2: "Upper intermediate",
    C1: "Advanced",
    C2: "Proficient",
    Native: "Native",
  };
  return labels[level];
}
