"use client";

import { Bookmark, Calendar, Globe, Video } from "lucide-react";
import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { FileAttachment } from "@/components/ui/FileAttachment";
import { useToast } from "@/components/ui/Toast";
import type { Announcement } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const tagTones: Record<Announcement["kind"], Array<"danger" | "info" | "neutral" | "warning">> = {
  urgent: ["danger"],
  meeting: ["info", "neutral"],
  routine: ["info", "info"],
  exam: ["info"],
};

/** Tinted announcement row (spec 8.19) with bookmark toggle. */
export function AnnouncementItem({ item }: { item: Announcement }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { showToast } = useToast();

  return (
    <article className="relative rounded-md bg-brand-50 p-3.5 pr-12">
      {/* Header: tags + course + time + bookmark */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-1">
        {item.tags.map((tag, i) => (
          <Chip key={tag} tone={tagTones[item.kind][i] ?? "info"}>
            {tag}
          </Chip>
        ))}
        {item.course && <Chip tone="info">{item.course}</Chip>}
        <span className="text-[11px] text-ink-500">• {item.time}</span>
      </div>

      <button
        type="button"
        aria-label={bookmarked ? `Remove bookmark from ${item.title}` : `Bookmark ${item.title}`}
        aria-pressed={bookmarked}
        onClick={() => setBookmarked((b) => !b)}
        className={cn(
          "press absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
          bookmarked ? "text-brand-700" : "text-ink-400",
        )}
      >
        <Bookmark aria-hidden className={cn("h-[18px] w-[18px]", bookmarked && "fill-brand-700")} />
      </button>

      <h3 className="mt-2 pr-2 text-[15px] leading-5 font-bold text-ink-900">{item.title}</h3>
      <p className="clamp-2 mt-1 text-[13px] leading-5 text-ink-700">{item.body}</p>

      {item.attachment ? (
        <FileAttachment
          className="mt-3 bg-white"
          name={item.attachment.name}
          meta={item.attachment.size}
          action="button"
          onDownload={() => showToast()}
        />
      ) : item.meta ? (
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-500">
            <span className="flex items-center gap-1.5">
              <Calendar aria-hidden className="h-3.5 w-3.5" />
              {item.meta.when}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe aria-hidden className="h-3.5 w-3.5" />
              {item.meta.where}
            </span>
            <span className="flex items-center gap-1.5 md:hidden">
              <Video aria-hidden className="h-3.5 w-3.5" />
              Online
            </span>
          </div>
          <button
            type="button"
            onClick={() => showToast()}
            className="press text-[13px] font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {item.meta.cta} →
          </button>
        </div>
      ) : null}
    </article>
  );
}
