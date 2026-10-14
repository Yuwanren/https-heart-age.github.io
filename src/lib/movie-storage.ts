import { MOVIE_QUESTIONS, type MovieOptionId } from "@/data/movie";

export const MOVIE_STORAGE_KEY = "comedy-king-quiz-v1";

export interface MovieQuizState {
  answers: Record<number, MovieOptionId>;
  currentIndex: number;
}

export const initialMovieState: MovieQuizState = { answers: {}, currentIndex: 0 };

const OPTION_IDS = new Set<MovieOptionId>(["A", "B", "C", "D"]);

export function serializeMovieQuiz(state: MovieQuizState): string {
  return JSON.stringify({ version: 1, answers: state.answers, currentIndex: state.currentIndex });
}

export function parseStoredMovieQuiz(raw: string | null): MovieQuizState | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const record = data as Record<string, unknown>;
    if (record.version !== 1) return null;

    const answers: Record<number, MovieOptionId> = {};
    if (record.answers && typeof record.answers === "object") {
      for (const question of MOVIE_QUESTIONS) {
        const value = (record.answers as Record<string, unknown>)[String(question.id)];
        if (typeof value === "string" && OPTION_IDS.has(value as MovieOptionId)) {
          answers[question.id] = value as MovieOptionId;
        }
      }
    }

    const currentIndex =
      typeof record.currentIndex === "number" &&
      Number.isInteger(record.currentIndex) &&
      record.currentIndex >= 0 &&
      record.currentIndex < MOVIE_QUESTIONS.length
        ? record.currentIndex
        : 0;

    return { answers, currentIndex };
  } catch {
    return null;
  }
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadMovieQuiz(): MovieQuizState | null {
  try {
    return parseStoredMovieQuiz(browserStorage()?.getItem(MOVIE_STORAGE_KEY) ?? null);
  } catch {
    return null;
  }
}

export function saveMovieQuiz(state: MovieQuizState): void {
  try {
    browserStorage()?.setItem(MOVIE_STORAGE_KEY, serializeMovieQuiz(state));
  } catch {
    // The current visit can continue. A refresh will not restore it.
  }
}

export function clearStoredMovieQuiz(): void {
  try {
    browserStorage()?.removeItem(MOVIE_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
