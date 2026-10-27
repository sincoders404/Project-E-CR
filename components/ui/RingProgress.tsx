import { cn } from "@/lib/cn";

type RingProgressProps = {
  value: number; // 0–100
  label: string;
  size?: 48 | 96;
  className?: string;
  children?: React.ReactNode;
};

const STROKE: Record<48 | 96, number> = { 48: 6, 96: 8 };

/** SVG progress ring (spec 8.10). Stroke round caps, brand track/fill, optional centered content. */
export function RingProgress({ value, label, size = 48, className, children }: RingProgressProps) {
  const stroke = STROKE[size];
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-brand-100)" strokeWidth={stroke} />
        <circle
          className="animate-ring motion-reduce:animate-none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-brand-700)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ "--ring-circumference": `${circumference}px` } as React.CSSProperties}
        />
      </svg>
      <span aria-hidden className="absolute inset-0 flex items-center justify-center">
        {children}
      </span>
    </div>
  );
}
