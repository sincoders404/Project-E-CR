import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "muted" | "highlight" | "tinted" | "accent-left";
};

/**
 * White rounded card per Spec 9:
 * - default: white bg, shadow-card
 * - muted: grey/muted background
 * - highlight: white bg, shadow-card, 4px brand-700 left border
 */
export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        variant === "default" && "bg-surface shadow-card",
        variant === "muted" && "bg-muted border border-edge",
        (variant === "highlight" || variant === "accent-left") &&
          "bg-surface shadow-card border-l-4 border-l-brand-700",
        variant === "tinted" && "bg-brand-50",
        className
      )}
      {...props}
    />
  );
}
