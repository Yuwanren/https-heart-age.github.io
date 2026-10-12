import type { DimensionScore as DimensionScoreModel } from "@/types/quiz";

export function DimensionScore({ dimensions }: { dimensions: DimensionScoreModel[] }) {
  return (
    <section className="rounded-3xl border border-line bg-card px-5 py-8 md:px-10">
      <h2 className="text-2xl font-medium tracking-tight">五个维度</h2>
      <p className="mt-3 text-sm leading-7 text-muted">
        每个维度 4—16 分。百分比按（得分 - 4）/ 12 计算。分数只反映本次答题倾向，不代表心理健康水平或成熟程度。
      </p>
      <div className="mt-8 space-y-6">
        {dimensions.map((dimension) => (
          <div key={dimension.id} className="min-w-0">
            <div className="flex flex-col gap-1 min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between">
              <h3 className="min-w-0 text-base leading-6 font-medium break-words">{dimension.name}</h3>
              <p className="shrink-0 text-sm text-muted tabular-nums">
                {dimension.score}/16 · {dimension.percent}%
              </p>
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
              role="meter"
              aria-valuemin={4}
              aria-valuemax={16}
              aria-valuenow={dimension.score}
              aria-label={`${dimension.name} ${dimension.score} 分`}
            >
              <div
                className="h-full rounded-full bg-sage transition-[width] duration-500"
                style={{ width: `${Math.min(100, Math.max(0, dimension.percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
