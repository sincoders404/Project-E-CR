"use client";

import { useState } from "react";
import { Megaphone, Calendar, HardDrive, Link2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { PostType } from "@/data/posts";
import { cn } from "@/lib/cn";

type PostModalProps = {
  open: boolean;
  onClose: () => void;
  defaultCourseId?: string;
};

export function PostModal({ open, onClose, defaultCourseId }: PostModalProps) {
  const { classes, addPost } = useRole();
  const { showToast } = useToast();

  const currentClass = classes.find((c) => c.current) || classes[0];
  const courses = currentClass ? currentClass.courses : [];

  const [type, setType] = useState<PostType>("announcement");
  const [courseId, setCourseId] = useState(defaultCourseId || (courses[0]?.id ?? ""));
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [due, setDue] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [label, setLabel] = useState("");
  const [pinned, setPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCourse = courses.find((c) => c.id === courseId) || courses[0];

    addPost({
      type,
      courseId: selectedCourse ? selectedCourse.id : "cse-221",
      courseCode: selectedCourse ? selectedCourse.code : "CSE 221",
      semester: currentClass ? currentClass.semester : "Spring 2026",
      title: title.trim(),
      body: body.trim(),
      pinned: type === "announcement" ? pinned : false,
      urgent: type === "deadline" ? true : false,
      due: type === "deadline" ? due || "Tomorrow, 11:59 PM" : undefined,
      driveUrl: type === "resource" ? driveUrl || "https://drive.google.com" : undefined,
      label: type === "resource" ? label || "Drive File" : undefined,
    });

    showToast("Post published successfully");
    // Reset and close
    setTitle("");
    setBody("");
    setDue("");
    setDriveUrl("");
    setLabel("");
    setPinned(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Post"
      subtitle="Share announcements, deadlines, or Google Drive resources with your class"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Type Segmented Picker */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-700">
            Post Type
          </label>
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-brand-50 p-1">
            <button
              type="button"
              onClick={() => setType("announcement")}
              className={cn(
                "press flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold",
                type === "announcement"
                  ? "bg-surface text-brand-700 shadow-sm"
                  : "text-ink-500 hover:text-ink-900"
              )}
            >
              <Megaphone className="h-3.5 w-3.5" />
              Notice
            </button>
            <button
              type="button"
              onClick={() => setType("deadline")}
              className={cn(
                "press flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold",
                type === "deadline"
                  ? "bg-surface text-brand-700 shadow-sm"
                  : "text-ink-500 hover:text-ink-900"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              Deadline
            </button>
            <button
              type="button"
              onClick={() => setType("resource")}
              className={cn(
                "press flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold",
                type === "resource"
                  ? "bg-surface text-brand-700 shadow-sm"
                  : "text-ink-500 hover:text-ink-900"
              )}
            >
              <HardDrive className="h-3.5 w-3.5" />
              Resource
            </button>
          </div>
        </div>

        {/* Course Select */}
        <div>
          <label
            htmlFor="post-course"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Target Course
          </label>
          <select
            id="post-course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="post-title"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Title
          </label>
          <input
            id="post-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === "announcement"
                ? "e.g. Midterm Routine Clarification"
                : type === "deadline"
                ? "e.g. Lab 3 Report Submission"
                : "e.g. Lecture 08 Slides & Codes"
            }
            className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-brand-500"
          />
        </div>

        {/* Details / Body */}
        <div>
          <label
            htmlFor="post-body"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Details
          </label>
          <textarea
            id="post-body"
            rows={3}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the details of the announcement, task description, or resource guide..."
            className="w-full rounded-md border border-edge bg-surface p-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-brand-500"
          />
        </div>

        {/* Extra by type */}
        {type === "deadline" && (
          <div>
            <label
              htmlFor="post-due"
              className="mb-1.5 block text-xs font-semibold text-ink-700"
            >
              Due Date & Time
            </label>
            <input
              id="post-due"
              type="text"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              placeholder="e.g. Tomorrow, 11:59 PM or Nov 15, 5:00 PM"
              className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-brand-500"
            />
          </div>
        )}

        {type === "resource" && (
          <div className="flex flex-col gap-3">
            <div>
              <label
                htmlFor="post-drive"
                className="mb-1.5 block text-xs font-semibold text-ink-700"
              >
                Google Drive URL
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400">
                  <Link2 className="h-4 w-4" />
                </span>
                <input
                  id="post-drive"
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="h-10 w-full rounded-md border border-edge bg-surface pr-3 pl-9 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-brand-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="post-label"
                className="mb-1.5 block text-xs font-semibold text-ink-700"
              >
                File Label / Size (optional)
              </label>
              <input
                id="post-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Chapter 4 Slides.pdf (3.8 MB)"
                className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-2 focus-visible:outline-brand-500"
              />
            </div>
          </div>
        )}

        {type === "announcement" && (
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              checked={pinned}
              onCheckedChange={setPinned}
              label="Pin as special CR notice (shows at top with soft blue background)"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-2 flex items-center justify-end gap-3 border-t border-edge pt-4">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="md">
            Publish Post
          </Button>
        </div>
      </form>
    </Modal>
  );
}

