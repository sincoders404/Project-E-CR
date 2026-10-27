"use client";

import { Award, Check, Clock, History, Quote, Users, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/ui/Toast";
import type { CRRequest } from "@/data/crRequests";

function metricIcon(label: string) {
  if (label.startsWith("CGPA")) return <Award aria-hidden className="h-3 w-3" />;
  if (label.includes("Endorsement")) return <Users aria-hidden className="h-3 w-3" />;
  return <History aria-hidden className="h-3 w-3" />;
}

/** CR request card (spec 9.4 anatomy) with Accept / Reject demo actions. */
export function CRRequestCard({
  request,
  onDecision,
}: {
  request: CRRequest;
  onDecision?: (id: string, decision: "approved" | "rejected") => void;
}) {
  const { showToast } = useToast();

  function decide(decision: "approved" | "rejected") {
    onDecision?.(request.id, decision);
    showToast(decision === "approved" ? "Demo only — approved locally" : "Demo only — rejected locally");
  }

  return (
    <article className="rounded-lg bg-surface p-5 shadow-card">
      {/* Identity row */}
      <div className="flex items-start gap-3">
        <Avatar size={40} initials={request.initials} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-ink-900">{request.name}</h3>
            <Chip tone="info">{request.yearChip}</Chip>
            <Chip tone="neutral">{request.roleChip}</Chip>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            <span className="tabular">
              ID: {request.studentId} • {request.applied}
            </span>
          </p>
        </div>
        <Chip tone="warning" dot className="hidden sm:inline-flex">
          Pending Review
        </Chip>
      </div>

      {/* Statement of intent */}
      <div className="mt-4 rounded-md bg-brand-50 p-3.5">
        <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">
          <Quote aria-hidden className="h-3.5 w-3.5" />
          Statement of Intent
        </p>
        <p className="mt-1.5 text-[13px] leading-5 text-ink-700 italic">“{request.statement}”</p>
      </div>

      {/* Metric chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {request.metrics.map((m) => (
          <span
            key={m}
            className="inline-flex h-6 items-center gap-1.5 rounded-full border border-edge px-2.5 text-[11px] font-semibold text-ink-700"
          >
            {metricIcon(m)}
            {m}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <Button variant="danger-soft" className="w-[100px]" size="sm" onClick={() => decide("rejected")}>
          <X aria-hidden className="h-4 w-4" />
          Reject
        </Button>
        <Button className="w-[100px]" size="sm" onClick={() => decide("approved")}>
          <Check aria-hidden className="h-4 w-4" />
          Accept
        </Button>
      </div>
    </article>
  );
}
