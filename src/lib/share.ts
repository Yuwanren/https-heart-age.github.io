import { DISCLAIMER_NOTE } from "@/data/analysis-content";
import { formatAgeGap } from "@/lib/scoring";
import type { QuizReport } from "@/types/quiz";

export interface SharePayload {
  title?: string;
  text?: string;
}

export interface ShareEnvironment {
  share?: (data: SharePayload) => Promise<void>;
  writeText?: (text: string) => Promise<void>;
}

export type ShareStatus = "shared" | "copied" | "cancelled" | "failed";

export function firstSentence(text: string): string {
  const index = text.indexOf("。");
  if (index === -1) return text;
  return text.slice(0, index + 1);
}

export interface ShareSite {
  url: string;
  localPreview: boolean;
}

function parseHttpUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (parsed.username || parsed.password) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function normalizeSiteUrl(value: string): string {
  const parsed = parseHttpUrl(value);
  if (!parsed) return "";
  const path = parsed.pathname.replace(/\/$/, "");
  const port = parsed.port ? `:${parsed.port}` : "";
  return `${parsed.protocol}//${parsed.hostname}${port}${path}${parsed.search}`;
}

function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") return true;
  if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.")) return true;
  const second = /^172\.(\d+)\./.exec(host);
  if (second) {
    const octet = Number(second[1]);
    if (octet >= 16 && octet <= 31) return true;
  }
  return false;
}

function publicUrl(value: string | undefined): string {
  const normalized = normalizeSiteUrl(value ?? "");
  if (!normalized || isLocalHostname(new URL(normalized).hostname)) return "";
  return withBasePath(normalized);
}

function withBasePath(url: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  if (!base || base === "/") return url;
  const normalizedBase = (base.startsWith("/") ? base : `/${base}`).replace(/\/$/, "");
  const parsed = new URL(url);
  if (parsed.pathname && parsed.pathname !== "/") return url;
  parsed.pathname = normalizedBase;
  return normalizeSiteUrl(parsed.toString());
}

export function joinSitePath(siteUrl: string, path: string): string {
  const normalized = normalizeSiteUrl(siteUrl);
  if (!normalized) return "";
  const parsed = new URL(normalized);
  const base = parsed.pathname.replace(/\/$/, "");
  const extra = path.startsWith("/") ? path : `/${path}`;
  parsed.pathname = `${base}${extra}`;
  return normalizeSiteUrl(parsed.toString());
}

export function resolveShareSite(input: { configuredUrl?: string; origin?: string } = {}): ShareSite {
  const configured = publicUrl(input.configuredUrl);
  if (configured) return { url: configured, localPreview: false };

  const origin = publicUrl(input.origin);
  if (origin) return { url: origin, localPreview: false };

  const rawOrigin = normalizeSiteUrl(input.origin ?? "");
  const localPreview =
    process.env.NODE_ENV === "development" ||
    (rawOrigin !== "" && isLocalHostname(new URL(rawOrigin).hostname));
  return { url: "", localPreview };
}

export function buildShareSnippet(report: QuizReport, siteUrl = ""): string {
  const url = normalizeSiteUrl(siteUrl);
  const lines = [
    "INNER AGE · 心理年龄测试",
    `估算心理年龄：${report.mentalAge} 岁`,
    `实际年龄：${report.actualAge} 岁`,
    `年龄差：${formatAgeGap(report.ageGap)} 岁`,
    "",
    firstSentence(report.summary),
  ];
  if (url) lines.push("", url);
  lines.push("", "这是娱乐性估算，不是临床测评，也不会上传答题内容。");
  return lines.join("\n");
}

export function buildShareText(report: QuizReport): string {
  const dimensions = report.dimensions
    .map((dimension) => `${dimension.name}：${dimension.score}/16`)
    .join("\n");

  return [
    "《心理年龄测试》",
    "",
    `估算心理年龄：${report.mentalAge} 岁`,
    `实际年龄：${report.actualAge} 岁`,
    `年龄差：${formatAgeGap(report.ageGap)} 岁`,
    "",
    report.summary,
    "",
    report.ageGapAnalysis,
    "",
    "五个维度",
    dimensions,
    "",
    `主要倾向：${report.synthesis.mainTendency}`,
    "",
    DISCLAIMER_NOTE,
  ].join("\n");
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";
}

function defaultShare(): ShareEnvironment["share"] {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") return undefined;
  return (data) => navigator.share(data);
}

function defaultWrite(): ShareEnvironment["writeText"] {
  if (typeof navigator === "undefined" || !navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
    return undefined;
  }
  return (text) => navigator.clipboard.writeText(text);
}

function provided<K extends keyof ShareEnvironment>(env: ShareEnvironment | undefined, key: K): boolean {
  return !!env && Object.prototype.hasOwnProperty.call(env, key);
}

export async function shareResult(text: string, env?: ShareEnvironment): Promise<ShareStatus> {
  const share = provided(env, "share") ? env?.share : defaultShare();
  const writeText = provided(env, "writeText") ? env?.writeText : defaultWrite();

  if (share) {
    try {
      await share({ title: "心理年龄测试", text });
      return "shared";
    } catch (error) {
      if (isAbortError(error)) return "cancelled";
    }
  }

  if (!writeText) return "failed";

  try {
    await writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

export async function copyResult(text: string, env?: ShareEnvironment): Promise<"copied" | "failed"> {
  const writeText = provided(env, "writeText") ? env?.writeText : defaultWrite();
  if (!writeText) return "failed";
  try {
    await writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
