import { cn } from "@/lib/cn";

type Size = 32 | 36 | 40 | 48 | 56 | 88;

type AvatarProps = {
  size?: Size;
  initials?: string;
  src?: string;
  alt?: string;
  /** Round icon variant (topbar) — renders a user glyph on brand-700. */
  variant?: "initials" | "photo" | "round-icon";
  /** 10px green presence dot, bottom-right. */
  presence?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const sizeClass: Record<Size, string> = {
  32: "h-8 w-8 text-[11px]",
  36: "h-9 w-9 text-xs",
  40: "h-10 w-10 text-[13px]",
  48: "h-12 w-12 text-sm",
  56: "h-14 w-14 text-base",
  88: "h-[88px] w-[88px] text-2xl",
};

export function Avatar({
  size = 36,
  initials,
  src,
  alt = "",
  variant = "initials",
  presence = false,
  className,
  children,
}: AvatarProps) {
  const shape =
    variant === "photo" ? "rounded-2xl" : variant === "round-icon" || !initials ? "rounded-full" : "rounded-md";

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- local static placeholders, no optimisation needed
        <img src={src} alt={alt} width={size} height={size} className={cn(sizeClass[size], "object-cover", shape)} />
      ) : (
        <span
          aria-hidden
          className={cn(
            "inline-flex items-center justify-center font-bold",
            sizeClass[size],
            shape,
            variant === "round-icon"
              ? "bg-brand-700 text-white"
              : variant === "initials" && initials
                ? "bg-brand-100 text-brand-700"
                : "bg-brand-100 text-brand-700",
          )}
        >
          {children ?? initials}
        </span>
      )}
      {presence && (
        <span
          aria-hidden
          className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-success-600"
        />
      )}
    </span>
  );
}
