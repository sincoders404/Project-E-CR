"use client";

import { useState } from "react";
import { ExternalLink, HardDrive, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Resource } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { useRole } from "@/context/RoleProvider";

type ResourceCardProps = {
  resource: Resource;
  courseCode?: string;
  onEdit?: (resource: Resource) => void;
  canManage?: boolean;
};

export function ResourceCard({
  resource,
  courseCode,
  onEdit,
  canManage,
}: ResourceCardProps) {
  const { deleteResource, users } = useRole();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const author = users.find((u) => u.id === resource.authorId);

  return (
    <>
      <div className="press flex flex-col justify-between rounded-lg border border-edge bg-surface p-4 shadow-card hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <HardDrive className="h-5 w-5" />
            </span>
            <div>
              {courseCode && (
                <span className="rounded bg-slate-chip px-2 py-0.5 text-[10px] font-bold text-ink-700">
                  {courseCode}
                </span>
              )}
              <h4 className="mt-1 text-sm font-bold text-ink-900 leading-snug">
                {resource.title}
              </h4>
            </div>
          </div>

          {canManage && (
            <div className="relative">
              <button
                type="button"
                aria-label="Resource options"
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
                        onEdit(resource);
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-edge/60 pt-3 text-xs">
          <span className="text-[11px] text-ink-400">
            Uploaded by{" "}
            <strong className="font-semibold text-ink-700">
              {author?.name || "Class Representative"}
            </strong>
          </span>

          <a
            href={resource.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (resource.driveUrl.includes("demo-")) {
                e.preventDefault();
                showToast("Demo only: Google Drive link simulated");
              }
            }}
            className="press inline-flex items-center gap-1.5 rounded-md bg-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Drive
          </a>
        </div>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteResource(resource.id)}
        title="Delete Resource"
        message="Are you sure you want to remove this resource link?"
        confirmLabel="Delete"
      />
    </>
  );
}
