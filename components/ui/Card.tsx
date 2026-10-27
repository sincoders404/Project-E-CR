import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "tinted" | "accent-left";
};

/**
 * White rounded card. Variants per spec 8.1:
 * - default: white bg, card shadow
 * - tinted: brand-50 bg, no shadow (nested rows / banner cards)
 * - accent-left: 4px brand-700 left border
 */
export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        variant === "default" && "bg-surface shadow-card",
        variant === "tinted" && "bg-brand-50",
        variant === "accent-left" && "bg-surface shadow-card border-l-4 border-l-brand-700",
        className,
      )}
      {...props}
    />
  );
}
