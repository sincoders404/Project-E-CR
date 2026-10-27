import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

type SelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/** Compact select (spec 8.18): height 36, radius 10, white bg, border, chevron. */
export function Select({ label, options, value, onChange, className }: SelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="press h-9 w-full appearance-none rounded-[10px] border border-edge bg-surface pr-8 pl-3 text-[13px] font-medium text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  );
}

/** Small square filter-sliders icon button that usually sits next to a Select. */
export function FilterIconButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "press flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-edge bg-surface text-ink-500 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        className,
      )}
    >
      <SlidersHorizontal aria-hidden className="h-4 w-4" />
    </button>
  );
}
