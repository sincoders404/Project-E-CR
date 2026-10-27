"use client";

import { useRef } from "react";
import { CountPill } from "./Chip";
import { cn } from "@/lib/cn";

export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** pill: white container (Profile top) · filter: brand-50 container with counts */
  variant?: "pill" | "filter";
  label: string;
  className?: string;
};

/** Pill tabs (spec 8.7) with role=tablist and arrow-key navigation. */
export function Tabs({ items, value, onChange, variant = "filter", label, className }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = items.findIndex((t) => t.id === value);
    const next =
      e.key === "ArrowRight"
        ? (idx + 1) % items.length
        : e.key === "ArrowLeft"
          ? (idx - 1 + items.length) % items.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : -1;
    if (next === -1) return;
    e.preventDefault();
    onChange(items[next].id);
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>("[role='tab']")
      ?.[next]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-md p-1",
        variant === "pill" ? "border border-edge bg-surface" : "bg-brand-50",
        className,
      )}
    >
      {items.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            data-id={tab.id}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "press inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[10px] px-3 text-[13px] font-semibold whitespace-nowrap",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500",
              active
                ? "bg-surface text-brand-700 shadow-sm ring-1 ring-edge"
                : "text-ink-500 hover:text-ink-700",
              variant === "pill" && active && "shadow-card",
            )}
          >
            {tab.icon && <span aria-hidden className="[&>svg]:h-4 [&>svg]:w-4">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && <CountPill count={tab.count} active={active} />}
          </button>
        );
      })}
    </div>
  );
}
