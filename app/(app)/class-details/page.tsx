"use client";

import { useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  ExternalLink,
  GraduationCap,
  LayoutGrid,
  Mail,
  Megaphone,
  MessageCircle,
  Monitor,
  Phone,
  Users,
} from "lucide-react";
import { NoticeCard } from "@/components/domain/NoticeCard";
import { RoutineTimeline } from "@/components/domain/RoutineTimeline";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import { RingProgress } from "@/components/ui/RingProgress";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import {
  attendanceHealth,
  classMembers,
  courseHero,
  courseNotices,
  courseResources,
  courseStats,
  facultyContacts,
  leadCR,
  weeklyRoutine,
} from "@/data/course";

type Tab = "notices" | "members" | "faculty";

const statIcons = { people: <Users />, monitor: <Monitor />, layout: <LayoutGrid />, calendar: <CalendarDays /> } as const;

export default function ClassDetailsPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("notices");

  return (
    <div className="flex flex-col gap-6">
      {/* Page top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb segments={courseHero.breadcrumb.map((label) => ({ label }))} trailing={<Chip tone="info" className="ml-1">{courseHero.termChip}</Chip>} />
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => showToast()}>
            <Download aria-hidden className="h-4 w-4" />
            Routine PDF
          </Button>
          <Button onClick={() => showToast()}>
            <BookOpen aria-hidden className="h-4 w-4" />
            View Syllabus
          </Button>
        </div>
      </div>

      {/* Hero card */}
      <Card className="flex flex-col gap-5 rounded-xl p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Chip tone="info">{courseHero.chips[0]}</Chip>
            <Chip tone="info">{courseHero.chips[1]}</Chip>
            <Chip tone="info">{courseHero.chips[2]}</Chip>
          </div>
          <h1 className="mt-3 text-[28px] leading-9 font-extrabold tracking-tight text-ink-900">{courseHero.title}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500">
            <Building2 aria-hidden className="h-4 w-4" />
            {courseHero.meta}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-lg bg-brand-50 p-4 lg:w-[300px]">
          <IconTile tone="brand" size={36} className="bg-white">
            <CalendarDays />
          </IconTile>
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">{courseHero.next.eyebrow}</p>
            <p className="text-xl leading-7 font-extrabold text-ink-900">{courseHero.next.value}</p>
            <p className="text-xs text-ink-500">{courseHero.next.caption}</p>
          </div>
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {courseStats.map((s) => (
          <Card key={s.eyebrow} className="flex items-start gap-3 p-5">
            <IconTile tone="brand">{statIcons[s.icon]}</IconTile>
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">{s.eyebrow}</p>
              <p className="mt-1 truncate text-xl leading-7 font-extrabold text-ink-900">{s.value}</p>
              <p className={s.footerTone === "success" ? "text-[13px] text-success-600" : s.footerTone === "brand" ? "text-[13px] text-brand-700" : "text-[13px] text-ink-500"}>
                {s.footerTone === "success" && <CheckCircle2 aria-hidden className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />}
                {s.footer}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Lead CR strip */}
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <Avatar size={48} initials="FA" />
            <BadgeCheck
              aria-label="Verified"
              className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-white text-brand-700"
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-ink-900">{leadCR.name}</h2>
              <Chip tone="info">{leadCR.chip}</Chip>
            </div>
            <p className="mt-0.5 text-xs text-ink-500">{leadCR.caption}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" className="rounded-full" onClick={() => showToast()}>
            <Mail aria-hidden className="h-4 w-4" />
            {leadCR.email}
          </Button>
          <Button variant="secondary" className="rounded-full" onClick={() => showToast()}>
            <Phone aria-hidden className="h-4 w-4" />
            {leadCR.phone}
          </Button>
          <Button onClick={() => showToast()}>
            <MessageCircle aria-hidden className="h-4 w-4" />
            Message CR
          </Button>
        </div>
      </Card>

      {/* Body */}
      <div className="grid gap-5 xl:grid-cols-[66fr_34fr]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <Tabs
            label="Class information tabs"
            value={tab}
            onChange={(id) => setTab(id as Tab)}
            items={[
              { id: "notices", label: "Notice Board", count: 3, icon: <Megaphone className="h-4 w-4" /> },
              { id: "members", label: "Class Members", count: 42, icon: <Users className="h-4 w-4" /> },
              { id: "faculty", label: "Faculty Contacts", count: 2, icon: <GraduationCap className="h-4 w-4" /> },
            ]}
          />

          <div role="tabpanel" aria-label={tab === "notices" ? "Notice board" : tab === "members" ? "Class members" : "Faculty contacts"} className="flex flex-col gap-4">
            {tab === "notices" && courseNotices.map((n) => <NoticeCard key={n.id} notice={n} />)}

            {tab === "members" &&
              classMembers.map((m) => (
                <Card key={m.id} className="flex items-center gap-3 p-4">
                  <Avatar size={40} initials={m.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{m.name}</p>
                    <p className="text-xs text-ink-500 tabular">{m.studentId}</p>
                  </div>
                  {m.role && <Chip tone="info">{m.role}</Chip>}
                </Card>
              ))}

            {tab === "faculty" &&
              facultyContacts.map((f) => (
                <Card key={f.id} className="flex items-center gap-3 p-4">
                  <Avatar size={40} initials={f.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{f.name}</p>
                    <p className="truncate text-xs text-ink-500">{f.email}</p>
                  </div>
                  <Chip tone="neutral">{f.role}</Chip>
                </Card>
              ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <SectionHeader
              icon={<CalendarDays />}
              title="Weekly Routine"
              action={<Chip tone="info">Spring 2026</Chip>}
            />
            <div className="mt-4">
              <RoutineTimeline days={weeklyRoutine} />
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5">
            <RingProgress value={attendanceHealth.percent} size={96} label={`Class attendance ${attendanceHealth.percent}%`}>
              <span className="text-xl font-extrabold text-ink-900 tabular">{attendanceHealth.percent}%</span>
            </RingProgress>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">{attendanceHealth.detail}</p>
              <p className="mt-0.5 text-xs text-ink-500">{attendanceHealth.caption}</p>
              <Chip tone="success" dot className="mt-2">
                {attendanceHealth.chip}
              </Chip>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader icon={<ClipboardList />} title="Course Resources" />
            <div className="mt-3 flex flex-col gap-2">
              {courseResources.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => showToast()}
                  className="press flex items-center justify-between gap-2 rounded-md bg-brand-50 p-3 text-left hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink-900">{r.label}</span>
                    <span className="block text-[11px] text-ink-500">{r.caption}</span>
                  </span>
                  {"external" in r && r.external ? (
                    <ExternalLink aria-hidden className="h-4 w-4 shrink-0 text-ink-400" />
                  ) : (
                    <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-ink-400" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
