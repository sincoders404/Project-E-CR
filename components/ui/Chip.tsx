import { cn } from "@/lib/cn";

type Tone = "info" | "neutral" | "purple" | "success" | "warning" | "danger";

type ChipProps = {
  tone?: Tone;
  pill?: boolean;
  dot?: boolean;
  dotClassName?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const toneClasses: Record<Tone, string> = {
  info: "bg-brand-100 text-brand-700",
  neutral: "bg-slate-chip text-ink-700",
  purple: "bg-violet-tile text-violet-accent",
  success: "bg-success-100 text-success-600",
  warning: "bg-warning-100 text-warning-600",
  danger: "bg-danger-100 text-danger-600",
};

const dotToneClasses: Record<Tone, string> = {
  info: "bg-brand-700",
  neutral: "bg-ink-500",
  purple: "bg-violet-accent",
  success: "bg-success-600",
  warning: "bg-brand-700",
  danger: "bg-danger-600",
};

/**
 * Small pill/rect chip per spec 8.3. Height 22–24, text 11–12/600.
 * Optional 6px leading dot or small leading icon.
 */
export function Chip({
  tone = "info",
  pill = false,
  dot = false,
  dotClassName,
  icon,
  className,
  children,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] shrink-0 items-center gap-1.5 px-2.5 text-[11px] font-semibold leading-none",
        pill ? "rounded-full" : "rounded-[6px]",
        toneClasses[tone],
        className,
      )}
    >
      {dot && (
        <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", dotToneClasses[tone], dotClassName)} />
      )}
      {icon && <span aria-hidden className="flex [&>svg]:h-3 [&>svg]:w-3">{icon}</span>}
      {children}
    </span>
  );
}

/** Count pill used in tabs (spec 8.3 `outline-count`). */
export function CountPill({
  count,
  active = false,
  className,
}: {
  count: number;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular",
        active ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700",
        className,
      )}
    >
      {count}
    </span>
  );
}
