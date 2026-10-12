import Link from "next/link";
import {
  LayoutGrid,
  Monitor,
  UserPlus,
  Megaphone,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import type { NavItem } from "@/data/navigation";
import { cn } from "@/lib/cn";

const icons = {
  "layout-grid": LayoutGrid,
  monitor: Monitor,
  "user-plus": UserPlus,
  megaphone: Megaphone,
  user: User,
  settings: Settings,
} as const;

type SidebarItemProps = {
  item: NavItem;
  active: boolean;
};

/** 40px nav item (spec 7.2). Solid brand-700 pill when active; count badge inverts. */
export function SidebarItem({ item, active }: SidebarItemProps) {
  const Icon = icons[item.icon];
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={cn(
        "press group relative flex h-10 items-center gap-3 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500",
        active ? "bg-brand-700 font-semibold text-white" : "font-medium text-ink-700 hover:bg-brand-50",
      )}
    >
      <Icon aria-hidden className="h-[18px] w-[18px] shrink-0" />
      <span className="hidden truncate xl:inline">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cn(
            "absolute top-1/2 right-2 hidden h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular xl:flex",
            active ? "bg-white text-brand-700" : "bg-brand-100 text-brand-700",
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

/** Pinned bottom logout item (red, navigates to /login). */
export function SidebarLogout() {
  return (
    <Link
      href="/login"
      className="press flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-danger-600 hover:bg-danger-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-danger-600"
    >
      <LogOut aria-hidden className="h-[18px] w-[18px]" />
      <span className="hidden xl:inline">Logout</span>
    </Link>
  );
}
