"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AccessForm } from "@/components/AccessForm";
import { useMovieAccess } from "@/components/movie/MovieAccessProvider";
import { useMovieQuiz } from "@/components/movie/MovieQuizProvider";
import { scoreMovie } from "@/lib/movie-score";
import { MOVIE_HOME, MOVIE_TEST } from "@/lib/routes";
import { copyResult, joinSitePath, resolveShareSite, shareResult, type ShareSite, type ShareStatus } from "@/lib/share";

const serverShareSite = resolveShareSite({ configuredUrl: process.env.NEXT_PUBLIC_SITE_URL });
let clientShareSite: ShareSite | null = null;

function useShareSite(): ShareSite {
  return useSyncExternalStore(
    () => () => {},
    () => {
      if (!clientShareSite) {
        clientShareSite = resolveShareSite({
          configuredUrl: process.env.NEXT_PUBLIC_SITE_URL,
          origin: window.location.origin,
        });
      }
      return clientShareSite;
    },
    () => serverShareSite,
  );
}

const STATUS_TEXT: Record<ShareStatus, string> = {
  shared: "已打开系统分享。",
  copied: "已复制到剪贴板。",
  cancelled: "已取消分享。",
  failed: "复制失败。请手动选择下方文字。",
};

export function MovieResult() {
  const { ready: accessReady, allowed, accept } = useMovieAccess();
  const { ready, state, reset } = useMovieQuiz();
  const router = useRouter();
  const site = useShareSite();
  const report = useMemo(() => scoreMovie(state.answers), [state.answers]);
  const [status, setStatus] = useState<ShareStatus | null>(null);
  const [failedText, setFailedText] = useState("");

  const shareUrl = joinSitePath(site.url, MOVIE_HOME);
  const shareText = report
    ? [
        "喜剧之王 · 你最像谁",
        report.winner.name,
        ...(report.winner.line ? [report.winner.line] : []),
        "",
        ...report.winner.sections.flatMap((section) => [section.heading, section.text, ""]),
        ...(shareUrl ? ["", shareUrl] : []),
        "",
        "看过电影再做的题，不是性格测试。",
      ].join("\n")
    : "";

  if (!ready || !accessReady) {
    return <p className="px-5 py-20 text-center text-sm text-muted">正在读取保存在当前浏览器中的结果…</p>;
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 py-14">
        <AccessForm
          accept={accept}
          inputId="movie-access-code"
          description="4 位数字，按北京时间当周有效。每周一 0 点更换。只知道网址不能开始测试。"
          errorMessage="测试码不正确，或已经过了这一周。"
        />
      </div>
    );
  }

  if (!report) {
    return (
      <section className="mx-auto w-full max-w-xl px-5 py-16">
        <h1 className="text-3xl font-medium tracking-tight">15 道题还没做完</h1>
        <p className="mt-4 text-base leading-8 text-muted">做完之后，结果只在这台浏览器里生成，不会上传。</p>
        <Link href={MOVIE_TEST} className="btn btn-primary mt-8 w-full sm:w-auto">
          继续测试
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-5 md:py-14">
      <section className="rounded-3xl border border-line bg-card px-5 py-8 md:px-10">
        <p className="text-[11px] tracking-[0.22em] text-sage">KING OF COMEDY</p>
        <p className="mt-6 text-sm text-muted">你最像</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight md:text-6xl">{report.winner.name}</h1>
        {report.winner.line ? <p className="mt-6 text-xl leading-8">{report.winner.line}</p> : null}
        <div className="mt-8 space-y-6">
          {report.winner.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-sm text-sage">{section.heading}</h2>
              <p className="mt-2 text-base leading-8">{section.text}</p>
            </div>
          ))}
        </div>
        {report.tied ? (
          <p className="mt-6 text-sm leading-6 text-muted">有两个人一样接近。按尹天仇、柳飘飘、杜娟儿、洪爷、派饭的达叔、田鸡的顺序，写成排在前面的那位。</p>
        ) : null}
      </section>

      <section className="rounded-3xl border border-line bg-card px-5 py-7 md:px-8">
        <h2 className="text-xl font-medium">把结果留下来</h2>
        <p className="mt-3 text-sm leading-7 text-muted">分享时只写最像的人和一段人物解读，不会带上你每道题的选择。{shareUrl ? "" : "现在这个地址不能公开分享，所以文字里不放网址。"}</p>
        {shareUrl ? <p className="mt-4 text-sm break-all">{shareUrl}</p> : null}
        <div className="mt-6 grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => {
              reset();
              router.push(MOVIE_HOME);
            }}
          >
            重新测试
          </button>
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={() => {
              void copyResult(shareText).then((result) => {
                setStatus(result === "copied" ? "copied" : "failed");
                setFailedText(result === "failed" ? shareText : "");
              });
            }}
          >
            复制结果
          </button>
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={() => {
              void shareResult(shareText, undefined, "喜剧之王").then((result) => {
                setStatus(result);
                setFailedText(result === "failed" ? shareText : "");
              });
            }}
          >
            分享结果
          </button>
        </div>
        <p className="mt-4 min-h-6 text-sm text-muted" role="status">
          {status ? STATUS_TEXT[status] : ""}
        </p>
        {failedText ? (
          <textarea
            readOnly
            value={failedText}
            rows={8}
            className="mt-2 w-full max-w-full resize-y rounded-2xl border border-line bg-background px-4 py-3 text-sm leading-6 break-words"
            onFocus={(event) => event.currentTarget.select()}
          />
        ) : null}
      </section>
      <p className="px-1 text-sm leading-7 text-muted">这是看过《喜剧之王》之后做的题，不是性格测试。带引号的短句来自电影，其余是这套题自己的说法。</p>
    </div>
  );
}
