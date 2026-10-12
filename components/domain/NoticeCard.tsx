"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { FileAttachment } from "@/components/ui/FileAttachment";
import { useToast } from "@/components/ui/Toast";
import type { Notice } from "@/data/course";
import { cn } from "@/lib/cn";

const typeTone = { danger: "danger", info: "info", neutral: "neutral" } as const;

/** White notice card for the Class Details board (spec 8.19). */
export function NoticeCard({ notice }: { notice: Notice }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { showToast } = useToast();

  return (
    <article className="relative rounded-lg bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-10">
        <Chip tone={typeTone[notice.typeTone]}>{notice.type}</Chip>
        <span aria-hidden className="text-ink-400">
          •
        </span>
        <span className="text-xs text-ink-500">{notice.date}</span>
      </div>

      <button
        type="button"
        aria-label={bookmarked ? `Remove bookmark from ${notice.title}` : `Bookmark ${notice.title}`}
        aria-pressed={bookmarked}
        onClick={() => setBookmarked((b) => !b)}
        className={cn(
          "press absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
          bookmarked ? "text-brand-700" : "text-ink-400",
        )}
      >
        <Bookmark aria-hidden className={cn("h-[18px] w-[18px]", bookmarked && "fill-brand-700")} />
      </button>

      <h3 className="mt-2.5 text-[17px] leading-6 font-bold text-ink-900">{notice.title}</h3>
      <p className="mt-1.5 text-sm leading-5 text-ink-700">{notice.body}</p>

      {notice.attachment && (
        <FileAttachment
          className="mt-3"
          name={notice.attachment.name}
          meta={notice.attachment.meta}
          action="icon"
          onDownload={() => showToast()}
        />
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-3.5">
        <span className="flex items-center gap-2.5">
          <Avatar size={32} initials={notice.authorInitials} />
          <span className="text-[13px] font-semibold text-ink-900">{notice.author}</span>
        </span>
        <span className="text-xs text-ink-500">{notice.verified}</span>
      </div>
    </article>
  );
}
