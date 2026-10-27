import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { navMain, navSystem } from "@/data/navigation";
import { SidebarItem, SidebarLogout } from "./SidebarItem";
import { cn } from "@/lib/cn";

function NavItemActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/** Sidebar (spec 7.2): 220px white rail; collapses to a 72px icon rail below xl. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col p-4">
      {/* Brand block */}
      <Link href="/dashboard" className="flex items-start gap-3 rounded-md p-1 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-700 text-white"
        >
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="hidden min-w-0 xl:block">
          <span className="flex items-center gap-1.5">
            <span className="text-base font-bold text-ink-900">E-CR</span>
            <span className="rounded-[4px] bg-brand-100 px-1 py-px text-[9px] leading-[14px] font-bold text-brand-700">
              PORTAL
            </span>
          </span>
          <span className="block text-xs text-ink-500">Academic Operations</span>
        </span>
      </Link>

      {/* Workspace */}
      <p aria-hidden className="mt-5 mb-2 hidden px-3 text-[11px] leading-[14px] font-bold tracking-[0.06em] text-ink-400 uppercase xl:block">
        Workspace
      </p>
      <p aria-hidden className="mt-5 mb-2 px-3 text-center text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase xl:hidden">
        ·
      </p>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {navMain.map((item) => (
          <SidebarItem key={item.href} item={item} active={NavItemActive(item.href, pathname)} />
        ))}
      </nav>

      {/* System */}
      <p aria-hidden className="mt-5 mb-2 hidden px-3 text-[11px] leading-[14px] font-bold tracking-[0.06em] text-ink-400 uppercase xl:block">
        System
      </p>
      <nav aria-label="System" className="flex flex-col gap-1">
        {navSystem.map((item) => (
          <SidebarItem key={item.href} item={item} active={NavItemActive(item.href, pathname)} />
        ))}
      </nav>

      {/* Logout pinned to bottom */}
      <div className={cn("mt-auto border-t border-edge pt-3")}>
        <SidebarLogout />
      </div>
    </div>
  );
}
