export type AttemptStatus = "correct" | "incorrect" | "skipped";

export type Tense =
  | "present"
  | "preterite"
  | "imperfect"
  | "future"
  | "conditional"
  | "present_subjunctive";

export type ProgressEvent = {
  timestamp: number;
  infinitive: string;
  tense: Tense;
  pronoun:
    | "yo"
    | "tú"
    | "él"
    | "ella"
    | "usted"
    | "nosotros"
    | "vosotros"
    | "ellos"
    | "ellas"
    | "ustedes";
  status: AttemptStatus;
};

export type ConjugationStats = {
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  lastSeen: number;
  history: { timestamp: number; status: AttemptStatus }[];
};

export type VerbStats = {
  attempts: number;
  correct: number;
  incorrect: number;
  skipped: number;
  lastSeen: number;
};

export type ProgressStore = {
  byConjugation: Record<string, ConjugationStats>;
  byVerb: Record<string, VerbStats>;
  vocabularyByTerm: Record<string, VerbStats>;
};

const STORAGE_KEY = "conjugr8.progress.v1";
const HISTORY_LIMIT = 50;

function getInitialStore(): ProgressStore {
  return { byConjugation: {}, byVerb: {}, vocabularyByTerm: {} };
}

function makeKey(infinitive: string, tense: Tense, pronoun: ProgressEvent["pronoun"]): string {
  return `${infinitive}|${tense}|${pronoun}`;
}

export function readProgress(): ProgressStore {
  if (typeof window === "undefined") return getInitialStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialStore();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (!parsed || typeof parsed !== "object") return getInitialStore();
    if (!(parsed as Partial<ProgressStore>).vocabularyByTerm) {
      (parsed as ProgressStore).vocabularyByTerm = {};
    }
    return parsed as ProgressStore;
  } catch {
    return getInitialStore();
  }
}

