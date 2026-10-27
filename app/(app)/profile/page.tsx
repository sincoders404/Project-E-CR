"use client";

import { useState } from "react";
import {
  BookOpen,
  Camera,
  ChevronDown,
  ClipboardList,
  Clock,
  Copy,
  GraduationCap,
  IdCard,
  KeyRound,
  LogOut,
  Mail,
  Medal,
  MessageCircle,
  MonitorSmartphone,
  Network,
  Pencil,
  Phone,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { CourseRow } from "@/components/domain/CourseRow";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { InfoRow } from "@/components/ui/InfoRow";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RingProgress } from "@/components/ui/RingProgress";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import {
  credentials,
  cumulativeGpa,
  electionStatus,
  enrolledCourses,
  evaluationWindow,
  extraCourses,
  gpaHistory,
  honors,
  loginActivity,
  securityOptions,
} from "@/data/profile";
import { currentUser } from "@/data/user";

type Tab = "personal" | "records" | "security";

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      {children}
    </button>
  );
}

function PersonalInfoTab() {
  const { showToast } = useToast();
  const [smsOn, setSmsOn] = useState(true);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="grid gap-5 xl:grid-cols-[40fr_60fr]">
      {/* Left column */}
      <div className="flex flex-col gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="text-brand-700">
                <ShieldCheck className="h-[18px] w-[18px]" />
              </span>
              <h2 className="text-lg leading-6 font-bold text-ink-900">Institutional Credentials</h2>
            </span>
            <Chip tone="success" dot>
              Status: Active
            </Chip>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <InfoRow
              icon={<Mail />}
              label="Institutional Email"
              value={currentUser.email}
              trailing={
                <IconButton label="Copy email address" onClick={() => showToast("Demo only — email copied")}>
                  <Copy className="h-4 w-4" />
                </IconButton>
              }
            />
            <InfoRow icon={<Phone />} label="Primary Phone" value={currentUser.phone} />
            <div className="rounded-md bg-brand-50 p-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-700"
                >
                  <Network className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-ink-500">Academic Faculty</p>
                  <p className="truncate text-sm font-semibold text-ink-900">{currentUser.faculty}</p>
                </div>
              </div>
              <dl className="mt-3 space-y-2 border-t border-edge pt-3">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-[11px] text-ink-500">Curriculum Major</dt>
                  <dd className="text-[13px] font-semibold text-ink-900">{currentUser.major}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-[11px] text-ink-500">Batch Registration</dt>
                  <dd className="text-[13px] font-semibold text-ink-900">{currentUser.batch}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-[11px] text-ink-500">Assigned Section</dt>
                  <dd className="text-[13px] font-semibold text-brand-700">{currentUser.cohort}</dd>
                </div>
              </dl>
            </div>
            <InfoRow
              icon={<IdCard />}
              label="Guardian Contact"
              value={currentUser.guardian}
              trailing={
                <IconButton label={`Call ${currentUser.guardian}`} onClick={() => showToast()}>
                  <Phone className="h-4 w-4" />
                </IconButton>
              }
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-edge pt-3 text-[11px]">
            <span className="text-ink-500">{credentials.sync}</span>
            <button
              type="button"
              onClick={() => showToast()}
              className="press flex items-center gap-1 font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <RefreshCw aria-hidden className="h-3.5 w-3.5" />
              Re-verify
            </button>
          </div>
        </Card>

        {/* Evaluation window banner */}
        <Card variant="tinted" className="flex items-start gap-3 p-4">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-700"
          >
            <ClipboardList className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-ink-900">{evaluationWindow.title}</h2>
            <p className="mt-1 text-[13px] leading-5 text-ink-700">{evaluationWindow.body}</p>
            <button
              type="button"
              onClick={() => showToast()}
              className="press mt-2 text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {evaluationWindow.cta} →
            </button>
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-5">
        {/* Election status */}
        <Card variant="accent-left" className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Election Status</p>
                <Chip tone="info" className="h-5">
                  {electionStatus.chip}
                </Chip>
              </div>
              <h2 className="mt-1.5 text-lg leading-6 font-extrabold text-ink-900">{electionStatus.title}</h2>
            </div>
            <div className="text-right">
              <Chip tone="info" dot>
                {electionStatus.pill}
              </Chip>
              <button
                type="button"
                onClick={() => showToast()}
                className="press mt-1.5 block text-xs font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                View CR Guideline →
              </button>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-ink-700">{electionStatus.body}</p>
          <div className="mt-3 flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-ink-700">{electionStatus.thresholdLabel}</span>
            <span className="font-semibold text-ink-500 tabular">{electionStatus.votes}</span>
          </div>
          <ProgressBar value={electionStatus.percent} size={10} label={`Peer endorsements ${electionStatus.votes}`} className="mt-2" />
        </Card>

        {/* Current semester courses */}
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg leading-6 font-bold text-ink-900">Current Semester Courses</h2>
              <p className="mt-0.5 text-xs text-ink-500">Active modules, faculty in-charge & presence ratios</p>
            </div>
            <button
              type="button"
              onClick={() => showToast()}
              className="press flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <SlidersHorizontal aria-hidden className="h-4 w-4" />
              Filter
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {enrolledCourses.map((c) => (
              <CourseRow key={c.id} course={c} />
            ))}
            {expanded && extraCourses.map((c) => <CourseRow key={c.id} course={c} />)}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="press mx-auto mt-3 flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {expanded ? (
              <>Show fewer courses ⌃</>
            ) : (
              <>
                Show all 6 registered courses
                <ChevronDown aria-hidden className="h-4 w-4" />
              </>
            )}
          </button>
        </Card>

        {/* Account preferences */}
        <Card className="p-5">
          <h2 className="text-lg leading-6 font-bold text-ink-900">Account Preferences & Safety</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-700"
              >
                <KeyRound className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">Portal Password</p>
                <p className="truncate text-[11px] text-ink-500">Changed 45 days ago</p>
              </div>
              <Button variant="soft" size="sm" onClick={() => showToast()}>
                Update
              </Button>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-700"
              >
                <MessageCircle className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">SMS Class Alerts</p>
                <p className="truncate text-[11px] text-ink-500">Instant reschedule pings</p>
              </div>
              <Toggle checked={smsOn} onCheckedChange={setSmsOn} label="SMS class alerts" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AcademicRecordsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <h2 className="text-lg leading-6 font-bold text-ink-900">Semester GPA</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-edge text-[11px] tracking-[0.06em] text-ink-400 uppercase">
                <th scope="col" className="py-2 pr-4 font-bold">Semester</th>
                <th scope="col" className="py-2 pr-4 font-bold">Credits</th>
                <th scope="col" className="py-2 pr-4 font-bold">GPA</th>
                <th scope="col" className="py-2 font-bold">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {gpaHistory.map((r) => (
                <tr key={r.semester} className="border-b border-edge last:border-0">
                  <td className="py-2.5 pr-4 font-semibold text-ink-900">{r.semester}</td>
                  <td className="py-2.5 pr-4 text-ink-700 tabular">{r.credits}</td>
                  <td className="py-2.5 pr-4 font-bold text-ink-900 tabular">{r.gpa}</td>
                  <td className="py-2.5 text-ink-500">{r.remarks}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2.5 pr-4 font-bold text-ink-900">{cumulativeGpa.label}</td>
                <td className="py-2.5 pr-4 font-semibold text-ink-900 tabular">{cumulativeGpa.credits}</td>
                <td className="py-2.5 pr-4 font-extrabold text-brand-700 tabular">{cumulativeGpa.gpa}</td>
                <td className="py-2.5" />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg leading-6 font-bold text-ink-900">Attendance by Course</h2>
        <div className="mt-3 flex flex-col gap-3">
          {[...enrolledCourses, ...extraCourses].map((c) => (
            <CourseRow key={c.id} course={c} bare />
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg leading-6 font-bold text-ink-900">Honors & Activities</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {honors.map((h) => (
            <Chip key={h} tone="info" pill>
              {h}
            </Chip>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const { showToast } = useToast();
  const [twoFactor, setTwoFactor] = useState<boolean>(securityOptions.twoFactor.on);
  const [alerts, setAlerts] = useState<boolean>(securityOptions.loginAlerts.on);

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="p-5">
        <h2 className="text-lg leading-6 font-bold text-ink-900">Login Activity</h2>
        <div className="mt-3 flex flex-col gap-3">
          {loginActivity.map((row) => (
            <div key={row.time} className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-700"
              >
                <MonitorSmartphone className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">{row.device}</p>
                <p className="truncate text-[11px] text-ink-500">
                  {row.location} • {row.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg leading-6 font-bold text-ink-900">Security Options</h2>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-900">{securityOptions.twoFactor.label}</p>
              <p className="text-[11px] text-ink-500">{securityOptions.twoFactor.caption}</p>
            </div>
            <Toggle checked={twoFactor} onCheckedChange={setTwoFactor} label="Two-factor authentication" />
          </div>
          <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-900">{securityOptions.loginAlerts.label}</p>
              <p className="text-[11px] text-ink-500">{securityOptions.loginAlerts.caption}</p>
            </div>
            <Toggle checked={alerts} onCheckedChange={setAlerts} label="Login alerts" />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md border border-edge p-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900">Active sessions</p>
              <p className="text-[11px] text-ink-500">3 devices currently signed in</p>
            </div>
            <Button variant="danger-soft" size="sm" onClick={() => showToast()}>
              <LogOut aria-hidden className="h-4 w-4" />
              Sign out all devices
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("personal");

  return (
    <div className="flex flex-col gap-5">
      {/* Hero card */}
      <Card className="rounded-xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
            {/* Photo + camera */}
            <div className="relative shrink-0">
              <Avatar size={88} variant="photo" initials="SD" alt="Syeda Dillir Hossain" />
              <button
                type="button"
                onClick={() => showToast()}
                aria-label="Change profile photo"
                className="press absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <Camera aria-hidden className="h-4 w-4" />
              </button>
            </div>

            {/* Identity */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{currentUser.name}</h1>
                <Chip tone="info" pill icon={<IdCard />}>
                  ID: {currentUser.shortId}
                </Chip>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-500">
                <User aria-hidden className="h-3.5 w-3.5" />
                Dept. of Computer Science & Engineering • {currentUser.year} • {currentUser.semester}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Chip tone="info">{currentUser.sectionLabel}</Chip>
                <Chip tone="purple" icon={<User />}>
                  Aspiring CR Nominee
                </Chip>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 lg:shrink-0">
            <Button variant="secondary" onClick={() => showToast()}>
              <IdCard aria-hidden className="h-4 w-4" />
              Digital ID
            </Button>
            <Button onClick={() => showToast()}>
              <Pencil aria-hidden className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Hero stats */}
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <div className="flex items-center justify-between gap-3 rounded-md bg-brand-50 p-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Total Attendance</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[28px] leading-9 font-extrabold text-ink-900 tabular">
                  {currentUser.attendance.percent}%
                </span>
                <span className="text-xs font-bold text-success-600">↗ {currentUser.attendance.delta}</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-500 tabular">
                {currentUser.attendance.joined} of {currentUser.attendance.total} lectures joined
              </p>
            </div>
            <RingProgress value={currentUser.attendance.percent} size={48} label={`Total attendance ${currentUser.attendance.percent}%`}>
              <ClipboardList aria-hidden className="h-4 w-4 text-brand-700" />
            </RingProgress>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md bg-brand-50 p-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Class Standing</p>
              <p className="mt-1 flex items-center gap-2">
                <span className="text-[28px] leading-9 font-extrabold text-ink-900">{currentUser.standing.label}</span>
                <Chip tone="info">Rank #{currentUser.standing.rank}</Chip>
              </p>
              <p className="mt-0.5 text-xs text-ink-500 tabular">Cumulative GPA: {currentUser.standing.gpa}</p>
            </div>
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-700 text-white">
              <Medal className="h-5 w-5" />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md bg-brand-50 p-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Registered Load</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-[28px] leading-9 font-extrabold text-ink-900 tabular">
                  {currentUser.load.courses} Courses
                </span>
                <span className="text-xs font-semibold text-ink-500">{currentUser.load.credits}</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-500">{currentUser.load.term} Semester</p>
            </div>
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-700 text-white">
              <BookOpen className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        label="Profile sections"
        variant="pill"
        value={tab}
        onChange={(id) => setTab(id as Tab)}
        items={[
          { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
          { id: "records", label: "Academic Records", icon: <GraduationCap className="h-4 w-4" /> },
          { id: "security", label: "Security & Settings", icon: <Clock className="h-4 w-4" /> },
        ]}
      />

      {tab === "personal" ? (
        <div role="tabpanel" aria-label="Personal info">
          <PersonalInfoTab />
        </div>
      ) : tab === "records" ? (
        <div role="tabpanel" aria-label="Academic records">
          <AcademicRecordsTab />
        </div>
      ) : tab === "security" ? (
        <div role="tabpanel" aria-label="Security and settings">
          <SecurityTab />
        </div>
      ) : (
        <EmptyState icon={<User />} title="Unknown tab" caption="Select a tab above." />
      )}
    </div>
  );
}
