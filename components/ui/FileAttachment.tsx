import { FileText } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

type FileAttachmentProps = {
  name: string;
  meta: string;
  /** "button" renders a primary sm Download button (Dashboard), "icon" a small download tile. */
  action?: "button" | "icon";
  onDownload?: () => void;
  className?: string;
};

/** Attachment row (spec 8.15): file icon + name/meta + download action. */
export function FileAttachment({ name, meta, action = "icon", onDownload, className }: FileAttachmentProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-md border border-edge bg-surface p-2.5", className)}>
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700"
      >
        <FileText className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink-900">{name}</p>
        <p className="text-[11px] text-ink-500">{meta}</p>
      </div>
      {action === "button" ? (
        <Button size="sm" onClick={onDownload}>
          Download
        </Button>
      ) : (
        <button
          type="button"
          onClick={onDownload}
          aria-label={`Download ${name}`}
          className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      )}
    </div>
  );
}