function saveProgress(store: ProgressStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function recordAttempt(event: ProgressEvent): void {
  const store = readProgress();
  const key = makeKey(event.infinitive, event.tense, event.pronoun);
  const byConj = store.byConjugation[key] ?? {
    seenCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    skippedCount: 0,
    lastSeen: 0,
    history: [],
  };
  byConj.seenCount += 1;
  if (event.status === "correct") byConj.correctCount += 1;
  if (event.status === "incorrect") byConj.incorrectCount += 1;
  if (event.status === "skipped") byConj.skippedCount += 1;
  byConj.lastSeen = Math.max(byConj.lastSeen, event.timestamp);
  byConj.history.push({ timestamp: event.timestamp, status: event.status });
  if (byConj.history.length > HISTORY_LIMIT) {
    byConj.history = byConj.history.slice(-HISTORY_LIMIT);
  }
  store.byConjugation[key] = byConj;

  const byVerb = store.byVerb[event.infinitive] ?? {
    attempts: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    lastSeen: 0,
  };
  byVerb.attempts += 1;
  if (event.status === "correct") byVerb.correct += 1;
  if (event.status === "incorrect") byVerb.incorrect += 1;
  if (event.status === "skipped") byVerb.skipped += 1;
  byVerb.lastSeen = Math.max(byVerb.lastSeen, event.timestamp);
  store.byVerb[event.infinitive] = byVerb;

  saveProgress(store);
}

export function computeVerbLeaderboard(minAttempts = 3): Array<{
  infinitive: string;
  attempts: number;
  accuracy: number;
}> {
  const store = readProgress();
  const entries = Object.entries(store.byVerb).map(([infinitive, s]) => ({
    infinitive,
    attempts: s.attempts,
    accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0,
  }));
  return entries
    .filter((e) => e.attempts >= minAttempts)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
}

export function overallSummary(): { attempts: number; accuracy: number } {
  const store = readProgress();
  let attempts = 0;
  let correct = 0;
  for (const s of Object.values(store.byVerb)) {
    attempts += s.attempts;
    correct += s.correct;
  }
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  return { attempts, accuracy };
}

// Vocabulary tracking
export type VocabularyEvent = {
  timestamp: number;
  term: string;
  status: AttemptStatus; // correct = "I know it", incorrect = "I don't know it", skipped = "skip"
};

export function recordVocabularyAttempt(event: VocabularyEvent): void {
  const store = readProgress();
  const stats = store.vocabularyByTerm[event.term] ?? {
    attempts: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0,
    lastSeen: 0,
  };
  stats.attempts += 1;
  if (event.status === "correct") stats.correct += 1;
  if (event.status === "incorrect") stats.incorrect += 1;
  if (event.status === "skipped") stats.skipped += 1;
  stats.lastSeen = Math.max(stats.lastSeen, event.timestamp);
  store.vocabularyByTerm[event.term] = stats;
  saveProgress(store);
}

export function vocabularyLeaderboard(minAttempts = 1): Array<{
  term: string;
  attempts: number;
  accuracy: number;
}> {
  const store = readProgress();
  const entries = Object.entries(store.vocabularyByTerm).map(([term, s]) => ({
    term,
    attempts: s.attempts,
    accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0,
  }));
  return entries
    .filter((e) => e.attempts >= minAttempts)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
}

// Combined familiarity across verbs (byVerb) and vocabulary (vocabularyByTerm)
export function computeFamiliarityByWord(minAttempts = 1): Array<{
  word: string;
  attempts: number;
  accuracy: number;
  score: number; // 0..100 familiarity
  type: "verb" | "vocab";
}> {
  const store = readProgress();
  const results: Array<{ word: string; attempts: number; accuracy: number; score: number; type: "verb" | "vocab" }> = [];
  for (const [infinitive, s] of Object.entries(store.byVerb)) {
    const attempts = s.attempts;
    const accuracy = attempts > 0 ? (s.correct / attempts) * 100 : 0;
    const saturation = Math.min(1, attempts / 8); // saturate around ~8 attempts
    const score = Math.round(accuracy * saturation);
    results.push({ word: infinitive, attempts, accuracy: Math.round(accuracy), score, type: "verb" });
  }
  for (const [term, s] of Object.entries(store.vocabularyByTerm)) {
    const attempts = s.attempts;
    const accuracy = attempts > 0 ? (s.correct / attempts) * 100 : 0;
    const saturation = Math.min(1, attempts / 8);
    const score = Math.round(accuracy * saturation);
    results.push({ word: term, attempts, accuracy: Math.round(accuracy), score, type: "vocab" });
  }
  return results
    .filter((e) => e.attempts >= minAttempts)
    .sort((a, b) => b.score - a.score || b.attempts - a.attempts || b.accuracy - a.accuracy);
}

export function computeAccuracyByTense(): Array<{
  tense: Tense;
  attempts: number;
  accuracy: number;
}> {
  const store = readProgress();
  const agg: Record<Tense, { attempts: number; correct: number }> = {
    present: { attempts: 0, correct: 0 },
    preterite: { attempts: 0, correct: 0 },
    imperfect: { attempts: 0, correct: 0 },
    future: { attempts: 0, correct: 0 },
    conditional: { attempts: 0, correct: 0 },
    present_subjunctive: { attempts: 0, correct: 0 },
  };
  for (const [key, s] of Object.entries(store.byConjugation)) {
    const parts = key.split("|");
    const tense = parts[1] as Tense;
    const attempts = s.seenCount;
    const correct = s.correctCount;
    const entry = agg[tense];
    entry.attempts += attempts;
    entry.correct += correct;
  }
  const result: Array<{ tense: Tense; attempts: number; accuracy: number }> = [];
  (Object.keys(agg) as Tense[]).forEach((tense) => {
    const { attempts, correct } = agg[tense];
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    result.push({ tense, attempts, accuracy });
  });
  return result.sort((a, b) => a.attempts - b.attempts || a.tense.localeCompare(b.tense));
}

export type EstimatedLevel = {
  label: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
  progressToNext: number; // 0..100
  score: number; // raw score
};

export function estimateLevel(): EstimatedLevel {
  const store = readProgress();
  let wordsKnown = 0;
  let verbsMastered = 0;
  for (const s of Object.values(store.byVerb)) {
    const attempts = s.attempts;
    const accuracy = attempts > 0 ? (s.correct / attempts) * 100 : 0;
    if (attempts >= 3 && accuracy >= 70) wordsKnown += 1;
    if (attempts >= 5 && accuracy >= 80) verbsMastered += 1;
  }
  for (const s of Object.values(store.vocabularyByTerm)) {
    const attempts = s.attempts;
    const accuracy = attempts > 0 ? (s.correct / attempts) * 100 : 0;
    if (attempts >= 3 && accuracy >= 70) wordsKnown += 1;
  }
  const score = Math.round(wordsKnown + verbsMastered * 1.5);

  const thresholds: Array<{ label: EstimatedLevel["label"]; min: number }> = [
    { label: "A1", min: 0 },
    { label: "A2", min: 50 },
    { label: "B1", min: 120 },
    { label: "B2", min: 250 },
    { label: "C1", min: 400 },
    { label: "C2", min: 600 },
    { label: "Native", min: 900 },
  ];
  let current = thresholds[0];
  let next = thresholds[1];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i].min) {
      current = thresholds[i];
      next = thresholds[Math.min(i + 1, thresholds.length - 1)];
      break;
    }
  }
  const range = Math.max(1, next.min - current.min);
  const progressToNext = Math.max(0, Math.min(100, Math.round(((score - current.min) / range) * 100)));
  return { label: current.label, progressToNext, score };
}

export function computeGrammarScore(): number {
  const tenses = computeAccuracyByTense();
  const level = estimateLevel().label;
  const weights: Record<EstimatedLevel["label"], Partial<Record<Tense, number>>> = {
    A1: { present: 1 },
    A2: { present: 0.6, preterite: 0.4, imperfect: 0.4, future: 0.4, conditional: 0.2 },
    B1: { present: 0.4, preterite: 0.4, imperfect: 0.4, future: 0.4, conditional: 0.3, present_subjunctive: 0.2 },
    B2: { present: 0.3, preterite: 0.4, imperfect: 0.4, future: 0.3, conditional: 0.3, present_subjunctive: 0.3 },
    C1: { present: 0.2, preterite: 0.3, imperfect: 0.3, future: 0.2, conditional: 0.2, present_subjunctive: 0.5 },
    C2: { present: 0.2, preterite: 0.3, imperfect: 0.3, future: 0.2, conditional: 0.2, present_subjunctive: 0.5 },
    Native: { present: 0.2, preterite: 0.3, imperfect: 0.3, future: 0.2, conditional: 0.2, present_subjunctive: 0.5 },
  } as any;
  const w = weights[level] || weights.A1;
  let sum = 0;
  let denom = 0;
  for (const t of tenses) {
    const weight = (w as any)[t.tense] ?? 0;
    sum += t.accuracy * weight;
    denom += weight * 100;
  }
  const pct = denom > 0 ? Math.round((sum / denom) * 100) : 0;
  return pct;
}


