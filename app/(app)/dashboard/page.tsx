"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Code,
  Megaphone,
  Users,
  Zap,
} from "lucide-react";
import { AnnouncementItem } from "@/components/domain/AnnouncementItem";
import { ClassSessionCard } from "@/components/domain/ClassSessionCard";
import { QuickActionRow } from "@/components/domain/QuickActionRow";
import { RosterOfficer } from "@/components/domain/RosterOfficer";
import { StatCard } from "@/components/domain/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { announcements, quickActions, rosterOfficers, specialNotice, todaySchedule } from "@/data/dashboard";
import { activeTerm, currentUser } from "@/data/user";

type Filter = "all" | "urgent" | "exams";

const filterItems = [
  { id: "all", label: "All", count: 8 },
  { id: "urgent", label: "Urgent", count: 2 },
  { id: "exams", label: "Exams" },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? announcements
      : announcements.filter((a) => (filter === "urgent" ? a.kind === "urgent" : a.kind === "exam"));

  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-9 font-extrabold tracking-tight text-ink-900">
            Good Morning, {currentUser.firstName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Here&apos;s what&apos;s happening in your class today and upcoming academic deadlines.
          </p>
        </div>
        <div className="flex h-11 items-center gap-3 rounded-full border border-edge bg-surface px-4">
          <span aria-hidden className="h-2 w-2 rounded-full bg-brand-700" />
          <span className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">{activeTerm.eyebrow}</span>
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            {activeTerm.label}
          </span>
        </div>
      </div>

      {/* Row 1 — stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          eyebrow="Enrolled Course"
          chip={{ tone: "info", label: "Section 02" }}
          tile={{ tone: "brand", icon: <Code /> }}
          value="CSE 221"
          sub="Object Oriented Programming"
          footer={{
            left: (
              <>
                <Users aria-hidden />
                <span>48 Peers</span>
              </>
            ),
            right: (
              <ButtonLink href="/class-details" variant="ghost" size="sm" className="h-auto p-0">
                Rm 402B →
              </ButtonLink>
            ),
          }}
        />
        <StatCard
          eyebrow="Primary Representative"
          chip={{ tone: "success", label: "Active CR" }}
          value={
            <span className="flex items-center gap-2.5">
              <Avatar size={36} initials="NJ" presence />
              <span className="truncate text-lg font-extrabold">Nusrat Jahan</span>
            </span>
          }
          sub="Student ID: 21-1-60-112"
          footer={{
            left: (
              <>
                <CheckCircle2 aria-hidden className="text-success-600" />
                <span className="text-success-600">On Duty</span>
              </>
            ),
            right: (
              <ButtonLink href="/profile" variant="ghost" size="sm" className="h-auto p-0">
                Profile ↗
              </ButtonLink>
            ),
          }}
        />
        <StatCard
          eyebrow="Representative Applications"
          chip={{ tone: "warning", label: "2 In Review" }}
          tile={{ tone: "amber", icon: <ClipboardList /> }}
          valueSize="md"
          value="Join Queue"
          sub="Awaiting CR & Faculty sign-off"
          footer={{
            left: <span>Submitted 2d ago</span>,
            right: (
              <ButtonLink href="/cr-join-requests" variant="ghost" size="sm" className="h-auto p-0">
                Track →
              </ButtonLink>
            ),
          }}
        />
        <StatCard
          eyebrow="Class Bulletin"
          chip={{ tone: "danger", label: "4 Unread" }}
          tile={{ tone: "brand", icon: <Bell /> }}
          valueSize="md"
          value="New Notices"
          sub="Latest: Midterm Routine updated"
          footer={{
            left: <span>Updated 45m ago</span>,
            right: (
              <ButtonLink href="/announcements" variant="ghost" size="sm" className="h-auto p-0">
                Browse →
              </ButtonLink>
            ),
          }}
        />
      </div>

      {/* Row 2 — announcements + right column */}
      <div className="grid gap-5 xl:grid-cols-[65fr_35fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader icon={<Megaphone />} title="Recent Announcements" />
            <Tabs label="Filter announcements" value={filter} onChange={(id) => setFilter(id as Filter)} items={filterItems} />
          </div>
          <div className="mt-4 flex flex-col gap-3" role="tabpanel" aria-label="Announcements">
            {visible.map((a) => (
              <AnnouncementItem key={a.id} item={a} />
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          {/* CR Special Notice */}
          <Card className="bg-grad-notice p-5 text-white">
            <div className="flex items-center justify-between gap-2">
              <Chip className="bg-white/20 text-white" icon={<Megaphone />}>
                CR Special Notice
              </Chip>
              <span className="text-xs text-white/75">Today</span>
            </div>
            <h2 className="mt-3 text-lg font-bold">{specialNotice.title}</h2>
            <p className="mt-2 text-[13px] leading-5 text-white/90 italic">
              “{specialNotice.body}”
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
              <span className="flex items-center gap-2.5">
                <Avatar size={32} initials={specialNotice.authorInitials} />
                <span className="text-[13px] font-semibold">{specialNotice.authorName}</span>
              </span>
              <ButtonLink href="/announcements" variant="ghost" size="sm" className="h-auto p-0 text-white">
                Discuss 💬
              </ButtonLink>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <SectionHeader
              title="Quick Actions"
              action={<Zap aria-hidden className="h-[18px] w-[18px] text-brand-700" />}
            />
            <div className="mt-3 flex flex-col gap-2">
              {quickActions.map((a) => (
                <QuickActionRow key={a.title} action={a} />
              ))}
            </div>
          </Card>

          {/* Class Roster Officers */}
          <Card className="p-5">
            <SectionHeader title="Class Roster Officers" action={<Chip tone="info">2 CRs</Chip>} />
            <div className="mt-3 flex flex-col gap-2">
              {rosterOfficers.map((o) => (
                <RosterOfficer key={o.initials} officer={o} />
              ))}
            </div>
            <ButtonLink href="/class-details" variant="soft" block className="mt-4">
              View Full Class Directory (48 Students)
            </ButtonLink>
          </Card>
        </div>
      </div>

      {/* Row 3 — today's schedule */}
      <Card className="p-5">
        <SectionHeader
          icon={<CalendarDays />}
          title="Today's Class Schedule"
          subtitle="Wednesday, October 15 • 3 Sessions scheduled"
          action={<Chip tone="info">Week 06</Chip>}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {todaySchedule.map((s) => (
            <ClassSessionCard key={s.id} session={s} />
          ))}
        </div>
      </Card>
    </div>
  );
}
