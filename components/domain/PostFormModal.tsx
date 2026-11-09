"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { Post, PostType, PostKind, Offering, Course } from "@/data/types";
import { cn } from "@/lib/cn";

type PostFormModalProps = {
  open: boolean;
  onClose: () => void;
  defaultOfferingId?: string;
  sectionId: string;
  initialPost?: Post | null;
};

export function PostFormModal({
  open,
  onClose,
  defaultOfferingId,
  sectionId,
  initialPost,
}: PostFormModalProps) {
  const { offerings, courses, currentUser, addPost, editPost } = useRole();
  const { showToast } = useToast();

  const sectionOfferings = offerings.filter((o) => o.sectionId === sectionId);

  const [type, setType] = useState<PostType>("announcement");
  const [targetOfferingId, setTargetOfferingId] = useState<string>("section-wide");
  const [kind, setKind] = useState<PostKind>("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setType(initialPost.type);
      setTargetOfferingId(initialPost.offeringId || "section-wide");
      setKind(initialPost.kind);
      setTitle(initialPost.title);
      setBody(initialPost.body);
      setDueAt(initialPost.dueAt || "");
      setExpiresOn(initialPost.expiresOn || "");
      setPinned(initialPost.pinned);
    } else {
      setType("announcement");
      setTargetOfferingId(defaultOfferingId || "section-wide");
      setKind("general");
      setTitle("");
      setBody("");
      setDueAt("");
      setExpiresOn("");
      setPinned(false);
    }
  }, [initialPost, defaultOfferingId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const offeringId = targetOfferingId === "section-wide" ? undefined : targetOfferingId;

    if (initialPost) {
      editPost(initialPost.id, {
        type,
        offeringId,
        kind,
        title: title.trim(),
        body: body.trim(),
        dueAt: type !== "announcement" ? dueAt || undefined : undefined,
        expiresOn: kind !== "general" && expiresOn ? expiresOn : undefined,
        pinned,
      });
      showToast("Post updated successfully");
    } else {
      addPost({
        sectionId,
        offeringId,
        type,
        kind,
        title: title.trim(),
        body: body.trim(),
        dueAt: type !== "announcement" ? dueAt || undefined : undefined,
        expiresOn: kind !== "general" && expiresOn ? expiresOn : undefined,
        pinned,
        authorId: currentUser.id,
      });
      showToast("Post broadcasted successfully");
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialPost ? "Edit Post" : "Create New Post"}
      subtitle="Share announcements, assignment deadlines, or exam routines"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Post Type */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-700">
            Post Type
          </label>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-brand-50 p-1">
            {(["announcement", "deadline", "exam"] as PostType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "press py-1.5 text-xs font-semibold rounded-md capitalize",
                  type === t
                    ? "bg-surface text-brand-700 shadow-sm"
                    : "text-ink-500 hover:text-ink-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Course / Whole Section Selector */}
        <div>
          <label htmlFor="post-target" className="mb-1.5 block text-xs font-semibold text-ink-700">
            Scope
          </label>
          <select
            id="post-target"
            value={targetOfferingId}
            onChange={(e) => setTargetOfferingId(e.target.value)}
            className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
          >
            <option value="section-wide">Whole Section (Section-wide Broadcast)</option>
            {sectionOfferings.map((offering) => {
              const c = courses.find((crs) => crs.id === offering.courseId);
              return (
                <option key={offering.id} value={offering.id}>
                  {c ? `${c.code}: ${c.title}` : offering.id}
                </option>
              );
            })}
          </select>
        </div>

        {/* Kind Tag (for Announcements) */}
        {type === "announcement" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">
              Notice Kind
            </label>
            <div className="grid grid-cols-4 gap-1 rounded-lg bg-brand-50 p-1">
              {(["general", "reschedule", "cancel", "online"] as PostKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "press py-1 text-xs font-semibold rounded-md capitalize",
                    kind === k
                      ? "bg-surface text-brand-700 shadow-sm"
                      : "text-ink-500 hover:text-ink-900"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expiry Date (if not General) */}
        {kind !== "general" && (
          <div>
            <label htmlFor="post-expiry" className="mb-1.5 block text-xs font-semibold text-ink-700">
              Notice Expiry Date (disappears after this date)
            </label>
            <input
              id="post-expiry"
              type="date"
              value={expiresOn}
              onChange={(e) => setExpiresOn(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="post-title" className="mb-1.5 block text-xs font-semibold text-ink-700">
            Title
          </label>
          <input
            id="post-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midterm Routine Clarification"
            className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-brand-500"
          />
        </div>

        {/* Details / Body */}
        <div>
          <label htmlFor="post-body" className="mb-1.5 block text-xs font-semibold text-ink-700">
            Details
          </label>
          <textarea
            id="post-body"
            rows={3}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write announcement details..."
            className="w-full rounded-md border border-edge bg-surface p-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-brand-500"
          />
        </div>

        {/* Due Date (Deadline or Exam) */}
        {type !== "announcement" && (
          <div>
            <label htmlFor="post-due" className="mb-1.5 block text-xs font-semibold text-ink-700">
              {type === "exam" ? "Exam Date & Time" : "Submission Due Date & Time"}
            </label>
            <input
              id="post-due"
              type="text"
              required
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              placeholder="e.g. 2026-11-15 11:59 PM"
              className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
            />
          </div>
        )}

        {/* Pin as Special Notice */}
        <div className="pt-1">
          <Checkbox
            checked={pinned}
            onCheckedChange={setPinned}
            label="Pin as special notice (appears at the top with highlighted styling)"
          />
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-end gap-3 border-t border-edge pt-4">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="md">
            {initialPost ? "Save Changes" : "Post"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
