"use client";

import { Bell, Menu, Search, ShieldCheck, User } from "lucide-react";
import { currentUser } from "@/data/user";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";

/** Topbar (spec 7.3): search · role chip · bell · user block. Collapses below md. */
export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { showToast } = useToast();

  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-surface">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {/* Hamburger (< md) */}
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation menu"
          className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:hidden"
        >
          <Menu aria-hidden className="h-5 w-5" />
        </button>

        {/* Global search */}
        <div className="relative w-full max-w-[440px] flex-1">
          <Search aria-hidden className="absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            aria-label="Search classes, student ID, notices, schedules"
            placeholder="Search classes, student ID, notices, schedules..."
            className="hidden h-10 w-full rounded-md bg-brand-50 pr-4 pl-10 text-[13px] text-ink-900 outline-none placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-brand-500 md:block"
          />
          <button
            type="button"
            aria-label="Search"
            onClick={() => showToast()}
            className="press flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-ink-500 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:hidden"
          >
            <Search aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Role chip */}
          <span className="hidden h-9 items-center gap-1.5 rounded-full border border-edge bg-surface px-3 text-xs font-semibold text-ink-700 lg:inline-flex">
            <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-brand-700" />
            {currentUser.role} · {currentUser.dept}
          </span>

          {/* Notification bell */}
          <button
            type="button"
            aria-label="Notifications, 4 unread"
            onClick={() => showToast()}
            className="press relative flex h-9 w-9 items-center justify-center rounded-md text-ink-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <Bell aria-hidden className="h-5 w-5" />
            <span aria-hidden className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-600" />
          </button>

          {/* User block */}
          <div className="flex items-center gap-2.5">
            <span className="hidden text-right leading-tight sm:block">
              <span className="block text-sm font-bold text-ink-900">{currentUser.name}</span>
              <span className="block text-[11px] text-ink-500 tabular">ID: {currentUser.studentId}</span>
            </span>
            <Avatar size={36} variant="round-icon" presence>
              <User aria-hidden className="h-4 w-4" />
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
