import { cn } from "@/lib/cn";

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  trailing?: React.ReactNode;
  className?: string;
};

/** Tinted credential row (spec 8.14): 36px white icon tile + label/value stack + optional action. */
export function InfoRow({ icon, label, value, trailing, className }: InfoRowProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-md bg-brand-50 p-3", className)}>
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-700 [&>svg]:h-[18px] [&>svg]:w-[18px]"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-ink-500">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-900">{value}</p>
      </div>
      {trailing}
    </div>
  );
}
