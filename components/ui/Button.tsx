import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "soft" | "danger-soft" | "ghost";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-900",
  secondary:
    "bg-surface text-ink-700 border border-edge-strong hover:bg-brand-50 active:bg-brand-100",
  soft: "bg-brand-100 text-brand-700 hover:bg-brand-100/80 active:bg-brand-500/20",
  "danger-soft":
    "bg-danger-100 text-danger-600 hover:bg-danger-100/80 active:bg-danger-600/20",
  ghost: "text-brand-700 hover:underline underline-offset-4",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

function classesFor({ variant = "primary", size = "md", block }: { variant?: Variant; size?: Size; block?: boolean }) {
  return cn(
    "press inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    variant !== "ghost" && "shadow-sm",
    variantClasses[variant],
    sizeClasses[size],
    block && "w-full",
  );
}

export function Button({
  variant,
  size,
  block,
  className,
  children,
  ...props
}: BaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button className={cn(classesFor({ variant, size, block }), className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  block,
  className,
  children,
  ...props
}: BaseProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={cn(classesFor({ variant, size, block }), className)} {...props}>
      {children}
    </Link>
  );
}
