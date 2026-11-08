import Link from "next/link";
import {
  LayoutGrid,
  BookOpen,
  Calendar,
  Users,
  Megaphone,
  User,
  Settings,
  ShieldCheck,
  UserPlus,
  Sliders,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type NavItemKey =
  | "dashboard"
  | "cr-dashboard"
  | "announcements"
  | "courses"
  | "routine"
  | "classmates"
  | "requests"
  | "signups"
  | "setup"
  | "admins"
  | "profile"
  | "settings";

export type NavItemType = {
  label: string;
  href: string;
  icon: NavItemKey;
  badge?: number;
};

const iconMap = {
  dashboard: LayoutGrid,
  "cr-dashboard": ShieldCheck,
  announcements: Megaphone,
  courses: BookOpen,
  routine: Calendar,
  classmates: Users,
  requests: UserPlus,
  signups: UserPlus,
  setup: Sliders,
  admins: ShieldCheck,
  profile: User,
  settings: Settings,
};

type SidebarItemProps = {
  item: NavItemType;
  active: boolean;
  expanded?: boolean;
};

export function SidebarItem({ item, active, expanded = false }: SidebarItemProps) {
  const Icon = iconMap[item.icon];

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={cn(
        "press group relative flex h-10 items-center gap-3 rounded-md px-3 text-sm focus-visible:outline-2 focus-visible:outline-brand-500",
        active
          ? "bg-brand-700 font-semibold text-white shadow-xs"
          : "font-medium text-ink-700 hover:bg-brand-50"
      )}
    >
      <Icon aria-hidden className="h-[18px] w-[18px] shrink-0" />
      <span className={cn("min-w-0 flex-1 truncate", expanded ? undefined : "hidden xl:inline")}>
        {item.label}
      </span>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular",
            expanded ? "flex" : "absolute top-1/2 right-2 hidden -translate-y-1/2 xl:flex",
            active ? "bg-white text-brand-700" : "bg-brand-100 text-brand-700"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function SidebarLogout({ expanded = false }: { expanded?: boolean }) {
  return (
    <Link
      href="/login"
      className="press flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-danger-600 hover:bg-danger-100 focus-visible:outline-2 focus-visible:outline-danger-600"
    >
      <LogOut aria-hidden className="h-[18px] w-[18px] shrink-0" />
      <span className={cn(expanded ? undefined : "hidden xl:inline")}>Logout</span>
    </Link>
  );
}
