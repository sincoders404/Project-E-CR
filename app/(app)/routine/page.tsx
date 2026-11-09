"use client";

import { useRole } from "@/context/RoleProvider";
import {
  getCurrentTerm,
  getSectionSchedule,
  getActiveRoutineNotices,
  isUserCR,
} from "@/data/queries";
import { ScheduleTable } from "@/components/domain/ScheduleTable";
import { PostCard } from "@/components/domain/PostCard";
import { Card } from "@/components/ui/Card";

export default function RoutinePage() {
  const {
    currentUser,
    personaRole,
    scheduleEntries,
    offerings,
    courses,
    terms,
    sections,
    posts,
    enrollments,
    sectionCRs,
    updateScheduleEntries,
  } = useRole();

  const currentTerm = getCurrentTerm(terms);
  const userSectionId = currentUser.sectionId || "";
  const userSection = sections.find((s) => s.id === userSectionId);

  // Queries
  const sectionEntries = getSectionSchedule(userSectionId, currentTerm.id, scheduleEntries);
  const sectionOfferings = offerings.filter((o) => o.sectionId === userSectionId);
  const routineNotices = getActiveRoutineNotices(currentUser, posts, offerings, enrollments);

  const canEdit = isUserCR(currentUser.id, sectionCRs) || personaRole === "CR" || personaRole === "Admin";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Weekly Class Routine
          </h1>
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
            CSE {userSection?.name || "—"} · {currentTerm.name}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Official section timetable, class rooms, and active temporary reschedule notices.
        </p>
      </div>

      {/* Routine Table */}
      <ScheduleTable
        entries={sectionEntries}
        offerings={sectionOfferings}
        courses={courses}
        canEdit={canEdit}
        onSave={updateScheduleEntries}
      />

      {/* Active Routine Notices */}
      {routineNotices.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="border-b border-edge/60 pb-2">
            <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wider">
              Active Routine Notices ({routineNotices.length})
            </h2>
            <p className="text-xs text-ink-500">
              Cancellations, room reassignments, and online class announcements
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {routineNotices.map((notice) => {
              const off = offerings.find((o) => o.id === notice.offeringId);
              const crs = courses.find((c) => c.id === off?.courseId);
              return (
                <PostCard
                  key={notice.id}
                  post={notice}
                  courseCode={crs?.code}
                  canManage={canEdit}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
