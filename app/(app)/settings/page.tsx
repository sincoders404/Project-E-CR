"use client";

import { useState } from "react";
import { Bell, Mail, Clock, Globe } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10">
      <div className="w-full max-w-[520px]">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Account Preferences
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Configure announcement notifications and class alerts
          </p>
        </div>

        <Card className="p-6 divide-y divide-edge/60">
          {/* Row 1: Email notifications */}
          <div className="flex items-center justify-between py-3.5 first:pt-0">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Email Notifications
                </p>
                <p className="text-xs text-ink-500">
                  Receive email digests of new course announcements
                </p>
              </div>
            </div>
            <Toggle
              checked={emailNotifs}
              onCheckedChange={(val) => {
                setEmailNotifs(val);
                showToast("Notification settings updated locally");
              }}
              label="Email notifications"
            />
          </div>

          {/* Row 2: Push notifications */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Push Notifications
                </p>
                <p className="text-xs text-ink-500">
                  Instant browser notifications when CR broadcasts
                </p>
              </div>
            </div>
            <Toggle
              checked={pushNotifs}
              onCheckedChange={(val) => {
                setPushNotifs(val);
                showToast("Notification settings updated locally");
              }}
              label="Push notifications"
            />
          </div>

          {/* Row 3: Deadline reminders */}
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Clock className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Deadline Reminders
                </p>
                <p className="text-xs text-ink-500">
                  Alert 24 hours prior to homework & lab submissions
                </p>
              </div>
            </div>
            <Toggle
              checked={deadlineReminders}
              onCheckedChange={(val) => {
                setDeadlineReminders(val);
                showToast("Notification settings updated locally");
              }}
              label="Deadline reminders"
            />
          </div>

          {/* Row 4: Language */}
          <div className="flex items-center justify-between py-3.5 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Globe className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Interface Language
                </p>
                <p className="text-xs text-ink-500">
                  Select your preferred portal language
                </p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                showToast(`Language set to ${e.target.value}`);
              }}
              className="h-9 rounded-md border border-edge bg-surface px-3 text-xs font-semibold text-ink-700 focus-visible:outline-brand-500"
            >
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
            </select>
          </div>
        </Card>

        <p className="mt-3 text-center text-xs text-ink-400">
          Preferences are not saved in this demo.
        </p>
      </div>
    </div>
  );
}
