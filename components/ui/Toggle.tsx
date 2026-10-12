"use client";

import { cn } from "@/lib/cn";

type ToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

/** 44×24 switch (spec 8.13). role="switch" + aria-checked. */
export function Toggle({ checked, onCheckedChange, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "press relative h-6 w-11 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        checked ? "bg-brand-700" : "bg-edge-strong",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
