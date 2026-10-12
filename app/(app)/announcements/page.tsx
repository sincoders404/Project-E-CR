"use client";

import { useState } from "react";
import { Megaphone, Plus, Search } from "lucide-react";
import { AnnouncementItem } from "@/components/domain/AnnouncementItem";
import { RosterOfficer } from "@/components/domain/RosterOfficer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { announcements, rosterOfficers, specialNotice } from "@/data/dashboard";
import type { Announcement } from "@/data/dashboard";

type Filter = "all" | "urgent" | "exams" | "routine" | "meetings";

const filterItems = [
  { id: "all", label: "All", count: 8 },
  { id: "urgent", label: "Urgent", count: 2 },
  { id: "exams", label: "Exams" },
  { id: "routine", label: "Routine" },
  { id: "meetings", label: "Meetings" },
];

function matches(a: Announcement, f: Filter) {
  if (f === "all") return true;
  if (f === "urgent") return a.kind === "urgent";
  if (f === "exams") return a.kind === "exam";
  if (f === "routine") return a.kind === "routine";
  return a.kind === "meeting";
}

export default function AnnouncementsPage() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = announcements.filter(
    (a) =>
      matches(a, filter) &&
      (query.trim() === "" ||
        `${a.title} ${a.body}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-9 font-extrabold tracking-tight text-ink-900">Announcements</h1>
          <p className="mt-1.5 text-sm text-ink-500">All official notices for CSE 221 • Section 02</p>
        </div>
        <Button onClick={() => showToast()} disabled aria-disabled title="Demo only">
          <Plus aria-hidden className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[65fr_35fr]">
        {/* Main list */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs label="Filter announcements" value={filter} onChange={(id) => setFilter(id as Filter)} items={filterItems} />
            <div className="relative w-full sm:w-[220px]">
              <Search aria-hidden className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                aria-label="Search announcements"
                placeholder="Search notices…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full rounded-[10px] border border-edge bg-surface pr-3 pl-9 text-[13px] outline-none placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3" role="tabpanel" aria-label="Announcements">
            {visible.map((a) => (
              <AnnouncementItem key={a.id} item={a} />
            ))}
            {visible.length === 0 && (
              <p className="rounded-md bg-brand-50 p-6 text-center text-[13px] text-ink-500">
                No announcements match this filter.
              </p>
            )}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          <Card className="bg-grad-notice p-5 text-white">
            <div className="flex items-center justify-between gap-2">
              <Chip className="bg-white/20 text-white" icon={<Megaphone />}>
                CR Special Notice
              </Chip>
              <span className="text-xs text-white/75">Today</span>
            </div>
            <h2 className="mt-3 text-lg font-bold">{specialNotice.title}</h2>
            <p className="mt-2 text-[13px] leading-5 text-white/90 italic">“{specialNotice.body}”</p>
            <div className="mt-4 flex items-center gap-2.5 border-t border-white/15 pt-3">
              <Avatar size={32} initials={specialNotice.authorInitials} />
              <span className="text-[13px] font-semibold">{specialNotice.authorName}</span>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Class Roster Officers" action={<Chip tone="info">2 CRs</Chip>} />
            <div className="mt-3 flex flex-col gap-2">
              {rosterOfficers.map((o) => (
                <RosterOfficer key={o.initials} officer={o} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
