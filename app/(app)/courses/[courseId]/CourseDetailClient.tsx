"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, GraduationCap, Megaphone } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostCard } from "@/components/domain/PostCard";
import { PostModal } from "@/components/domain/PostModal";

export function CourseDetailClient({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { classes, posts, role, deletePost } = useRole();

  // Find the course across all classes
  let targetCourse: { id: string; code: string; name: string; teacher: string; semester: string } | null = null;
  for (const c of classes) {
    const found = c.courses.find((crs) => crs.id === courseId);
    if (found) {
      targetCourse = { ...found, semester: c.semester };
      break;
    }
  }

  const [activeTab, setActiveTab] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  if (!targetCourse) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-bold text-ink-900">Course not found</h2>
        <p className="mt-1 text-sm text-ink-500">
          The requested course ID could not be located in your enrolled curriculum.
        </p>
        <Link href="/courses" className="mt-4">
          <Button variant="secondary" size="sm">
            Back to Courses
          </Button>
        </Link>
      </div>
    );
  }

  // Filter posts for this course
  const coursePosts = posts.filter(
    (p) => p.courseId === targetCourse.id || p.courseCode === targetCourse.code
  );

  const announcements = coursePosts.filter((p) => p.type === "announcement");
  const deadlines = coursePosts.filter((p) => p.type === "deadline");
  const resources = coursePosts.filter((p) => p.type === "resource");

  const displayPosts =
    activeTab === "all"
      ? coursePosts
      : activeTab === "announcement"
      ? announcements
      : activeTab === "deadline"
      ? deadlines
      : resources;

  const tabItems = [
    { id: "all", label: "All Items", count: coursePosts.length },
    { id: "announcement", label: "Notices", count: announcements.length },
    { id: "deadline", label: "Deadlines", count: deadlines.length },
    { id: "resource", label: "Resources", count: resources.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb text */}
      <div className="flex items-center gap-2 text-xs text-ink-500">
        <Link
          href="/courses"
          className="press flex items-center gap-1 font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Courses
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-700">{targetCourse.code}</span>
      </div>

      {/* Course Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-edge bg-surface p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-700">
              {targetCourse.code}
            </span>
            <span className="text-xs text-ink-400">•</span>
            <span className="text-xs font-semibold text-ink-500">
              {targetCourse.semester}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
            {targetCourse.name}
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
            <GraduationCap className="h-4 w-4 text-brand-700" />
            Instructor: {targetCourse.teacher}
          </p>
        </div>

        {/* CR Post Button */}
        {role === "CR" && (
          <Button
            size="md"
            onClick={() => setModalOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            + Add Post
          </Button>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center justify-between gap-3">
        <Tabs
          label="Filter course posts"
          value={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>

      {/* Posts Feed */}
      {displayPosts.length === 0 ? (
        <div className="rounded-lg border border-edge bg-surface py-12">
          <EmptyState
            icon={<Megaphone />}
            title="No posts in this category yet"
            caption="Check back later or switch tabs to see other announcements and resources."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showDelete={role === "CR" || role === "Admin"}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}

      {/* Post Modal with this course preselected */}
      {role === "CR" && (
        <PostModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultCourseId={targetCourse.id}
        />
      )}
    </div>
  );
}

