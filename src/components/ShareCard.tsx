import { formatAgeGap } from "@/lib/scoring";
import { firstSentence, type ShareSite } from "@/lib/share";
import type { QuizReport } from "@/types/quiz";

export function ShareCard({ report, site }: { report: QuizReport; site: ShareSite }) {
  const url = site.url;
  const gapText =
    report.ageGap === 0
      ? "与实际年龄相同"
      : report.ageGap > 0
        ? `比实际年龄高 ${report.ageGap} 岁`
        : `比实际年龄低 ${Math.abs(report.ageGap)} 岁`;

  return (
    <article className="w-full max-w-full overflow-hidden rounded-3xl border border-line bg-card px-5 py-8">
      <p className="text-[11px] tracking-[0.18em] text-sage">INNER AGE</p>
      <h2 className="mt-2 text-lg font-medium">心理年龄测试</h2>
      <p className="mt-6 text-sm text-muted">估算心理年龄</p>
      <p className="mt-1 flex items-end gap-2">
        <span className="text-6xl leading-none font-light tabular-nums">{report.mentalAge}</span>
        <span className="mb-1 text-base text-muted">岁</span>
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5">
        <div className="min-w-0">
          <dt className="text-xs text-muted">实际年龄</dt>
          <dd className="mt-1 text-xl tabular-nums">{report.actualAge}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted">年龄差</dt>
          <dd className="mt-1 text-xl tabular-nums">{formatAgeGap(report.ageGap)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-sm text-muted">{gapText}</p>
      <p className="mt-5 text-base leading-7 break-words">{firstSentence(report.summary)}</p>
      <p className="mt-6 text-sm break-all text-foreground">{url || "结果只保存在当前浏览器，不会上传。"}</p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-2 text-xs leading-5 text-muted">
          本地开发预览。分享内容不会使用 localhost。
          {url ? " 上面的网址来自 NEXT_PUBLIC_SITE_URL。" : " 正式域名请配置 NEXT_PUBLIC_SITE_URL。"}
        </p>
      ) : null}
      {!url && site.localPreview && process.env.NODE_ENV !== "development" ? (
        <p className="mt-2 text-xs leading-5 text-muted">当前访问地址不是公开网址，因此没有写入分享文案。</p>
      ) : null}
      <p className="mt-2 text-xs leading-5 text-muted">娱乐性估算，不是临床测评。卡片适合截图，不包含完整答题内容。</p>
    </article>
  );
}
