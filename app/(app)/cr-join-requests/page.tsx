"use client";

import { useState } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  History,
  Inbox,
  Mail,
  ShieldCheck,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";
import { CRRequestCard } from "@/components/domain/CRRequestCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconTile } from "@/components/ui/IconTile";
import { FilterIconButton, Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { advisor, cohortCapacity, crRequests, governanceRules } from "@/data/crRequests";

type Tab = "pending" | "approved" | "rejected";

export default function CRJoinRequestsPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("pending");
  const [section, setSection] = useState("CSE 221 · Sec 2");
  const [requests, setRequests] = useState(crRequests);

  const counts = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  function decide(id: string, decision: "approved" | "rejected") {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status: decision } : r)));
  }

  const visible = requests.filter((r) => r.status === tab);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <Chip tone="info">Governance • Term 2024-25</Chip>
            <Chip tone="neutral">Section CSE-221</Chip>
          </div>
          <h1 className="mt-2 text-[28px] leading-9 font-extrabold tracking-tight text-ink-900">CR Join Requests</h1>
          <p className="mt-1.5 max-w-[560px] text-sm text-ink-500">
            Review student nominations and volunteer applications for Class Representative. Coordinate approvals with
            department guidelines.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => showToast()}>
            <History aria-hidden className="h-4 w-4" />
            Decision Log
          </Button>
          <Button onClick={() => showToast()}>
            <UserPlus aria-hidden className="h-4 w-4" />
            Nominate Student
          </Button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="flex items-start gap-3 p-5">
          <IconTile tone="brand">
            <ClipboardCheck />
          </IconTile>
          <div>
            <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Review Queue</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-[28px] leading-9 font-extrabold text-ink-900 tabular">{counts.pending}</span>
              <span className="text-[13px] font-semibold text-danger-600">Action needed</span>
            </p>
            <p className="text-[13px] text-ink-500">Awaiting Review</p>
          </div>
        </Card>
        <Card className="flex items-start gap-3 p-5">
          <IconTile tone="brand">
            <Users />
          </IconTile>
          <div>
            <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Active Reps</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-[28px] leading-9 font-extrabold text-ink-900 tabular">5</span>
              <span className="text-[13px] text-ink-500">/ 6 quota</span>
            </p>
            <p className="text-[13px] text-ink-500">Confirmed CRs</p>
          </div>
        </Card>
        <Card className="flex items-start gap-3 p-5">
          <IconTile tone="danger">
            <UserX />
          </IconTile>
          <div>
            <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Archived</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-[28px] leading-9 font-extrabold text-ink-900 tabular">1</span>
              <span className="text-[13px] text-ink-500">this term</span>
            </p>
            <p className="text-[13px] text-ink-500">Declined Application</p>
          </div>
        </Card>
      </div>

      {/* Body */}
      <div className="grid gap-5 xl:grid-cols-[68fr_32fr]">
        {/* Left: requests */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Tabs
              label="Request status tabs"
              value={tab}
              onChange={(id) => setTab(id as Tab)}
              items={[
                { id: "pending", label: "Pending", count: counts.pending },
                { id: "approved", label: "Approved", count: counts.approved },
                { id: "rejected", label: "Rejected", count: counts.rejected },
              ]}
            />
            <div className="flex items-center gap-2">
              <Select label="Filter by section" options={["CSE 221 · Sec 2", "CSE 221 · Sec 1"]} value={section} onChange={setSection} />
              <FilterIconButton label="More filters" />
            </div>
          </div>

          <div role="tabpanel" aria-label={`${tab} requests`} className="flex flex-col gap-4">
            {visible.length > 0 ? (
              visible.map((r) => <CRRequestCard key={r.id} request={r} onDecision={decide} />)
            ) : (
              <Card>
                <EmptyState
                  icon={<Inbox />}
                  title={`No ${tab} requests`}
                  caption="You're all caught up."
                />
              </Card>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Cohort capacity */}
          <Card className="p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">Cohort Capacity</p>
              <Chip tone="info" pill>
                {cohortCapacity.cap}
              </Chip>
            </div>
            {/* 2-segment bar: 1 filled of 2 */}
            <div
              role="progressbar"
              aria-label="Section representation slots"
              aria-valuemin={0}
              aria-valuemax={2}
              aria-valuenow={1}
              className="mt-3 flex gap-1.5"
            >
              <span className="h-2 flex-1 rounded-full bg-brand-700" />
              <span className="h-2 flex-1 rounded-full bg-brand-100" />
            </div>
            <p className="mt-3 text-sm font-bold text-ink-900">
              {cohortCapacity.title} <span className="text-ink-500">{cohortCapacity.progress}</span>
            </p>
            <p className="mt-1 text-xs text-ink-500">{cohortCapacity.detail}</p>
            <div className="mt-3 flex items-center gap-3 rounded-md bg-brand-50 p-3">
              <Avatar size={36} initials={cohortCapacity.officer.initials} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900">{cohortCapacity.officer.name}</p>
                <p className="truncate text-[11px] text-ink-500">{cohortCapacity.officer.caption}</p>
              </div>
              <BadgeCheck aria-hidden className="h-5 w-5 shrink-0 text-success-600" />
            </div>
          </Card>

          {/* Governance guidelines */}
          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-100 text-brand-700">
                <ShieldCheck className="h-[18px] w-[18px]" />
              </span>
              <h2 className="text-lg leading-6 font-bold text-ink-900">CR Governance Guidelines</h2>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {governanceRules.map((rule) => (
                <li key={rule.strong} className="flex items-start gap-2.5">
                  <BadgeCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                  <p className="text-[13px] leading-5 text-ink-700">
                    <span className="font-bold text-ink-900">{rule.strong}</span> {rule.text}
                  </p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => showToast()}
              className="press mt-4 text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              View full Academic Constitution →
            </button>
          </Card>

          {/* Advisor strip */}
          <Card variant="tinted" className="flex items-center gap-3 p-4">
            <Avatar size={36} initials="MR" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">{advisor.name}</p>
              <p className="truncate text-[11px] text-ink-500">{advisor.caption}</p>
            </div>
            <button
              type="button"
              onClick={() => showToast()}
              aria-label={`Email ${advisor.name}`}
              className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-brand-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <Mail aria-hidden className="h-4 w-4" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
