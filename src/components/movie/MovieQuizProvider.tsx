"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, useSyncExternalStore, type ReactNode } from "react";
import { movieReducer } from "@/lib/movie-state";
import { clearStoredMovieQuiz, initialMovieState, loadMovieQuiz, saveMovieQuiz, type MovieQuizState } from "@/lib/movie-storage";
import type { MovieOptionId } from "@/data/movie";

interface MovieQuizContextValue {
  ready: boolean;
  state: MovieQuizState;
  selectAnswer: (questionId: number, optionId: MovieOptionId) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
}

interface MovieSnapshot {
  ready: boolean;
  stored: MovieQuizState | null;
}

const SERVER_SNAPSHOT: MovieSnapshot = { ready: false, stored: null };
let clientSnapshot: MovieSnapshot | null = null;

function subscribe() {
  return () => {};
}

function getClientSnapshot(): MovieSnapshot {
  if (!clientSnapshot) {
    try {
      clientSnapshot = { ready: true, stored: loadMovieQuiz() };
    } catch {
      clientSnapshot = { ready: true, stored: null };
    }
  }
  return clientSnapshot;
}

const MovieQuizContext = createContext<MovieQuizContextValue | null>(null);

export function MovieQuizProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, () => SERVER_SNAPSHOT);
  const [state, dispatch] = useReducer(movieReducer, initialMovieState);
  const [applied, setApplied] = useState(false);

  if (snapshot.ready && !applied) {
    setApplied(true);
    if (snapshot.stored) dispatch({ type: "hydrate", state: snapshot.stored });
  }

  useEffect(() => {
    if (!applied) return;
    saveMovieQuiz(state);
  }, [applied, state]);

  const value = useMemo<MovieQuizContextValue>(
    () => ({
      ready: applied,
      state,
      selectAnswer: (questionId, optionId) => dispatch({ type: "answer", questionId, optionId }),
      next: () => dispatch({ type: "next" }),
      prev: () => dispatch({ type: "prev" }),
      goTo: (index) => dispatch({ type: "go", index }),
      reset: () => {
        clearStoredMovieQuiz();
        clientSnapshot = { ready: true, stored: null };
        dispatch({ type: "reset" });
      },
    }),
    [applied, state],
  );

  return <MovieQuizContext.Provider value={value}>{children}</MovieQuizContext.Provider>;
}

export function useMovieQuiz() {
  const context = useContext(MovieQuizContext);
  if (!context) throw new Error("useMovieQuiz 必须在 MovieQuizProvider 内使用");
  return context;
}
