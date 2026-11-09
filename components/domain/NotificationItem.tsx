"use client";

import { Megaphone, Calendar, HardDrive, Bell } from "lucide-react";
import { Notification } from "@/data/types";
import { cn } from "@/lib/cn";

type NotificationItemProps = {
  notification: Notification;
  onClick: (notification: Notification) => void;
};

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const isUnread = !notification.readAt;

  const iconMap = {
    post: <Megaphone className="h-4 w-4 text-brand-700" />,
    deadline: <Calendar className="h-4 w-4 text-warning-600" />,
    resource: <HardDrive className="h-4 w-4 text-violet-accent" />,
    reminder: <Bell className="h-4 w-4 text-brand-700" />,
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={cn(
        "press flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-all",
        isUnread
          ? "border-brand-200 bg-brand-50/60 shadow-xs"
          : "border-edge bg-surface hover:bg-brand-50/20"
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isUnread ? "bg-white shadow-xs" : "bg-muted"
          )}
        >
          {iconMap[notification.type]}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-xs font-bold leading-tight truncate",
                isUnread ? "text-brand-900 font-extrabold" : "text-ink-900"
              )}
            >
              {notification.title}
            </h4>
            {isUnread && (
              <span className="h-1.5 w-1.5 rounded-full bg-brand-700 shrink-0" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-600 line-clamp-1">
            {notification.message}
          </p>
          <span className="mt-1 block text-[10px] text-ink-400">
            {notification.createdAt.split("T")[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
