"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, UserPlus, Check, X } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import {
  getCRRequests,
  getPendingSignups,
} from "@/data/queries";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { RequestCard } from "@/components/domain/RequestCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export default function RequestsPage() {
  const {
    currentUser,
    personaRole,
    sectionCRs,
    offerings,
    enrollmentRequests,
    sections,
    courses,
    users,
    approveRetakeRequest,
    rejectRetakeRequest,
    approveSignup,
    rejectSignup,
  } = useRole();

  const userSectionId = currentUser.sectionId || "";
  const userSection = sections.find((s) => s.id === userSectionId);
  const canApproveSignups = userSection?.crCanApproveSignups ?? false;

  const [activeTab, setActiveTab] = useState<string>("pending");

  // CR Requests
  const crRequests = getCRRequests(currentUser.id, sectionCRs, offerings, enrollmentRequests);
  const pendingRequests = crRequests.filter((r) => r.status === "pending");
  const approvedRequests = crRequests.filter((r) => r.status === "approved");
  const rejectedRequests = crRequests.filter((r) => r.status === "rejected");

  // Pending Sign-ups
  const pendingSignups = getPendingSignups(currentUser, sectionCRs, sections, users);

  if (personaRole !== "CR" && personaRole !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-100 text-danger-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-ink-900">Access Restricted</h2>
        <p className="mt-1 text-sm text-ink-500">
          Only authorized Class Representatives and Administrators can manage student requests.
        </p>
      </div>
    );
  }

  const tabItems = [
    { id: "pending", label: "Pending", count: pendingRequests.length },
    { id: "approved", label: "Approved", count: approvedRequests.length },
    { id: "rejected", label: "Rejected", count: rejectedRequests.length },
    ...(canApproveSignups
      ? [{ id: "signups", label: "Sign-ups", count: pendingSignups.length }]
      : []),
  ];

  const displayRequests =
    activeTab === "pending"
      ? pendingRequests
      : activeTab === "approved"
      ? approvedRequests
      : rejectedRequests;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          Course Retake & Sign-up Requests
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Approve or reject student course enrollment applications for CSE {userSection?.name || "—"}.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          label="Filter requests status"
          value={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>

      {/* Content */}
      {activeTab === "signups" ? (
        <div className="flex flex-col gap-3">
          {pendingSignups.length === 0 ? (
            <div className="rounded-xl border border-edge bg-surface py-14 shadow-card">
              <EmptyState
                icon={<CheckCircle2 />}
                title="No pending student sign-ups"
                caption="All registration applications for your section have been reviewed."
              />
            </div>
          ) : (
            pendingSignups.map((student) => {
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-edge bg-surface p-4 shadow-card"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar size={40} initials={initials} />
                    <div>
                      <h4 className="text-sm font-bold text-ink-900">
                        {student.name}
                      </h4>
                      <p className="text-xs text-ink-500">
                        ID: {student.studentId} • {student.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger-soft"
                      size="sm"
                      onClick={() => rejectSignup(student.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => approveSignup(student.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve Sign-up
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : displayRequests.length === 0 ? (
        <div className="rounded-xl border border-edge bg-surface py-14 shadow-card">
          <EmptyState
            icon={<CheckCircle2 />}
            title="No pending requests. You're all caught up."
            caption="New requests submitted by students will appear here for review."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayRequests.map((req) => {
            const student = users.find((u) => u.id === req.studentId);
            const off = offerings.find((o) => o.id === req.offeringId);
            const crs = courses.find((c) => c.id === off?.courseId);
            const targetSec = sections.find((s) => s.id === off?.sectionId);
            const homeSec = sections.find((s) => s.id === student?.sectionId);

            return (
              <RequestCard
                key={req.id}
                id={req.id}
                studentName={student?.name || "Student"}
                studentId={student?.studentId || ""}
                courseTitle={crs?.title || "Course"}
                targetSectionName={targetSec ? `CSE ${targetSec.name}` : ""}
                homeSectionName={homeSec ? `CSE ${homeSec.name}` : ""}
                sentAt={req.createdAt}
                status={req.status}
                rejectReason={req.rejectReason}
                onApprove={approveRetakeRequest}
                onReject={rejectRetakeRequest}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
