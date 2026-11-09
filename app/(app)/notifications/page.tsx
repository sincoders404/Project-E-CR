"use client";

import { useRouter } from "next/navigation";
import { CheckCheck, Bell } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { getUserNotifications } from "@/data/queries";
import { NotificationItem } from "@/components/domain/NotificationItem";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Notification } from "@/data/types";

export default function NotificationsPage() {
  const router = useRouter();
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useRole();

  const userNotifications = getUserNotifications(currentUser.id, notifications);

  const handleNotificationClick = (item: Notification) => {
    markNotificationRead(item.id);
    if (item.type === "post" || item.type === "deadline") {
      router.push("/announcements");
    } else if (item.type === "resource") {
      router.push("/courses");
    } else {
      router.push("/routine");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Real-time alerts on new announcements, uploaded resources, and approaching deadlines.
          </p>
        </div>

        {userNotifications.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={markAllNotificationsRead}
            className="gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {userNotifications.length === 0 ? (
        <div className="rounded-xl border border-edge bg-surface py-14 shadow-card">
          <EmptyState
            icon={<Bell />}
            title="No notifications"
            caption="You are all caught up with your academic schedule and notices."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {userNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onClick={handleNotificationClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
