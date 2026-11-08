"use client";

import { useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type RequestCardProps = {
  id: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  targetSectionName: string;
  homeSectionName: string;
  sentAt: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
};

export function RequestCard({
  id,
  studentName,
  studentId,
  courseTitle,
  targetSectionName,
  homeSectionName,
  sentAt,
  status,
  rejectReason,
  onApprove,
  onReject,
}: RequestCardProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleConfirmReject = () => {
    onReject(id, reason.trim() || undefined);
    setRejectModalOpen(false);
    setReason("");
  };

  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-edge bg-surface p-4 shadow-card">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar size={40} initials={initials} />
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-ink-900">
              {studentName}
            </h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-500">
              <span className="tabular font-medium text-ink-700">
                ID: {studentId}
              </span>
              <span>•</span>
              <span className="font-semibold text-brand-700">
                {courseTitle} ({targetSectionName})
              </span>
              <span>•</span>
              <span>Home: {homeSectionName}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {sentAt}
              </span>
            </div>
            {isRejected && rejectReason && (
              <p className="mt-1 text-xs text-danger-600 italic">
                Reason: {rejectReason}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {isPending && (
            <>
              <Button
                variant="danger-soft"
                size="sm"
                onClick={() => setRejectModalOpen(true)}
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApprove(id)}
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </Button>
            </>
          )}

          {isApproved && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-600">
              <Check className="h-3.5 w-3.5" />
              Approved
            </span>
          )}

          {isRejected && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-100 px-3 py-1 text-xs font-semibold text-danger-600">
              <X className="h-3.5 w-3.5" />
              Rejected
            </span>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Retake Request"
        subtitle={`Provide an optional reason for rejecting ${studentName}'s enrollment.`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="reject-reason" className="mb-1 block text-xs font-semibold text-ink-700">
              Rejection Reason (Optional)
            </label>
            <input
              id="reject-reason"
              type="text"
              placeholder="e.g. Prerequisite not met or section capacity full"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-edge pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger-soft"
              size="sm"
              onClick={handleConfirmReject}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
