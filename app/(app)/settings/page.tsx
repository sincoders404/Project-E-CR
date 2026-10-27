"use client";

import { useState } from "react";
import { Bell, Globe, Lock, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { preferences } from "@/data/profile";
import { cn } from "@/lib/cn";

type Section = "profile" | "notifications" | "appearance" | "privacy";

const sections: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { id: "appearance", label: "Appearance", icon: <Globe className="h-4 w-4" /> },
  { id: "privacy", label: "Privacy", icon: <Lock className="h-4 w-4" /> },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("notifications");
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(preferences.map((p) => [p.label, p.on])),
  );
  const [language, setLanguage] = useState("English");

  function flip(label: string) {
    setToggles((t) => ({ ...t, [label]: !t[label] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] leading-9 font-extrabold tracking-tight text-ink-900">Settings</h1>
        <p className="mt-1.5 text-sm text-ink-500">Manage portal preferences.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        {/* Sub-nav */}
        <Card className="h-fit p-2">
          <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:flex-col">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                aria-current={section === s.id ? "true" : undefined}
                className={cn(
                  "press flex h-10 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500",
                  section === s.id ? "bg-brand-700 text-white" : "text-ink-700 hover:bg-brand-50",
                )}
              >
                <span aria-hidden>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <Card className="p-5" role="tabpanel" aria-label={`${section} settings`}>
          {section === "notifications" || section === "profile" ? (
            <div className="flex flex-col gap-3">
              {preferences.map((p) => (
                <div key={p.label} className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink-900">{p.label}</p>
                    <p className="truncate text-[11px] text-ink-500">{p.caption}</p>
                  </div>
                  <Toggle checked={toggles[p.label] ?? false} onCheckedChange={() => flip(p.label)} label={p.label} />
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-brand-50 p-3">
                <div>
                  <p className="text-sm font-bold text-ink-900">Language</p>
                  <p className="text-[11px] text-ink-500">Portal display language</p>
                </div>
                <Select label="Language" options={["English", "বাংলা"]} value={language} onChange={setLanguage} className="w-40" />
              </div>
            </div>
          ) : section === "appearance" ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900">Compact density</p>
                  <p className="text-[11px] text-ink-500">Tighter spacing across tables</p>
                </div>
                <Toggle checked={false} onCheckedChange={() => {}} label="Compact density" />
              </div>
              <p className="text-[13px] text-ink-500">
                Dark mode is not part of this design pass — the token system is ready for it later.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900">Profile visibility</p>
                  <p className="text-[11px] text-ink-500">Classmates can see your name and section</p>
                </div>
                <Toggle checked onCheckedChange={() => {}} label="Profile visibility" />
              </div>
              <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900">Show attendance to CRs</p>
                  <p className="text-[11px] text-ink-500">Representatives see your presence ratios</p>
                </div>
                <Toggle checked onCheckedChange={() => {}} label="Show attendance to CRs" />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
