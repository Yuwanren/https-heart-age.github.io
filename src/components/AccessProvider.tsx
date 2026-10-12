"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  getAccessSnapshot,
  getServerAccessSnapshot,
  grantAccess,
  refreshAccess,
  subscribeAccess,
  type AccessSnapshot,
} from "@/lib/access";

interface AccessContextValue extends AccessSnapshot {
  accept: (code: string) => Promise<boolean>;
}

const AccessContext = createContext<AccessContextValue | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeAccess, getAccessSnapshot, getServerAccessSnapshot);

  useEffect(() => {
    void refreshAccess();
  }, []);

  const value = useMemo<AccessContextValue>(
    () => ({
      ...snapshot,
      accept: grantAccess,
    }),
    [snapshot],
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (!context) throw new Error("useAccess 必须在 AccessProvider 内使用");
  return context;
}
