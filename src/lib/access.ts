export const ACCESS_STORAGE_KEY = "inner-age-access-v2";

const ACCESS_SECRET = "inner-age-daily-gate-v1";
const SHANGHAI = "Asia/Shanghai";
const DAY_MS = 24 * 60 * 60 * 1000;

export interface AccessSnapshot {
  ready: boolean;
  allowed: boolean;
  exp: number;
}

const SERVER_SNAPSHOT: AccessSnapshot = { ready: false, allowed: false, exp: 0 };
let currentSnapshot: AccessSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeAccess(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAccessSnapshot(): AccessSnapshot {
  return currentSnapshot;
}

export function getServerAccessSnapshot(): AccessSnapshot {
  return SERVER_SNAPSHOT;
}

export function shanghaiDay(now = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHANGHAI,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function shanghaiDayEnd(now = Date.now()): number {
  const start = Date.parse(`${shanghaiDay(now)}T00:00:00+08:00`);
  return start + DAY_MS;
}

export async function accessCodeForSecret(secret: string, key: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${secret}:${key}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const value = ((digest[0] << 8) | digest[1]) % 10000;
  return String(value).padStart(4, "0");
}

export async function accessCodeForDay(day: string): Promise<string> {
  return accessCodeForSecret(ACCESS_SECRET, day);
}

function sameCode(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < input.length; index += 1) {
    diff |= input.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return diff === 0;
}

export async function verifyAccessCode(code: string, now = Date.now()): Promise<number | null> {
  const digits = code.trim();
  if (!/^\d{4}$/.test(digits)) return null;

  const expected = await accessCodeForDay(shanghaiDay(now));
  if (!sameCode(digits, expected)) return null;

  const exp = shanghaiDayEnd(now);
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

export function readStoredAccess(): string | null {
  try {
    return browserStorage()?.getItem(ACCESS_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveStoredAccess(code: string): void {
  try {
    browserStorage()?.setItem(ACCESS_STORAGE_KEY, code.trim());
  } catch {
    // The current page can continue. A refresh will ask for the code again.
  }
}

export function clearStoredAccess(): void {
  try {
    browserStorage()?.removeItem(ACCESS_STORAGE_KEY);
  } catch {
    // Ignore storage failures. The in-memory grant is cleared separately.
  }
}

export async function refreshAccess(): Promise<void> {
  try {
    const exp = await verifyAccessCode(readStoredAccess() ?? "");
    currentSnapshot = { ready: true, allowed: exp !== null, exp: exp ?? 0 };
  } catch {
    currentSnapshot = { ready: true, allowed: false, exp: 0 };
  }
  emit();
}

export async function grantAccess(code: string): Promise<boolean> {
  const exp = await verifyAccessCode(code);
  if (!exp) return false;
  saveStoredAccess(code);
  currentSnapshot = { ready: true, allowed: true, exp };
  emit();
  return true;
}

export function revokeAccess(): void {
  clearStoredAccess();
  currentSnapshot = { ready: true, allowed: false, exp: 0 };
  emit();
}
