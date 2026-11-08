"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Plus,
  HardDrive,
  Users,
  Megaphone,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import {
  getTodaySchedule,
  getActiveRoutineNotices,
  getVisiblePosts,
  getVisibleResources,
  getClassmates,
  getCurrentTerm,
  getCRRequests,
} from "@/data/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScheduleItem } from "@/components/domain/ScheduleItem";
import { PostCard } from "@/components/domain/PostCard";
import { ResourceCard } from "@/components/domain/ResourceCard";
import { RequestCard } from "@/components/domain/RequestCard";
import { PostFormModal } from "@/components/domain/PostFormModal";
import { ResourceFormModal } from "@/components/domain/ResourceFormModal";
import { Post, Resource } from "@/data/types";

export default function CRDashboardPage() {
  const {
    currentUser,
    posts,
    resources,
    offerings,
    enrollments,
    enrollmentRequests,
    terms,
    sections,
    sectionCRs,
    scheduleEntries,
    courses,
    users,
    approveRetakeRequest,
    rejectRetakeRequest,
  } = useRole();

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const currentTerm = getCurrentTerm(terms);
  const userSectionId = currentUser.sectionId || "sec-33a";
  const userSection = sections.find((s) => s.id === userSectionId);

  // Queries
  const todayEntries = getTodaySchedule(userSectionId, currentTerm.id, scheduleEntries, 1);
  const routineNotices = getActiveRoutineNotices(currentUser, posts, offerings, enrollments);
  const visiblePosts = getVisiblePosts(currentUser, posts, offerings, enrollments);
  const visibleResources = getVisibleResources(currentUser, resources, offerings, enrollments);
  const classmates = getClassmates(userSectionId, users);
  const crRequests = getCRRequests(currentUser.id, sectionCRs, offerings, enrollmentRequests);
  const pendingRequests = crRequests.filter((r) => r.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-ink-900">
              CR Operations: CSE {userSection?.name || "33-A"}
            </h1>
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
              {currentTerm.name}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Broadcast official notices, upload course drive links, and manage retake requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="md"
            onClick={() => {
              setEditingPost(null);
              setPostModalOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Post
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={() => {
              setEditingResource(null);
              setResourceModalOpen(true);
            }}
            className="gap-1.5"
          >
            <HardDrive className="h-4 w-4" />
            Upload Resource
          </Button>
        </div>
      </div>

      {/* ── 3 Number Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/requests" className="press">
          <Card className="flex items-center gap-4 p-5 hover:border-brand-500 transition-colors">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-100 text-warning-600 font-bold">
              <UserPlus className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
                Pending Requests
              </p>
              <p className="text-2xl font-extrabold text-ink-900 tabular">
                {pendingRequests.length}
              </p>
            </div>
          </Card>
        </Link>

        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 font-bold">
            <Megaphone className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
              Posts This Week
            </p>
            <p className="text-2xl font-extrabold text-ink-900 tabular">
              {visiblePosts.length}
            </p>
          </div>
        </Card>

        <Link href="/classmates" className="press">
          <Card className="flex items-center gap-4 p-5 hover:border-brand-500 transition-colors">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100 text-success-600 font-bold">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
                Enrolled Students
              </p>
              <p className="text-2xl font-extrabold text-ink-900 tabular">
                {classmates.length}
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* ── Pending Requests Preview (3 rows) ──────────────────── */}
      {pendingRequests.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between border-b border-edge/60 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-ink-900">
                Incoming Course Retake Requests ({pendingRequests.length})
              </h2>
              <p className="text-xs text-ink-500">
                Students from other sections requesting access to your section&apos;s courses
              </p>
            </div>
            <Link
              href="/requests"
              className="press flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
            >
              View all requests
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {pendingRequests.slice(0, 3).map((req) => {
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
                  onApprove={approveRetakeRequest}
                  onReject={rejectRetakeRequest}
                />
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Today's Class Schedule ─────────────────────────────── */}
      <Card className="p-5">
        <div className="flex items-center justify-between border-b border-edge/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-100 text-brand-700">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink-900">
                Today&apos;s Routine
              </h2>
              <p className="text-xs text-ink-500">
                Monday sessions for CSE {userSection?.name || "33-A"}
              </p>
            </div>
          </div>
          <Link
            href="/routine"
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Edit routine →
          </Link>
        </div>

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
      </Card>

      {/* ── Section Posts & Resources ──────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">
              Recent Section Broadcasts
            </h2>
            <Link
              href="/announcements"
              className="text-xs font-semibold text-brand-700 hover:underline"
            >
              Browse all →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {visiblePosts.slice(0, 3).map((post) => {
              const off = offerings.find((o) => o.id === post.offeringId);
              const crs = courses.find((c) => c.id === off?.courseId);
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  courseCode={crs?.code}
                  canManage={true}
                  onEdit={(p) => {
                    setEditingPost(p);
                    setPostModalOpen(true);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Recent Resources */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">
              Google Drive Resources
            </h2>
            <Button
              size="sm"
              variant="soft"
              onClick={() => {
                setEditingResource(null);
                setResourceModalOpen(true);
              }}
              className="gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Upload
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {visibleResources.slice(0, 4).map((resource) => {
              const off = offerings.find((o) => o.id === resource.offeringId);
              const crs = courses.find((c) => c.id === off?.courseId);
              return (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  courseCode={crs?.code}
                  canManage={true}
                  onEdit={(r) => {
                    setEditingResource(r);
                    setResourceModalOpen(true);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Modals */}
      <PostFormModal
        open={postModalOpen}
        onClose={() => {
          setPostModalOpen(false);
          setEditingPost(null);
        }}
        sectionId={userSectionId}
        initialPost={editingPost}
      />
      <ResourceFormModal
        open={resourceModalOpen}
        onClose={() => {
          setResourceModalOpen(false);
          setEditingResource(null);
        }}
        sectionId={userSectionId}
        initialResource={editingResource}
      />
    </div>
  );
}
