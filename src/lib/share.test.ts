import assert from "node:assert/strict";
import test from "node:test";
import { DISCLAIMER_NOTE } from "@/data/analysis-content";
import { QUESTIONS } from "@/data/questions";
import { generateReport } from "@/lib/result-generator";
import { buildShareSnippet, buildShareText, copyResult, joinSitePath, normalizeSiteUrl, resolveShareSite, shareResult } from "@/lib/share";
import type { Answers } from "@/types/quiz";

function allAnswers(): Answers {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, "C"]));
}

test("the short share text includes the card facts and not the full answer list", () => {
  const report = generateReport(28, allAnswers());
  assert.ok(report);
  const snippet = buildShareSnippet(report, "https://example.com/path/");
  assert.match(snippet, /INNER AGE/);
  assert.match(snippet, new RegExp(`估算心理年龄：${report.mentalAge} 岁`));
  assert.match(snippet, /年龄差/);
  assert.match(snippet, /https:\/\/example\.com\/path/);
  assert.equal(snippet.includes("当一件期待很久的事情突然失败时"), false);
  assert.equal(snippet.includes(report.ageGapAnalysis), false);
  assert.equal(normalizeSiteUrl("javascript:alert(1)"), "");
  assert.equal(normalizeSiteUrl(" https://example.com/ "), "https://example.com");
  assert.equal(resolveShareSite({ configuredUrl: "https://age.example.com/" }).url, "https://age.example.com");
  assert.equal(resolveShareSite({ configuredUrl: "https://age.example.com/" }).localPreview, false);
  const local = resolveShareSite({ configuredUrl: "http://localhost:3000", origin: "http://127.0.0.1:3000" });
  assert.equal(local.url, "");
  assert.equal(local.localPreview, true);
  assert.equal(resolveShareSite({ origin: "https://age.example.com" }).url, "https://age.example.com");
  assert.equal(resolveShareSite({ origin: "http://192.168.1.8:3000" }).url, "");
  const hidden = buildShareSnippet(report, resolveShareSite({ origin: "http://localhost:3000" }).url);
  assert.equal(hidden.includes("localhost"), false);
  assert.equal(hidden.includes("127.0.0.1"), false);
});

test("a test path is appended to the public site url", () => {
  assert.equal(joinSitePath("https://innerage.fun", "/age"), "https://innerage.fun/age");
  assert.equal(joinSitePath("https://user.github.io/heart-age/", "/age"), "https://user.github.io/heart-age/age");
  assert.equal(joinSitePath("", "/age"), "");
});

test("a public site root can include the configured base path", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH;
  process.env.NEXT_PUBLIC_BASE_PATH = "/heart-age";
  try {
    assert.equal(resolveShareSite({ origin: "https://user.github.io" }).url, "https://user.github.io/heart-age");
    assert.equal(resolveShareSite({ configuredUrl: "https://user.github.io/heart-age/" }).url, "https://user.github.io/heart-age");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = previous;
  }
});

test("the full copied result still includes the disclaimer", () => {
  const report = generateReport(28, allAnswers());
  assert.ok(report);
  const text = buildShareText(report);
  assert.match(text, new RegExp(`估算心理年龄：${report.mentalAge} 岁`));
  assert.match(text, /实际年龄：28 岁/);
  assert.match(text, new RegExp(DISCLAIMER_NOTE));
  assert.match(text, /情绪与自我调节/);
});

test("sharing falls back to copy when the share API is missing or fails", async () => {
  let copied = "";
  const missing = await shareResult("结果", {
    share: undefined,
    writeText: async (text) => {
      copied = text;
    },
  });
  assert.equal(missing, "copied");
  assert.equal(copied, "结果");

  const failedShare = await shareResult("结果", {
    share: async () => {
      throw new Error("unsupported");
    },
    writeText: async () => {},
  });
  assert.equal(failedShare, "copied");
});

test("cancelling share does not copy, and copy failure is reported", async () => {
  let called = false;
  const abort = new Error("cancelled");
  abort.name = "AbortError";
  const cancelled = await shareResult("结果", {
    share: async () => {
      throw abort;
    },
    writeText: async () => {
      called = true;
    },
  });
  assert.equal(cancelled, "cancelled");
  assert.equal(called, false);

  const failed = await shareResult("结果", {
    share: async () => {
      throw new Error("blocked");
    },
    writeText: async () => {
      throw new Error("clipboard denied");
    },
  });
  assert.equal(failed, "failed");
  assert.equal(await copyResult("结果", { writeText: undefined }), "failed");
  assert.equal(await copyResult("结果", {
    writeText: async () => {
      throw new Error("denied");
    },
  }), "failed");
});

test("a successful share does not need the clipboard", async () => {
  const status = await shareResult("结果", {
    share: async (data) => {
      assert.equal(data.text, "结果");
      assert.equal(data.title, "心理年龄测试");
    },
    writeText: async () => {
      throw new Error("should not copy");
    },
  });
  assert.equal(status, "shared");
});
