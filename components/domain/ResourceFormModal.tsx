"use client";

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { Resource } from "@/data/types";

type ResourceFormModalProps = {
  open: boolean;
  onClose: () => void;
  defaultOfferingId?: string;
  sectionId: string;
  initialResource?: Resource | null;
};

export function ResourceFormModal({
  open,
  onClose,
  defaultOfferingId,
  sectionId,
  initialResource,
}: ResourceFormModalProps) {
  const { offerings, courses, currentUser, addResource, editResource } = useRole();
  const { showToast } = useToast();

  const sectionOfferings = offerings.filter((o) => o.sectionId === sectionId);

  const [offeringId, setOfferingId] = useState(
    defaultOfferingId || sectionOfferings[0]?.id || ""
  );
  const [title, setTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");

  useEffect(() => {
    if (initialResource) {
      setOfferingId(initialResource.offeringId);
      setTitle(initialResource.title);
      setDriveUrl(initialResource.driveUrl);
    } else {
      setOfferingId(defaultOfferingId || sectionOfferings[0]?.id || "");
      setTitle("");
      setDriveUrl("");
    }
  }, [initialResource, defaultOfferingId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driveUrl.trim() || !offeringId) return;

    if (initialResource) {
      editResource(initialResource.id, {
        offeringId,
        title: title.trim(),
        driveUrl: driveUrl.trim(),
      });
      showToast("Resource link updated");
    } else {
      addResource({
        offeringId,
        title: title.trim(),
        driveUrl: driveUrl.trim(),
        authorId: currentUser.id,
      });
      showToast("Resource uploaded to section");
    }

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialResource ? "Edit Resource" : "Upload Google Drive Resource"}
      subtitle="Share lecture slides, code repositories, or study notes via Google Drive"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Course */}
        <div>
          <label htmlFor="res-course" className="mb-1.5 block text-xs font-semibold text-ink-700">
            Target Course
          </label>
          <select
            id="res-course"
            value={offeringId}
            onChange={(e) => setOfferingId(e.target.value)}
            required
            className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
          >
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

        {/* Title */}
        <div>
          <label htmlFor="res-title" className="mb-1.5 block text-xs font-semibold text-ink-700">
            Resource Title
          </label>
          <input
            id="res-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chapter 4 Slides (Lexical Analysis)"
            className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-brand-500"
          />
        </div>

        {/* Drive URL */}
        <div>
          <label htmlFor="res-url" className="mb-1.5 block text-xs font-semibold text-ink-700">
            Google Drive Link
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400">
              <Link2 className="h-4 w-4" />
            </span>
            <input
              id="res-url"
              type="url"
              required
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="h-10 w-full rounded-md border border-edge bg-surface pr-3 pl-9 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-brand-500"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end gap-3 border-t border-edge pt-4">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="md">
            {initialResource ? "Save Changes" : "Upload"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
