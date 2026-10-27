import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
};

/** Card header row (spec 8.16): optional icon + H2 + optional subtitle + right action. */
export function SectionHeader({ title, icon, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="flex items-start gap-2.5">
        {icon && <span aria-hidden className="mt-0.5 text-brand-700 [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>}
        <div>
          <h2 className="text-lg leading-6 font-bold text-ink-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
