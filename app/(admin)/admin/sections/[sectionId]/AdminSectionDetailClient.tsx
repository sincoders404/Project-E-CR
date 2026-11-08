"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  Trash2,
  Users,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import {
  getCurrentTerm,
  getSectionSchedule,
  getClassmates,
} from "@/data/queries";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PersonRow } from "@/components/domain/PersonRow";
import { CourseRow } from "@/components/domain/CourseRow";
import { PostCard } from "@/components/domain/PostCard";
import { ResourceCard } from "@/components/domain/ResourceCard";
import { RequestCard } from "@/components/domain/RequestCard";
import { ScheduleTable } from "@/components/domain/ScheduleTable";

export function AdminSectionDetailClient({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = use(params);
  const {
    sections,
    batches,
    terms,
    sectionTerms,
    courses,
    offerings,
    sectionCRs,
    users,
    posts,
    resources,
    enrollments,
    enrollmentRequests,
    scheduleEntries,
    addSectionCR,
    removeSectionCR,
    addStudentToSection,
    removeStudentFromSection,
    toggleCrCanApproveSignups,
    approveRetakeRequest,
    rejectRetakeRequest,
    updateScheduleEntries,
  } = useRole();
  const { showToast } = useToast();

  const section = sections.find((s) => s.id === sectionId);
  const batch = batches.find((b) => b.id === section?.batchId);
  const currentTerm = getCurrentTerm(terms);
  const secTerm = sectionTerms.find(
    (st) => st.sectionId === section?.id && st.termId === currentTerm.id
  );

  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "posts" | "routine" | "requests"
  >("overview");

  // Modals state
  const [addCRModalOpen, setAddCRModalOpen] = useState(false);
  const [selectedStudentForCR, setSelectedStudentForCR] = useState("");
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{
    type: "student" | "cr";
    id: string;
    label: string;
  } | null>(null);

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-bold text-ink-900">Section Not Found</h2>
        <Link href="/admin" className="mt-4">
          <Button variant="secondary" size="sm">
            Back to All Sections
          </Button>
        </Link>
      </div>
    );
  }

  // Section data
  const sectionOfferings = offerings.filter((o) => o.sectionId === section.id);
  const crRecords = sectionCRs.filter((cr) => cr.sectionId === section.id);
  const crUsers = users.filter((u) => crRecords.some((cr) => cr.userId === u.id));
  const students = getClassmates(section.id, users);

  // Retakers in this section's offerings
  const retakeEnrollments = enrollments.filter((e) =>
    sectionOfferings.some((o) => o.id === e.offeringId) && e.type === "retake"
  );
  const retakerUsers = users.filter((u) =>
    retakeEnrollments.some((e) => e.studentId === u.id)
  );

  // Posts & resources for this section
  const sectionPosts = posts.filter((p) => p.sectionId === section.id);
  const sectionResources = resources.filter((r) =>
    sectionOfferings.some((o) => o.id === r.offeringId)
  );

  // Requests for this section's offerings
  const sectionRequests = enrollmentRequests.filter((r) =>
    sectionOfferings.some((o) => o.id === r.offeringId)
  );

  // Schedule
  const sectionSchedule = getSectionSchedule(section.id, currentTerm.id, scheduleEntries);

  const handleConfirmRemove = () => {
    if (!itemToRemove) return;
    if (itemToRemove.type === "student") {
      removeStudentFromSection(itemToRemove.id);
      showToast(`Removed student ${itemToRemove.label}`);
    } else {
      removeSectionCR(section.id, itemToRemove.id);
      showToast(`Removed CR permissions from ${itemToRemove.label}`);
    }
    setConfirmModalOpen(false);
    setItemToRemove(null);
  };

  const handleAddCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForCR) return;
    addSectionCR(section.id, selectedStudentForCR);
    showToast("Class representative appointed");
    setAddCRModalOpen(false);
    setSelectedStudentForCR("");
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentId || !newStudentEmail) return;
    addStudentToSection(section.id, {
      name: newStudentName.trim(),
      studentId: newStudentId.trim(),
      email: newStudentEmail.trim(),
    });
    showToast(`Added ${newStudentName} to section`);
    setAddStudentModalOpen(false);
    setNewStudentName("");
    setNewStudentId("");
    setNewStudentEmail("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div className="flex items-center gap-2 text-xs text-ink-500">
        <Link
          href="/admin"
          className="press flex items-center gap-1 font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Sections
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-700">
          {batch?.department} {section.name}
        </span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-edge bg-surface p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
              {batch?.department} {section.name}
            </h1>
            <Chip tone="info">
              {currentTerm.name} (Semester {secTerm?.semesterNo || 4})
            </Chip>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            {sectionOfferings.length} Offerings • {students.length} Students • {crUsers.length} CRs
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap rounded-lg bg-brand-50 p-1">
          {(["overview", "students", "posts", "routine", "requests"] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`press rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${
                  activeTab === tab
                    ? "bg-surface text-brand-700 shadow-sm"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {tab}
                {tab === "requests" && sectionRequests.filter((r) => r.status === "pending").length > 0 && (
                  <span className="ml-1.5 rounded-full bg-danger-600 px-1 py-0.2 text-[9px] text-white font-bold">
                    {sectionRequests.filter((r) => r.status === "pending").length}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* CR List & Toggle */}
          <div className="rounded-xl border border-edge bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-edge/60 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-ink-900">
                  Appointed CRs ({crUsers.length})
                </h2>
                <p className="text-xs text-ink-500">
                  Representatives authorized to broadcast and edit routine
                </p>
              </div>
              <Button
                size="sm"
                variant="soft"
                onClick={() => setAddCRModalOpen(true)}
                className="gap-1"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add CR
              </Button>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {crUsers.map((cr) => (
                <div
                  key={cr.id}
                  className="flex items-center justify-between rounded-lg border border-edge bg-brand-50/40 p-3"
                >
                  <div>
                    <p className="text-sm font-bold text-ink-900">{cr.name}</p>
                    <p className="text-xs text-ink-500">
                      ID: {cr.studentId} • {cr.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setItemToRemove({ type: "cr", id: cr.id, label: cr.name });
                      setConfirmModalOpen(true);
                    }}
                    className="press rounded p-1.5 text-ink-400 hover:bg-danger-100 hover:text-danger-600"
                    title="Remove CR role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Toggle: Let CRs approve sign-ups */}
            <div className="flex items-center justify-between rounded-lg border border-edge bg-brand-50/50 p-3.5">
              <div>
                <p className="text-xs font-bold text-ink-900">
                  Let CRs Approve Sign-ups
                </p>
                <p className="text-[11px] text-ink-500">
                  Allow section CRs to review and accept incoming student registrations
                </p>
              </div>
              <Toggle
                checked={section.crCanApproveSignups}
                onCheckedChange={() => {
                  toggleCrCanApproveSignups(section.id);
                  showToast(
                    `Sign-up approval by CRs is now ${!section.crCanApproveSignups ? "Enabled" : "Disabled"}`
                  );
                }}
                label="Toggle CR sign-up permissions"
              />
            </div>
          </div>

          {/* Offerings list */}
          <div className="rounded-xl border border-edge bg-surface p-5 shadow-card">
            <div className="border-b border-edge/60 pb-3 mb-4">
              <h2 className="text-base font-bold text-ink-900">
                Course Offerings ({sectionOfferings.length})
              </h2>
              <p className="text-xs text-ink-500">
                Active subjects assigned to this section for {currentTerm.name}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {sectionOfferings.map((offering) => {
                const c = courses.find((crs) => crs.id === offering.courseId);
                if (!c) return null;
                return <CourseRow key={offering.id} course={c} offering={offering} />;
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: STUDENTS ────────────────────────────────────────── */}
      {activeTab === "students" && (
        <div className="rounded-xl border border-edge bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge/60 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-ink-900">
                Enrolled Students ({students.length + retakerUsers.length})
              </h2>
              <p className="text-xs text-ink-500">
                Regular section roster and students taking approved retakes
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setAddStudentModalOpen(true)}
              className="gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((st) => (
              <PersonRow
                key={st.id}
                name={st.name}
                studentId={st.studentId}
                badge={crUsers.some((cr) => cr.id === st.id) ? "CR" : "Regular"}
                onRemove={() => {
                  setItemToRemove({
                    type: "student",
                    id: st.id,
                    label: `${st.name} (${st.studentId})`,
                  });
                  setConfirmModalOpen(true);
                }}
              />
            ))}
            {retakerUsers.map((retaker) => (
              <PersonRow
                key={retaker.id}
                name={retaker.name}
                studentId={retaker.studentId}
                badge="Retake"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: POSTS & RESOURCES ──────────────────────────────── */}
      {activeTab === "posts" && (
        <div className="flex flex-col gap-5">
          {/* Posts */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-ink-900">
              Section Posts & Announcements ({sectionPosts.length})
            </h2>
            <div className="flex flex-col gap-3">
              {sectionPosts.map((post) => {
                const off = offerings.find((o) => o.id === post.offeringId);
                const crs = courses.find((c) => c.id === off?.courseId);
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    courseCode={crs?.code}
                    canManage={true}
                  />
                );
              })}
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3 mt-4">
            <h2 className="text-base font-bold text-ink-900">
              Drive Resources ({sectionResources.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {sectionResources.map((res) => {
                const off = offerings.find((o) => o.id === res.offeringId);
                const crs = courses.find((c) => c.id === off?.courseId);
                return (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    courseCode={crs?.code}
                    canManage={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: ROUTINE ─────────────────────────────────────────── */}
      {activeTab === "routine" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink-900">
                Weekly Class Routine (Administrative Edit Mode)
              </h2>
              <p className="text-xs text-ink-500">
                Modify session slots, rooms, and assigned offerings
              </p>
            </div>
          </div>

          <ScheduleTable
            entries={sectionSchedule}
            offerings={sectionOfferings}
            courses={courses}
            canEdit={true}
            onSave={updateScheduleEntries}
          />
        </div>
      )}

      {/* ── TAB 5: REQUESTS ────────────────────────────────────────── */}
      {activeTab === "requests" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-ink-900">
            Retake Requests for this Section ({sectionRequests.length})
          </h2>

          {sectionRequests.length === 0 ? (
            <p className="py-8 text-center text-xs text-ink-400">
              No retake requests have been submitted for this section.
            </p>
          ) : (
            sectionRequests.map((req) => {
              const student = users.find((u) => u.id === req.studentId);
              const off = offerings.find((o) => o.id === req.offeringId);
              const crs = courses.find((c) => c.id === off?.courseId);
              const homeSec = sections.find((s) => s.id === student?.sectionId);

              return (
                <RequestCard
                  key={req.id}
                  id={req.id}
                  studentName={student?.name || "Student"}
                  studentId={student?.studentId || ""}
                  courseTitle={crs?.title || "Course"}
                  targetSectionName={`CSE ${section.name}`}
                  homeSectionName={homeSec ? `CSE ${homeSec.name}` : ""}
                  sentAt={req.createdAt}
                  status={req.status}
                  rejectReason={req.rejectReason}
                  onApprove={approveRetakeRequest}
                  onReject={rejectRetakeRequest}
                />
              );
            })
          )}
        </div>
      )}

      {/* ── MODAL: Add CR ──────────────────────────────────────────── */}
      <Modal
        open={addCRModalOpen}
        onClose={() => setAddCRModalOpen(false)}
        title="Appoint Class Representative"
        subtitle={`Select a student from CSE ${section.name} to grant CR permissions.`}
        maxWidth="sm"
      >
        <form onSubmit={handleAddCR} className="space-y-4">
          <div>
            <label htmlFor="cr-sel" className="mb-1 block text-xs font-semibold text-ink-700">
              Select Student
            </label>
            <select
              id="cr-sel"
              required
              value={selectedStudentForCR}
              onChange={(e) => setSelectedStudentForCR(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
            >
              <option value="">-- Choose an enrolled student --</option>
              {students
                .filter((s) => !crUsers.some((cr) => cr.id === s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-edge pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setAddCRModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="md" disabled={!selectedStudentForCR}>
              Appoint CR
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Add Student ─────────────────────────────────────── */}
      <Modal
        open={addStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        title="Enroll Student"
        subtitle={`Add a new student directly to CSE ${section.name}.`}
        maxWidth="sm"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label htmlFor="st-name" className="mb-1 block text-xs font-semibold text-ink-700">
              Full Name
            </label>
            <input
              id="st-name"
              type="text"
              required
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="e.g. Mehedi Hasan"
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="st-id" className="mb-1 block text-xs font-semibold text-ink-700">
              Student ID
            </label>
            <input
              id="st-id"
              type="text"
              required
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              placeholder="e.g. 20-11095"
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="st-email" className="mb-1 block text-xs font-semibold text-ink-700">
              University Email
            </label>
            <input
              id="st-email"
              type="email"
              required
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              placeholder="e.g. mehedi@cse.univ.edu"
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-edge pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setAddStudentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="md">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Confirm Remove ──────────────────────────────────── */}
      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Confirm Removal"
        message={`Are you sure you want to remove ${itemToRemove?.label}?`}
        confirmLabel="Remove"
      />
    </div>
  );
}
