import { formatAgeGap } from "@/lib/scoring";
import type { QuizReport } from "@/types/quiz";

export function ResultHero({ report }: { report: QuizReport }) {
  const gapText =
    report.ageGap === 0
      ? "与实际年龄相同"
      : report.ageGap > 0
        ? `比实际年龄高 ${report.ageGap} 岁`
        : `比实际年龄低 ${Math.abs(report.ageGap)} 岁`;

  return (
    <section className="rounded-3xl border border-line bg-card px-5 py-7 md:px-10 md:py-10">
      <p className="text-sm text-sage">估算心理年龄</p>
      <div className="mt-4 flex items-end gap-2">
        <p className="text-6xl leading-none font-light tracking-tight tabular-nums md:text-7xl">{report.mentalAge}</p>
        <p className="mb-1 text-lg text-muted">岁</p>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
        这是自定义规则换算出的估算值，范围是 18—60 岁。它不是客观的心理发展年龄。
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
        <div className="min-w-0">
          <dt className="text-sm text-muted">实际年龄</dt>
          <dd className="mt-1 text-2xl tabular-nums">{report.actualAge}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm text-muted">年龄差</dt>
          <dd className="mt-1 text-2xl tabular-nums">{formatAgeGap(report.ageGap)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm leading-6 text-muted">{gapText}</p>
    </section>
  );
}
