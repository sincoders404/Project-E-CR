"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, Plus, Search, ChevronDown, Megaphone, HardDrive } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PostFormModal } from "@/components/domain/PostFormModal";
import { ResourceFormModal } from "@/components/domain/ResourceFormModal";
import { getUnreadNotificationsCount } from "@/data/queries";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { personaRole, currentUser, notifications } = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);

  const unreadCount = getUnreadNotificationsCount(currentUser.id, notifications);

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const userSectionId = currentUser.sectionId || "";

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-edge bg-surface">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          {/* Left: Mobile hamburger + Global search */}
          <div className="flex items-center gap-3 flex-1 max-w-[440px]">
            <button
              type="button"
              onClick={onMenu}
              aria-label="Open navigation menu"
              className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500 md:hidden"
            >
              <Menu aria-hidden className="h-5 w-5" />
            </button>

            <div className="relative w-full">
              <Search
                aria-hidden
                className="absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-ink-400"
              />
              <input
                type="search"
                aria-label="Search announcements, courses, resources..."
                placeholder="Search notices, deadlines, drive files..."
                className="h-10 w-full rounded-md border border-transparent bg-brand-50 pr-4 pl-10 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* + New dropdown (CR only) */}
            {personaRole === "CR" && (
              <div className="relative">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>New</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </Button>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 top-11 z-30 min-w-[160px] rounded-lg border border-edge bg-surface p-1 shadow-pop"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setPostModalOpen(true);
                      }}
                      className="press flex w-full items-center gap-2 rounded px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-brand-50"
                    >
                      <Megaphone className="h-4 w-4 text-brand-700" />
                      Post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setResourceModalOpen(true);
                      }}
                      className="press flex w-full items-center gap-2 rounded px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-brand-50"
                    >
                      <HardDrive className="h-4 w-4 text-brand-700" />
                      Upload Resource
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notification bell linking to /notifications with unread count */}
            <Link
              href="/notifications"
              aria-label={`Notifications, ${unreadCount} unread`}
              className="press relative flex h-9 w-9 items-center justify-center rounded-md text-ink-700 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <Bell aria-hidden className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* User name & avatar */}
            <div className="flex items-center gap-2.5 pl-1">
              <span className="hidden text-sm font-bold text-ink-900 md:block">
                {currentUser.name}
              </span>
              <Avatar size={36} initials={initials} />
            </div>
          </div>
        </div>
      </header>

      {/* Modals for CR */}
      {personaRole === "CR" && (
        <>
          <PostFormModal
            open={postModalOpen}
            onClose={() => setPostModalOpen(false)}
            sectionId={userSectionId}
          />
          <ResourceFormModal
            open={resourceModalOpen}
            onClose={() => setResourceModalOpen(false)}
            sectionId={userSectionId}
          />
        </>
      )}
    </>
  );
}
