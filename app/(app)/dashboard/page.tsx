"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Copy,
  Mail,
  Phone,
  ArrowRight,
  Plus,
  HardDrive,
  Users,
} from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import {
  getTodaySchedule,
  getActiveRoutineNotices,
  getVisiblePosts,
  getSectionCRs,
  getClassmates,
  getCurrentTerm,
  isUserCR,
} from "@/data/queries";
import { ScheduleItem } from "@/components/domain/ScheduleItem";
import { PostCard } from "@/components/domain/PostCard";
import { PersonRow } from "@/components/domain/PersonRow";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PostFormModal } from "@/components/domain/PostFormModal";
import { ResourceFormModal } from "@/components/domain/ResourceFormModal";

export default function DashboardPage() {
  const {
    currentUser,
    personaRole,
    posts,
    resources,
    offerings,
    enrollments,
    terms,
    sections,
    sectionCRs,
    scheduleEntries,
    courses,
    users,
  } = useRole();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);

  const currentTerm = getCurrentTerm(terms);
  const userSectionId = currentUser.sectionId || "";
  const userSection = sections.find((s) => s.id === userSectionId);

  // Queries through queries.ts strictly per Rule 6
  const visiblePosts = getVisiblePosts(currentUser, posts, offerings, enrollments);
  const todayEntries = getTodaySchedule(userSectionId, currentTerm.id, scheduleEntries, 1); // 1 = Monday (TODAY)
  const routineNotices = getActiveRoutineNotices(currentUser, posts, offerings, enrollments);
  const sectionCRList = getSectionCRs(userSectionId, sectionCRs, users);
  const classmates = getClassmates(userSectionId, users);

  // Filter posts by type tab
  const filteredPosts = visiblePosts.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "announcement") return p.type === "announcement";
    if (activeTab === "deadline") return p.type === "deadline";
    if (activeTab === "exam") return p.type === "exam";
    return true;
  });

  const pinnedPost = visiblePosts.find((p) => p.pinned);
  const displayPosts = filteredPosts.slice(0, 4);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard`);
  };

  const tabItems = [
    { id: "all", label: "All", count: visiblePosts.length },
    {
      id: "announcement",
      label: "Notices",
      count: visiblePosts.filter((p) => p.type === "announcement").length,
    },
    {
      id: "deadline",
      label: "Deadlines",
      count: visiblePosts.filter((p) => p.type === "deadline").length,
    },
    {
      id: "exam",
      label: "Exams",
      count: visiblePosts.filter((p) => p.type === "exam").length,
    },
  ];

  const canManage = isUserCR(currentUser.id, sectionCRs) || personaRole === "CR";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-ink-900">
            Good Morning, {currentUser.name.split(" ")[0]}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Today&apos;s routine, section announcements, and academic updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <>
              <Button size="sm" onClick={() => setPostModalOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Post
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setResourceModalOpen(true)} className="gap-1">
                <HardDrive className="h-4 w-4" />
                Upload Resource
              </Button>
            </>
          )}

          <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-brand-700 animate-pulse" />
            <span className="text-xs font-bold text-brand-700">
              CSE {userSection?.name || "—"} · {currentTerm.name}
            </span>
          </div>
        </div>
      </div>

      {/* ── 1. Today's Class Schedule (Full Width) ─────────────── */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-100 text-brand-700">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink-900">
                Today&apos;s Class Schedule
              </h2>
              <p className="text-xs text-ink-500">
                Monday, November 09, 2026 • {todayEntries.length} Sessions scheduled
              </p>
            </div>
          </div>
          <Link
            href="/routine"
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Weekly Routine →
          </Link>
        </div>

        {todayEntries.length === 0 ? (
          <p className="text-center py-6 text-xs text-ink-400">
            No classes scheduled for today. Enjoy your day!
          </p>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {todayEntries.map((entry, index) => {
              const off = offerings.find((o) => o.id === entry.offeringId);
              const crs = courses.find((c) => c.id === off?.courseId);
              const notices = routineNotices.filter((n) => n.offeringId === entry.offeringId);
              const status = index === 0 ? "done" : index === 1 ? "now" : "next";

              return (
                <ScheduleItem
                  key={entry.id}
                  entry={entry}
                  course={crs}
                  offering={off}
                  status={status}
                  notices={notices}
                />
              );
            })}
          </div>
        )}
      </Card>

      {/* ── 2. Announcements & Deadlines (65%) + Right Column (35%) ─ */}
      <div className="grid gap-6 lg:grid-cols-[65fr_35fr]">
        {/* Left Column: Announcements and Deadlines */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge/60 pb-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-ink-900">
                  Announcements & Deadlines
                </h2>
                <p className="text-xs text-ink-500">
                  Notices and reminders from your class representatives
                </p>
              </div>

              <Link
                href="/announcements"
                className="press flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                See all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4">
              <Tabs
                label="Filter feed"
                value={activeTab}
                onChange={setActiveTab}
                items={tabItems}
              />
            </div>

            {/* Pinned Post if on 'all' or 'announcement' tab */}
            {(activeTab === "all" || activeTab === "announcement") && pinnedPost && (
              <div className="mb-4">
                <PostCard
                  post={pinnedPost}
                  courseCode={
                    courses.find(
                      (c) =>
                        c.id ===
                        offerings.find((o) => o.id === pinnedPost.offeringId)?.courseId
                    )?.code
                  }
                  canManage={canManage}
                />
              </div>
            )}

            {/* Recent Posts List */}
            <div className="flex flex-col gap-3">
              {displayPosts
                .filter((p) => p.id !== pinnedPost?.id)
                .map((post) => {
                  const off = offerings.find((o) => o.id === post.offeringId);
                  const crs = courses.find((c) => c.id === off?.courseId);
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      courseCode={crs?.code}
                      canManage={canManage}
                    />
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Right Column: Your CRs + Classmates */}
        <div className="flex flex-col gap-5">
          {/* Your CRs Card */}
          <Card className="p-4">
            <h3 className="text-sm font-bold text-ink-900 border-b border-edge/60 pb-2.5 mb-3">
              Your Class Representatives
            </h3>

            <div className="flex flex-col gap-3">
              {sectionCRList.map((cr) => (
                <div key={cr.id} className="rounded-lg border border-edge bg-brand-50/30 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={36}
                      initials={cr.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-ink-900 truncate">
                          {cr.name}
                        </h4>
                        <span className="rounded bg-brand-100 px-1.5 py-0.2 text-[10px] font-bold text-brand-700">
                          CR
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-500 tabular">ID: {cr.studentId}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between rounded bg-white px-2 py-1.5 border border-edge/50">
                      <span className="flex items-center gap-1.5 text-ink-700 truncate">
                        <Mail className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                        {cr.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(cr.email, "email")}
                        title="Copy email"
                        aria-label="Copy email"
                        className="press text-ink-400 hover:text-brand-700 p-0.5"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>

                    {cr.phone && (
                      <div className="flex items-center justify-between rounded bg-white px-2 py-1.5 border border-edge/50">
                        <span className="flex items-center gap-1.5 text-ink-700 truncate">
                          <Phone className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                          {cr.phone}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cr.phone!, "phone")}
                          title="Copy phone"
                          aria-label="Copy phone"
                          className="press text-ink-400 hover:text-brand-700 p-0.5"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Classmates Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between gap-2 border-b border-edge/60 pb-2.5 mb-3">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
                <Users className="h-4 w-4 text-brand-700" />
                Classmates ({classmates.length})
              </h3>
              <Link
                href="/classmates"
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {classmates.slice(0, 5).map((st) => (
                <PersonRow
                  key={st.id}
                  name={st.name}
                  studentId={st.studentId}
                  badge={sectionCRList.some((cr) => cr.id === st.id) ? "CR" : undefined}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals for CR */}
      {canManage && (
        <>
          <PostFormModal
            open={postModalOpen}
            onClose={() => setPostModalOpen(false)}
            sectionId={userSectionId}
          />
          <ResourceFormModal
            open={resourceModalOpen}
            onClose={() => setResourceModalOpen(false)}
            sectionId={userSectionId}
          />
        </>
      )}
    </div>
  );
}
