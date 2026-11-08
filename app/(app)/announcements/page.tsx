"use client";

import { useState } from "react";
import { Plus, Megaphone } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { getVisiblePosts, isUserCR } from "@/data/queries";
import { PostCard } from "@/components/domain/PostCard";
import { FilterBar } from "@/components/domain/FilterBar";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { PostFormModal } from "@/components/domain/PostFormModal";
import { Post } from "@/data/types";

export default function AnnouncementsPage() {
  const {
    currentUser,
    personaRole,
    posts,
    offerings,
    enrollments,
    terms,
    courses,
    sectionCRs,
  } = useRole();

  const [activeType, setActiveType] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Queries
  const visiblePosts = getVisiblePosts(currentUser, posts, offerings, enrollments);

  // Apply filters
  const filteredPosts = visiblePosts.filter((post) => {
    // Type tab
    if (activeType !== "all" && post.type !== activeType) return false;

    // Offering details
    const off = offerings.find((o) => o.id === post.offeringId);

    // Term filter
    if (selectedTerm !== "all") {
      if (off && off.termId !== selectedTerm) return false;
    }

    // Course filter
    if (selectedCourse !== "all") {
      if (!off || off.courseId !== selectedCourse) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Pagination (10 per page per Spec 7.4)
  const pageSize = 10;
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const canManage = isUserCR(currentUser.id, sectionCRs) || personaRole === "CR";
  const userSectionId = currentUser.sectionId || "sec-33a";

  const tabItems = [
    { id: "all", label: "All Items", count: visiblePosts.length },
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Announcements & Deadlines
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Broadcasts, schedule revisions, homework deadlines, and exam routines.
          </p>
        </div>

        {canManage && (
          <Button
            size="md"
            onClick={() => {
              setEditingPost(null);
              setPostModalOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Post Notice
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          label="Filter announcement type"
          value={activeType}
          onChange={(val) => {
            setActiveType(val);
            setCurrentPage(1);
          }}
          items={tabItems}
        />
      </div>

      {/* Filter Bar (Term, Course, Search) */}
      <FilterBar
        terms={terms}
        courses={courses}
        selectedTerm={selectedTerm}
        onTermChange={(t) => {
          setSelectedTerm(t);
          setCurrentPage(1);
        }}
        selectedCourse={selectedCourse}
        onCourseChange={(c) => {
          setSelectedCourse(c);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      {/* Posts List */}
      {pagedPosts.length === 0 ? (
        <div className="rounded-xl border border-edge bg-surface py-14 shadow-card">
          <EmptyState
            icon={<Megaphone />}
            title="No matching posts found"
            caption="Try adjusting your filters or clearing search criteria to view announcements."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pagedPosts.map((post) => {
            const off = offerings.find((o) => o.id === post.offeringId);
            const crs = courses.find((c) => c.id === off?.courseId);
            return (
              <PostCard
                key={post.id}
                post={post}
                courseCode={crs?.code}
                canManage={canManage}
                onEdit={(p) => {
                  setEditingPost(p);
                  setPostModalOpen(true);
                }}
              />
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Post Modal */}
      {canManage && (
        <PostFormModal
          open={postModalOpen}
          onClose={() => {
            setPostModalOpen(false);
            setEditingPost(null);
          }}
          sectionId={userSectionId}
          initialPost={editingPost}
        />
      )}
    </div>
  );
}
