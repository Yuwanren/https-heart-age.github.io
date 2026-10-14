"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  getMovieAccessSnapshot,
  getServerMovieAccessSnapshot,
  grantMovieAccess,
  refreshMovieAccess,
  subscribeMovieAccess,
  type MovieAccessSnapshot,
} from "@/lib/movie-access";

interface MovieAccessContextValue extends MovieAccessSnapshot {
  accept: (code: string) => Promise<boolean>;
}

const MovieAccessContext = createContext<MovieAccessContextValue | null>(null);

export function MovieAccessProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeMovieAccess, getMovieAccessSnapshot, getServerMovieAccessSnapshot);

  useEffect(() => {
    void refreshMovieAccess();
  }, []);

  const value = useMemo<MovieAccessContextValue>(
    () => ({ ...snapshot, accept: grantMovieAccess }),
    [snapshot],
  );

  return <MovieAccessContext.Provider value={value}>{children}</MovieAccessContext.Provider>;
}

export function useMovieAccess() {
  const context = useContext(MovieAccessContext);
  if (!context) throw new Error("useMovieAccess 必须在 MovieAccessProvider 内使用");
  return context;
}
