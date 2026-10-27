import { cn } from "@/lib/cn";

export type SegmentOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

/** Login role switch (spec 8.8): equal segments on brand-50; active = white + shadow. */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentOption[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("grid grid-cols-2 gap-1 rounded-md bg-brand-50 p-1", className)}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "press flex h-10 items-center justify-center gap-2 rounded-[10px] px-3 text-[13px] font-semibold",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500",
              active ? "bg-surface text-brand-700 shadow-sm ring-1 ring-edge" : "text-ink-500 hover:text-ink-700",
            )}
          >
            {opt.icon && <span aria-hidden className="[&>svg]:h-4 [&>svg]:w-4">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
