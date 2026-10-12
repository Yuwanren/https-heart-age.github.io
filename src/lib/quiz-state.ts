import { QUESTIONS } from "@/data/questions";
import { getAnswer, isQuizComplete, isValidAge } from "@/lib/scoring";
import type { Answers, OptionId, QuizState } from "@/types/quiz";

export const initialQuizState: QuizState = {
  actualAge: null,
  answers: {},
  currentIndex: 0,
};

export type QuizAction =
  | { type: "hydrate"; state: QuizState }
  | { type: "set-age"; age: number }
  | { type: "answer"; questionId: number; optionId: OptionId }
  | { type: "next" }
  | { type: "prev" }
  | { type: "go"; index: number }
  | { type: "reset" };

export function answeredCount(answers: Answers): number {
  return QUESTIONS.filter((question) => getAnswer(answers, question.id) !== undefined).length;
}

export function firstUnansweredIndex(answers: Answers): number {
  const index = QUESTIONS.findIndex((question) => getAnswer(answers, question.id) === undefined);
  return index === -1 ? QUESTIONS.length - 1 : index;
}

export function canGenerateResult(state: QuizState): boolean {
  return isValidAge(state.actualAge) && isQuizComplete(state.answers);
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "set-age":
      if (!isValidAge(action.age)) return state;
      return { ...state, actualAge: action.age };
    case "answer": {
      const exists = QUESTIONS.some((question) => question.id === action.questionId);
      if (!exists || !["A", "B", "C", "D"].includes(action.optionId)) return state;
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.optionId },
      };
    }
    case "next": {
      const question = QUESTIONS[state.currentIndex];
      if (!question || !getAnswer(state.answers, question.id)) return state;
      if (state.currentIndex >= QUESTIONS.length - 1) return state;
      return { ...state, currentIndex: state.currentIndex + 1 };
    }
    case "prev":
      if (state.currentIndex <= 0) return state;
      return { ...state, currentIndex: state.currentIndex - 1 };
    case "go":
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= QUESTIONS.length) return state;
      return { ...state, currentIndex: action.index };
    case "reset":
      return initialQuizState;
    default:
      return state;
  }
}
