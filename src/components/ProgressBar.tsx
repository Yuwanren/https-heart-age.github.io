interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted">
        <span>已完成 {value} / {max}</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="答题进度"
      >
        <div className="h-full rounded-full bg-sage transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
