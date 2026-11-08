"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, HardDrive, GraduationCap, Megaphone, Users } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import {
  getVisiblePosts,
  getVisibleResources,
  isUserCR,
  getClassmates,
} from "@/data/queries";
import { PostCard } from "@/components/domain/PostCard";
import { ResourceCard } from "@/components/domain/ResourceCard";
import { PersonRow } from "@/components/domain/PersonRow";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostFormModal } from "@/components/domain/PostFormModal";
import { ResourceFormModal } from "@/components/domain/ResourceFormModal";
import { Post, Resource } from "@/data/types";

export function CourseDetailClient({
  params,
}: {
  params: Promise<{ offeringId: string }>;
}) {
  const { offeringId } = use(params);
  const {
    currentUser,
    personaRole,
    offerings,
    courses,
    sections,
    terms,
    posts,
    resources,
    enrollments,
    sectionCRs,
    users,
  } = useRole();

  const [activeTab, setActiveTab] = useState<string>("announcements");
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const offering = offerings.find((o) => o.id === offeringId);
  const course = courses.find((c) => c.id === offering?.courseId);
  const section = sections.find((s) => s.id === offering?.sectionId);
  const term = terms.find((t) => t.id === offering?.termId);

  if (!offering || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-bold text-ink-900">Course Offering Not Found</h2>
        <p className="mt-1 text-sm text-ink-500">
          The requested course offering could not be located.
        </p>
        <Link href="/courses" className="mt-4">
          <Button variant="secondary" size="sm">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  // Filter posts and resources for this offering specifically
  const visiblePosts = getVisiblePosts(currentUser, posts, offerings, enrollments).filter(
    (p) => p.offeringId === offering.id
  );
  const visibleResources = getVisibleResources(currentUser, resources, offerings, enrollments).filter(
    (r) => r.offeringId === offering.id
  );

  const announcementsAndExams = visiblePosts.filter(
    (p) => p.type === "announcement" || p.type === "exam"
  );
  const deadlines = visiblePosts.filter((p) => p.type === "deadline");

  const canManage = isUserCR(currentUser.id, sectionCRs) || personaRole === "CR";

  // Students roster for this course offering (home section students + approved retakers)
  const homeStudents = getClassmates(offering.sectionId, users);
  const retakeEnrollments = enrollments.filter(
    (e) => e.offeringId === offering.id && (e.type === "retake" || e.type === "improvement")
  );
  const retakeStudents = users.filter((u) =>
    retakeEnrollments.some((e) => e.studentId === u.id)
  );

  const tabItems = [
    {
      id: "announcements",
      label: "Announcements & Exams",
      count: announcementsAndExams.length,
    },
    {
      id: "deadlines",
      label: "Deadlines",
      count: deadlines.length,
    },
    {
      id: "resources",
      label: "Resources",
      count: visibleResources.length,
    },
    ...(canManage
      ? [
          {
            id: "students",
            label: "Students",
            count: homeStudents.length + retakeStudents.length,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-ink-500">
        <Link
          href="/courses"
          className="press flex items-center gap-1 font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Courses
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-700">{course.code}</span>
      </div>

      {/* Course Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-edge bg-surface p-6 shadow-card">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-700">
              {course.code}
            </span>
            <Chip tone="info">CSE {section?.name || offering.sectionId}</Chip>
            <span className="text-xs text-ink-400">•</span>
            <span className="text-xs font-semibold text-ink-500">{term?.name}</span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
            {course.title}
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
            <GraduationCap className="h-4 w-4 text-brand-700" />
            Instructor: {offering.facultyName}
          </p>
        </div>

        {/* Action Buttons for CR */}
        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
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
              size="sm"
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
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          label="Course views"
          value={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>

      {/* ── Announcements & Exams Tab ── */}
      {activeTab === "announcements" && (
        <div className="flex flex-col gap-4">
          {announcementsAndExams.length === 0 ? (
            <div className="rounded-xl border border-edge bg-surface py-12">
              <EmptyState
                icon={<Megaphone />}
                title="No announcements or exams yet"
                caption="Notices regarding this subject will appear here."
              />
            </div>
          ) : (
            announcementsAndExams.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                courseCode={course.code}
                canManage={canManage}
                onEdit={(p) => {
                  setEditingPost(p);
                  setPostModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* ── Deadlines Tab ── */}
      {activeTab === "deadlines" && (
        <div className="flex flex-col gap-4">
          {deadlines.length === 0 ? (
            <div className="rounded-xl border border-edge bg-surface py-12">
              <EmptyState
                icon={<Megaphone />}
                title="No active deadlines"
                caption="All upcoming homework or project submissions will be listed here."
              />
            </div>
          ) : (
            deadlines.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                courseCode={course.code}
                canManage={canManage}
                onEdit={(p) => {
                  setEditingPost(p);
                  setPostModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* ── Resources Tab ── */}
      {activeTab === "resources" && (
        <div className="flex flex-col gap-4">
          {visibleResources.length === 0 ? (
            <div className="rounded-xl border border-edge bg-surface py-12">
              <EmptyState
                icon={<HardDrive />}
                title="No resources uploaded"
                caption="Google Drive links to lecture slides and starter code will appear here."
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  courseCode={course.code}
                  canManage={canManage}
                  onEdit={(r) => {
                    setEditingResource(r);
                    setResourceModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Students Tab (CR only) ── */}
      {activeTab === "students" && canManage && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-edge/60 pb-2">
            <h3 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-brand-700" />
              Enrolled Course Roster ({homeStudents.length + retakeStudents.length})
            </h3>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {homeStudents.map((st) => (
              <PersonRow
                key={st.id}
                name={st.name}
                studentId={st.studentId}
                badge="Regular"
              />
            ))}
            {retakeStudents.map((st) => (
              <PersonRow
                key={st.id}
                name={st.name}
                studentId={st.studentId}
                badge="Retake"
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {canManage && (
        <>
          <PostFormModal
            open={postModalOpen}
            onClose={() => {
              setPostModalOpen(false);
              setEditingPost(null);
            }}
            defaultOfferingId={offering.id}
            sectionId={offering.sectionId}
            initialPost={editingPost}
          />
          <ResourceFormModal
            open={resourceModalOpen}
            onClose={() => {
              setResourceModalOpen(false);
              setEditingResource(null);
            }}
            defaultOfferingId={offering.id}
            sectionId={offering.sectionId}
            initialResource={editingResource}
          />
        </>
      )}
    </div>
  );
}
