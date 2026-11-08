"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleProvider";
import { getCRRequests, getPendingSignups } from "@/data/queries";
import { SidebarItem, SidebarLogout, NavItemType } from "./SidebarItem";
import { cn } from "@/lib/cn";

export function Sidebar({ expanded = false }: { expanded?: boolean }) {
  const pathname = usePathname();
  const { personaRole, currentUser, sectionCRs, offerings, enrollmentRequests, sections, users } = useRole();

  // Pending counts for badges
  const crPendingRequestsCount = getCRRequests(
    currentUser.id,
    sectionCRs,
    offerings,
    enrollmentRequests
  ).filter((r) => r.status === "pending").length;

  const adminPendingSignupsCount = getPendingSignups(
    currentUser,
    sectionCRs,
    sections,
    users
  ).length;

  // Build nav items based on role
  let navItems: NavItemType[] = [];

  if (personaRole === "Admin") {
    navItems = [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Sign-ups", href: "/admin/signups", icon: "signups", badge: adminPendingSignupsCount },
      { label: "Setup", href: "/admin/setup", icon: "setup" },
      { label: "Admins", href: "/admin/admins", icon: "admins" },
      { label: "Profile", href: "/admin/profile", icon: "profile" },
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ];
  } else if (personaRole === "CR") {
    navItems = [
      { label: "CR Dashboard", href: "/cr", icon: "cr-dashboard" },
      { label: "Requests", href: "/requests", icon: "requests", badge: crPendingRequestsCount },
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Announcements", href: "/announcements", icon: "announcements" },
      { label: "Courses", href: "/courses", icon: "courses" },
      { label: "Routine", href: "/routine", icon: "routine" },
      { label: "Classmates", href: "/classmates", icon: "classmates" },
      { label: "Profile", href: "/profile", icon: "profile" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ];
  } else {
    // Student
    navItems = [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Announcements", href: "/announcements", icon: "announcements" },
      { label: "Courses", href: "/courses", icon: "courses" },
      { label: "Routine", href: "/routine", icon: "routine" },
      { label: "Classmates", href: "/classmates", icon: "classmates" },
      { label: "Profile", href: "/profile", icon: "profile" },
      { label: "Settings", href: "/settings", icon: "settings" },
    ];
  }

  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/cr") return pathname === "/cr";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const homeHref = personaRole === "Admin" ? "/admin" : personaRole === "CR" ? "/cr" : "/dashboard";

  return (
    <div className="flex h-full flex-col p-4">
      {/* Brand block (cap icon + E-CR) */}
      <Link
        href={homeHref}
        className="flex items-center gap-2.5 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-700 text-white"
        >
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className={cn("min-w-0", expanded ? undefined : "hidden xl:block")}>
          <span className="text-base font-bold text-ink-900 tracking-tight">E-CR</span>
          <span className="block text-[11px] text-ink-500">Academic Portal</span>
        </span>
      </Link>

      {/* Nav items */}
      <nav aria-label="Main" className="mt-6 flex flex-col gap-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={isItemActive(item.href)}
            expanded={expanded}
          />
        ))}
      </nav>

      {/* Logout pinned to bottom */}
      <div className="mt-auto border-t border-edge pt-3">
        <SidebarLogout expanded={expanded} />
      </div>
    </div>
  );
}
