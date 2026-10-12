export const ACCESS_STORAGE_KEY = "inner-age-access-v1";
export const ACCESS_TTL_MS = 24 * 60 * 60 * 1000;
export const ACCESS_PUBLIC_KEY_SPKI =
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEiXSHMfvknNHy7Ttn4EVE5U5L6fsHPzXBsWXzFfRjvd0DaiAzoA/qXmc+79BdVc3HuKjhhSbmqxnu5RqbHnqoBw==";

export interface AccessSnapshot {
  ready: boolean;
  allowed: boolean;
  exp: number;
}

const SERVER_SNAPSHOT: AccessSnapshot = { ready: false, allowed: false, exp: 0 };
let currentSnapshot: AccessSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let publicKeyPromise: Promise<CryptoKey> | null = null;

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

function copyBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

function bytesFromBase64(value: string): Uint8Array | null {
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  } catch {
    return null;
  }
}

function bytesFromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return bytesFromBase64(padded + pad);
}

async function importPublicKey(spki: string): Promise<CryptoKey> {
  const bytes = bytesFromBase64(spki);
  if (!bytes) throw new Error("invalid public key");
  return crypto.subtle.importKey("spki", copyBytes(bytes), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
}

export async function verifyAccessCode(
  code: string,
  now = Date.now(),
  publicKeySpki = ACCESS_PUBLIC_KEY_SPKI,
): Promise<number | null> {
  const trimmed = code.trim();
  const dot = trimmed.indexOf(".");
  if (dot <= 0) return null;

  const expText = trimmed.slice(0, dot);
  const signature = bytesFromBase64Url(trimmed.slice(dot + 1));
  if (!/^\d{13}$/.test(expText) || !signature) return null;

  const exp = Number(expText);
  if (!Number.isSafeInteger(exp) || exp <= now) return null;

  try {
    if (publicKeySpki === ACCESS_PUBLIC_KEY_SPKI) {
      publicKeyPromise ??= importPublicKey(publicKeySpki);
    }
    const key = publicKeySpki === ACCESS_PUBLIC_KEY_SPKI ? await publicKeyPromise! : await importPublicKey(publicKeySpki);
    const valid = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      copyBytes(signature),
      new TextEncoder().encode(expText),
    );
    return valid ? exp : null;
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
