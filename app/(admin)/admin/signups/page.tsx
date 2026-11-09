"use client";

import { useState } from "react";
import { Check, X, CheckCircle2, Clock } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";

export default function AdminSignupsPage() {
  const { users, sections, approveSignup, rejectSignup } = useRole();

  const [activeTab, setActiveTab] = useState<string>("pending");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pendingUsers = users.filter((u) => u.status === "pending");
  const approvedUsers = users.filter((u) => u.status === "approved" && u.role === "student");
  const rejectedUsers = users.filter((u) => u.status === "rejected");

  const tabItems = [
    { id: "pending", label: "Pending", count: pendingUsers.length },
    { id: "approved", label: "Approved", count: approvedUsers.length },
    { id: "rejected", label: "Rejected", count: rejectedUsers.length },
  ];

  const currentList =
    activeTab === "pending"
      ? pendingUsers
      : activeTab === "approved"
      ? approvedUsers
      : rejectedUsers;

  const handleOpenReject = (userId: string) => {
    setTargetUserId(userId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (targetUserId) {
      rejectSignup(targetUserId);
    }
    setRejectModalOpen(false);
    setTargetUserId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          Student Sign-up Approvals
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Review new student portal registrations and approve section assignments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          label="Filter signups"
          value={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="rounded-xl border border-edge bg-surface py-14 shadow-card">
          <EmptyState
            icon={<CheckCircle2 />}
            title={
              activeTab === "pending"
                ? "No pending student sign-ups"
                : `No ${activeTab} students`
            }
            caption="Registration submissions will appear here for verification."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {currentList.map((st) => {
            const sec = sections.find((s) => s.id === st.sectionId);
            const initials = st.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={st.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-edge bg-surface p-4 shadow-card"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar size={40} initials={initials} />
                  <div>
                    <h4 className="text-sm font-bold text-ink-900">{st.name}</h4>
                    <p className="text-xs text-ink-500">
                      ID: {st.studentId || "None"} • {st.email} • Requested Section:{" "}
                      <strong className="text-brand-700 font-bold">
                        {sec ? `CSE ${sec.name}` : "None"}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {activeTab === "pending" && (
                    <>
                      <Button
                        variant="danger-soft"
                        size="sm"
                        onClick={() => handleOpenReject(st.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => approveSignup(st.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                    </>
                  )}

                  {activeTab === "approved" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-600">
                      <Check className="h-3.5 w-3.5" />
                      Approved
                    </span>
                  )}

                  {activeTab === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-100 px-3 py-1 text-xs font-semibold text-danger-600">
                      <X className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Sign-up Application"
        subtitle="Provide an optional note before rejecting this registration."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="reg-reject" className="mb-1 block text-xs font-semibold text-ink-700">
              Note / Reason
            </label>
            <input
              id="reg-reject"
              type="text"
              placeholder="e.g. Invalid student ID or wrong department"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
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
    </div>
  );
}
