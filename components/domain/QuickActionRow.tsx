import Link from "next/link";
import { Calendar, ChevronRight, MessageCircle, Monitor, UserPlus } from "lucide-react";
import type { QuickAction } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const icons = { monitor: Monitor, "user-plus": UserPlus, calendar: Calendar, chat: MessageCircle } as const;
const tileTone = {
  brand: "bg-brand-100 text-brand-700",
  success: "bg-success-100 text-success-600",
  warning: "bg-amber-tile text-amber-accent",
  info: "bg-brand-100 text-brand-700",
} as const;

/** Tinted quick-action row (spec 8.19) with 36px coloured tile and chevron. */
export function QuickActionRow({ action }: { action: QuickAction }) {
  const Icon = icons[action.icon];
  const inner = (
    <>
      <span aria-hidden className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md [&>svg]:h-[18px] [&>svg]:w-[18px]", tileTone[action.tone])}>
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink-900">{action.title}</span>
        <span className="block truncate text-[11px] text-ink-500">{action.caption}</span>
      </span>
      <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-ink-400" />
    </>
  );

  const classes =
    "press flex items-center gap-3 rounded-md bg-brand-50 p-3 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

  if (action.href.startsWith("#")) {
    return (
      <span className={cn(classes, "cursor-default")} aria-disabled>
        {inner}
      </span>
    );
  }
  return (
    <Link href={action.href} className={classes}>
      {inner}
    </Link>
  );
}
