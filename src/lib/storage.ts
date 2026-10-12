import { QUESTIONS } from "@/data/questions";
import { isValidAge } from "@/lib/scoring";
import type { Answers, OptionId, QuizState } from "@/types/quiz";

export const STORAGE_KEY = "inner-age-quiz-v1";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const OPTION_IDS = new Set<OptionId>(["A", "B", "C", "D"]);

export function serializeQuiz(state: QuizState): string {
  return JSON.stringify({
    version: 1,
    actualAge: state.actualAge,
    answers: state.answers,
    currentIndex: state.currentIndex,
  });
}

export function parseStoredQuiz(raw: string | null): QuizState | null {
  if (!raw) return null;

  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;

    const record = data as Record<string, unknown>;
    if (record.version !== 1) return null;

    const actualAge = record.actualAge === null ? null : record.actualAge;
    if (actualAge !== null && !isValidAge(actualAge)) return null;

    const answers: Answers = {};
    if (record.answers && typeof record.answers === "object") {
      for (const question of QUESTIONS) {
        const value = (record.answers as Record<string, unknown>)[String(question.id)];
        if (typeof value === "string" && OPTION_IDS.has(value as OptionId)) {
          answers[question.id] = value as OptionId;
        }
      }
    }

    const currentIndex =
      typeof record.currentIndex === "number" &&
      Number.isInteger(record.currentIndex) &&
      record.currentIndex >= 0 &&
      record.currentIndex < QUESTIONS.length
        ? record.currentIndex
        : 0;

    return { actualAge, answers, currentIndex };
  } catch {
    return null;
  }
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadQuiz(storage: StorageLike | null = getBrowserStorage()): QuizState | null {
  if (!storage) return null;
  try {
    return parseStoredQuiz(storage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveQuiz(state: QuizState, storage: StorageLike | null = getBrowserStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, serializeQuiz(state));
  } catch {
    // Storage can be unavailable in private mode. The quiz still works in memory.
  }
}

export function clearStoredQuiz(storage: StorageLike | null = getBrowserStorage()): void {
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures. The in-memory state is cleared separately.
  }
}
