import { cn } from "@/lib/cn";

type Tone = "brand" | "amber" | "success" | "danger" | "violet";

type IconTileProps = {
  tone?: Tone;
  size?: 36 | 40;
  className?: string;
  children: React.ReactNode;
};

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-700",
  amber: "bg-amber-tile text-amber-accent",
  success: "bg-success-100 text-success-600",
  danger: "bg-danger-100 text-danger-600",
  violet: "bg-violet-tile text-violet-accent",
};

/** 40×40 (or 36) radius-12 soft-colour tile with a matching 20px icon (spec 8.6). */
export function IconTile({ tone = "brand", size = 40, className, children }: IconTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md [&>svg]:h-5 [&>svg]:w-5",
        size === 40 ? "h-10 w-10" : "h-9 w-9",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
