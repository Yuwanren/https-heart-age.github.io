import type { DimensionAnalysis as DimensionAnalysisModel } from "@/types/quiz";

const FIELDS = [
  ["当前表现倾向", "trait"],
  ["可能的优势", "strength"],
  ["可能忽略的部分", "blindSpot"],
  ["可执行的成长建议", "suggestion"],
] as const;

export function DimensionAnalysis({ analysis }: { analysis: DimensionAnalysisModel }) {
  return (
    <article className="rounded-3xl border border-line bg-card px-5 py-7 md:px-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 text-xl leading-snug font-medium break-words">{analysis.name}</h3>
        <p className="shrink-0 text-right text-sm text-muted tabular-nums">
          <span className="block text-xs">当前得分</span>
          {analysis.score}/16
        </p>
      </div>
      <dl className="mt-6 space-y-5">
        {FIELDS.map(([label, key]) => (
          <div key={key}>
            <dt className="text-sm text-sage">{label}</dt>
            <dd className="mt-2 text-base leading-8 break-words">{analysis[key]}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
