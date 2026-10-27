import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number; // 0–100
  label: string;
  size?: 6 | 8 | 10;
  segmented?: boolean;
  className?: string;
};

/** Height 8 (default) track brand-100, fill brand-700; animates in on mount (spec 8.9). */
export function ProgressBar({ value, label, size = 8, segmented = false, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  if (segmented) {
    return (
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className={cn("flex gap-1.5", className)}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn("h-2 flex-1 rounded-full", i < Math.round(pct / 50) ? "bg-brand-700" : "bg-brand-100")}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("overflow-hidden rounded-full bg-brand-100", size === 6 ? "h-1.5" : size === 10 ? "h-2.5" : "h-2", className)}
    >
      <div
        className="animate-fill h-full rounded-full bg-brand-700 motion-reduce:animate-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
