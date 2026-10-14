import { accessCodeForSecret, shanghaiDay } from "@/lib/access";

export const MOVIE_ACCESS_STORAGE_KEY = "comedy-king-access-v1";
const MOVIE_ACCESS_SECRET = "comedy-king-weekly-gate-v1";
const DAY_MS = 24 * 60 * 60 * 1000;

export interface MovieAccessSnapshot {
  ready: boolean;
  allowed: boolean;
  exp: number;
}

const SERVER_SNAPSHOT: MovieAccessSnapshot = { ready: false, allowed: false, exp: 0 };
let currentSnapshot: MovieAccessSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeMovieAccess(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMovieAccessSnapshot(): MovieAccessSnapshot {
  return currentSnapshot;
}

export function getServerMovieAccessSnapshot(): MovieAccessSnapshot {
  return SERVER_SNAPSHOT;
}

export function shanghaiWeekStart(now = Date.now()): string {
  const day = shanghaiDay(now);
  const noon = Date.parse(`${day}T12:00:00+08:00`);
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", weekday: "short" }).format(noon);
  const index = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
  const sinceMonday = index <= 0 ? 6 : index - 1;
  return shanghaiDay(noon - sinceMonday * DAY_MS);
}

export function shanghaiWeekEnd(now = Date.now()): number {
  return Date.parse(`${shanghaiWeekStart(now)}T00:00:00+08:00`) + 7 * DAY_MS;
}

export async function movieAccessCodeForWeek(weekStart: string): Promise<string> {
  return accessCodeForSecret(MOVIE_ACCESS_SECRET, weekStart);
}

function sameCode(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < input.length; index += 1) {
    diff |= input.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return diff === 0;
}

export async function verifyMovieAccessCode(code: string, now = Date.now()): Promise<number | null> {
  const digits = code.trim();
  if (!/^\d{4}$/.test(digits)) return null;
  const expected = await movieAccessCodeForWeek(shanghaiWeekStart(now));
  if (!sameCode(digits, expected)) return null;
  const exp = shanghaiWeekEnd(now);
  return exp > now ? exp : null;
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredMovieAccess(): string | null {
  try {
    return browserStorage()?.getItem(MOVIE_ACCESS_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveStoredMovieAccess(code: string): void {
  try {
    browserStorage()?.setItem(MOVIE_ACCESS_STORAGE_KEY, code.trim());
  } catch {
    // A refresh will ask for the code again.
  }
}

export function clearStoredMovieAccess(): void {
  try {
    browserStorage()?.removeItem(MOVIE_ACCESS_STORAGE_KEY);
  } catch {
    // The in-memory grant is cleared separately.
  }
}

export async function refreshMovieAccess(): Promise<void> {
  try {
    const exp = await verifyMovieAccessCode(readStoredMovieAccess() ?? "");
    currentSnapshot = { ready: true, allowed: exp !== null, exp: exp ?? 0 };
  } catch {
    currentSnapshot = { ready: true, allowed: false, exp: 0 };
  }
  emit();
}

export async function grantMovieAccess(code: string): Promise<boolean> {
  const exp = await verifyMovieAccessCode(code);
  if (!exp) return false;
  saveStoredMovieAccess(code);
  currentSnapshot = { ready: true, allowed: true, exp };
  emit();
  return true;
}

export function revokeMovieAccess(): void {
  clearStoredMovieAccess();
  currentSnapshot = { ready: true, allowed: false, exp: 0 };
  emit();
}
