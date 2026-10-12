"use client";

import { useState, useSyncExternalStore } from "react";
import { ShareCard } from "@/components/ShareCard";
import { buildShareSnippet, buildShareText, copyResult, resolveShareSite, shareResult, type ShareSite, type ShareStatus } from "@/lib/share";
import type { QuizReport } from "@/types/quiz";

const STATUS_TEXT: Record<ShareStatus, string> = {
  shared: "已打开系统分享。",
  copied: "已复制到剪贴板。",
  cancelled: "已取消分享。",
  failed: "复制失败。请手动选择下方文字。",
};

const serverShareSite = resolveShareSite({
  configuredUrl: process.env.NEXT_PUBLIC_SITE_URL,
});
let clientShareSite: ShareSite | null = null;

function subscribeToShareSite() {
  return () => {};
}

function getClientShareSite(): ShareSite {
  if (!clientShareSite) {
    clientShareSite = resolveShareSite({
      configuredUrl: process.env.NEXT_PUBLIC_SITE_URL,
      origin: window.location.origin,
    });
  }
  return clientShareSite;
}

function getServerShareSite(): ShareSite {
  return serverShareSite;
}

function useShareSite(): ShareSite {
  return useSyncExternalStore(subscribeToShareSite, getClientShareSite, getServerShareSite);
}

export function ShareButtons({ report, onRetest }: { report: QuizReport; onRetest: () => void }) {
  const fullText = buildShareText(report);
  const site = useShareSite();
  const [status, setStatus] = useState<ShareStatus | null>(null);
  const [failedText, setFailedText] = useState("");
  const snippet = buildShareSnippet(report, site.url);

  async function handleCopy() {
    const result = await copyResult(fullText);
    setStatus(result);
    setFailedText(result === "failed" ? fullText : "");
  }

  async function handleShare() {
    const result = await shareResult(snippet);
    setStatus(result);
    setFailedText(result === "failed" ? snippet : "");
  }

  return (
    <section className="space-y-4">
      <ShareCard report={report} site={site} />
      <div className="rounded-3xl border border-line bg-card px-5 py-7 md:px-8">
        <h2 className="text-xl font-medium">保存这份结果</h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          分享会优先使用系统分享。如果浏览器不支持，或分享失败，会改为复制一段不含完整答案的文字。
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
          <button type="button" className="btn btn-secondary w-full" onClick={onRetest}>
            重新测试
          </button>
          <button type="button" className="btn btn-secondary w-full" onClick={handleCopy}>
            复制测试结果
          </button>
          <button type="button" className="btn btn-primary w-full" onClick={handleShare}>
            分享结果
          </button>
        </div>
        <p className="mt-4 min-h-6 text-sm text-muted" role="status" aria-live="polite">
          {status ? STATUS_TEXT[status] : ""}
        </p>
        {failedText ? (
          <div className="mt-2">
            <label htmlFor="manual-copy" className="text-sm text-foreground">
              手动复制
            </label>
            <textarea
              id="manual-copy"
              readOnly
              value={failedText}
              rows={8}
              className="mt-2 w-full max-w-full resize-y rounded-2xl border border-line bg-background px-4 py-3 text-sm leading-6 break-words"
              onFocus={(event) => event.currentTarget.select()}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
