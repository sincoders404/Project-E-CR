import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

/** 18×18 checkbox, brand-700 fill with white check when on (spec 8.12). */
export function Checkbox({ checked, onCheckedChange, label, className }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 text-[13px] text-ink-700 select-none", className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border transition-colors duration-150 ease-out",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500",
          checked ? "border-brand-700 bg-brand-700" : "border-edge-strong bg-white",
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}
