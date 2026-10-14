import { MOVIE_QUESTIONS, type MovieOptionId } from "@/data/movie";
import { initialMovieState, type MovieQuizState } from "@/lib/movie-storage";

export type MovieAction =
  | { type: "hydrate"; state: MovieQuizState }
  | { type: "answer"; questionId: number; optionId: MovieOptionId }
  | { type: "next" }
  | { type: "prev" }
  | { type: "go"; index: number }
  | { type: "reset" };

export function movieReducer(state: MovieQuizState, action: MovieAction): MovieQuizState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "answer":
      return { ...state, answers: { ...state.answers, [action.questionId]: action.optionId } };
    case "next":
      return { ...state, currentIndex: Math.min(state.currentIndex + 1, MOVIE_QUESTIONS.length - 1) };
    case "prev":
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };
    case "go":
      return {
        ...state,
        currentIndex: Math.min(Math.max(action.index, 0), MOVIE_QUESTIONS.length - 1),
      };
    case "reset":
      return initialMovieState;
    default:
      return state;
  }
}

export function answeredMovieCount(answers: MovieQuizState["answers"]): number {
  return MOVIE_QUESTIONS.filter((question) => answers[question.id]).length;
}

export function canFinishMovie(state: MovieQuizState): boolean {
  return answeredMovieCount(state.answers) === MOVIE_QUESTIONS.length;
}

export function firstUnansweredMovie(answers: MovieQuizState["answers"]): number {
  const index = MOVIE_QUESTIONS.findIndex((question) => !answers[question.id]);
  return index === -1 ? 0 : index;
}
