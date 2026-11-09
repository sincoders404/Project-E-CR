"use client";

import { useState } from "react";
import { Pin, Calendar, Clock, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Post } from "@/data/types";
import { Chip } from "@/components/ui/Chip";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useRole } from "@/context/RoleProvider";
import { cn } from "@/lib/cn";

type PostCardProps = {
  post: Post;
  courseCode?: string;
  onEdit?: (post: Post) => void;
  canManage?: boolean;
};

export function PostCard({ post, courseCode, onEdit, canManage }: PostCardProps) {
  const { deletePost, users } = useRole();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const author = users.find((u) => u.id === post.authorId);
  const isPinned = post.pinned;

  const typeTone =
    post.type === "announcement"
      ? "info"
      : post.type === "deadline"
      ? "danger"
      : "purple";

  const kindTone =
    post.kind === "reschedule"
      ? "warning"
      : post.kind === "cancel"
      ? "danger"
      : post.kind === "online"
      ? "info"
      : "neutral";

  return (
    <>
      <div
        className={cn(
          "press relative rounded-lg p-5 transition-all",
          isPinned
            ? "border border-brand-100 bg-brand-50/70 shadow-sm"
            : "border border-edge bg-surface shadow-card hover:shadow-md"
        )}
      >
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isPinned && (
              <Chip tone="info" icon={<Pin className="h-3 w-3 rotate-45" />}>
                Pinned Notice
              </Chip>
            )}
            <Chip tone={typeTone}>
              {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </Chip>
            {post.kind !== "general" && (
              <Chip tone={kindTone}>
                {post.kind.charAt(0).toUpperCase() + post.kind.slice(1)}
              </Chip>
            )}
            {courseCode ? (
              <span className="rounded bg-slate-chip px-2 py-0.5 text-[11px] font-bold text-ink-700">
                {courseCode}
              </span>
            ) : (
              <span className="rounded bg-slate-chip px-2 py-0.5 text-[11px] font-bold text-ink-700">
                Section Wide
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.createdAt.split("T")[0]}
            </span>

            {canManage && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Post options"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="press flex h-7 w-7 items-center justify-center rounded text-ink-400 hover:bg-brand-50 hover:text-ink-700"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {menuOpen && (
                  <div
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 top-8 z-30 min-w-[120px] rounded-md border border-edge bg-surface p-1 shadow-pop"
                  >
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit(post);
                        }}
                        className="press flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-brand-50"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setDeleteModalOpen(true);
                      }}
                      className="press flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-xs font-semibold text-danger-600 hover:bg-danger-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold text-ink-900 leading-snug">
          {post.title}
        </h3>

        {/* Body */}
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700 whitespace-pre-line">
          {post.body}
        </p>

        {/* Due date or Exam date if applicable */}
        {post.dueAt && (
          <div className="mt-4 flex items-center gap-2 border-t border-edge/60 pt-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-warning-100 px-2.5 py-1 text-xs font-bold text-warning-600">
              <Calendar className="h-3.5 w-3.5" />
              {post.type === "exam" ? "Exam Date:" : "Due:"} {post.dueAt.replace("T", " ").replace("Z", "")}
            </span>
          </div>
        )}

        {/* Footer: Posted by author */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-ink-400 border-t border-edge/40 pt-2.5">
          <span>
            Posted by{" "}
            <strong className="font-semibold text-ink-700">
              {author?.name || "Class Representative"}
            </strong>
          </span>
          {post.expiresOn && (
            <span className="italic text-ink-400">
              Notice active until {post.expiresOn}
            </span>
          )}
        </div>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deletePost(post.id)}
        title="Delete Post"
        message="Are you sure you want to permanently delete this post? This action cannot be undone."
        confirmLabel="Delete Post"
      />
    </>
  );
}
