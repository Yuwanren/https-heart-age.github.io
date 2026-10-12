"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { initialQuizState, quizReducer } from "@/lib/quiz-state";
import { clearStoredQuiz, loadQuiz, saveQuiz } from "@/lib/storage";
import type { OptionId, QuizState } from "@/types/quiz";

interface QuizContextValue {
  ready: boolean;
  state: QuizState;
  setActualAge: (age: number) => void;
  selectAnswer: (questionId: number, optionId: OptionId) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
}

interface QuizSnapshot {
  ready: boolean;
  stored: QuizState | null;
}

const SERVER_SNAPSHOT: QuizSnapshot = { ready: false, stored: null };
let clientSnapshot: QuizSnapshot | null = null;

function subscribe() {
  return () => {};
}

function getClientSnapshot(): QuizSnapshot {
  if (!clientSnapshot) {
    try {
      clientSnapshot = { ready: true, stored: loadQuiz() };
    } catch {
      clientSnapshot = { ready: true, stored: null };
    }
  }
  return clientSnapshot;
}

function getServerSnapshot(): QuizSnapshot {
  return SERVER_SNAPSHOT;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [applied, setApplied] = useState(false);

  if (snapshot.ready && !applied) {
    setApplied(true);
    if (snapshot.stored) dispatch({ type: "hydrate", state: snapshot.stored });
  }

  useEffect(() => {
    if (!applied) return;
    saveQuiz(state);
  }, [applied, state]);

  const value = useMemo<QuizContextValue>(
    () => ({
      ready: applied,
      state,
      setActualAge: (age) => dispatch({ type: "set-age", age }),
      selectAnswer: (questionId, optionId) => dispatch({ type: "answer", questionId, optionId }),
      next: () => dispatch({ type: "next" }),
      prev: () => dispatch({ type: "prev" }),
      goTo: (index) => dispatch({ type: "go", index }),
      reset: () => {
        clearStoredQuiz();
        dispatch({ type: "reset" });
      },
    }),
    [applied, state],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz 必须在 QuizProvider 内使用");
  }
  return context;
}
