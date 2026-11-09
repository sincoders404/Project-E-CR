import { Clock, MapPin, User as UserIcon } from "lucide-react";
import { ScheduleEntry, Offering, Course, Post } from "@/data/types";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type ScheduleItemProps = {
  entry: ScheduleEntry;
  course?: Course;
  offering?: Offering;
  status: "done" | "now" | "next";
  notices?: Post[];
};

export function ScheduleItem({
  entry,
  course,
  offering,
  status,
  notices = [],
}: ScheduleItemProps) {
  const isDone = status === "done";
  const isNow = status === "now";
  const isNext = status === "next";

  return (
    <div
      className={cn(
        "press relative flex flex-col justify-between rounded-lg p-4 transition-all",
        isDone && "bg-muted/70 text-ink-500 border border-edge/60 opacity-80",
        isNow && "bg-brand-700 text-white shadow-md ring-2 ring-brand-700/20",
        isNext && "bg-surface shadow-card border border-edge/60 text-ink-900"
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold tabular",
              isNow ? "text-white/90" : "text-ink-500"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {entry.startTime} – {entry.endTime}
          </span>

          {isNow && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-700 animate-pulse" />
              Now
            </span>
          )}

          {isDone && (
            <span className="text-[11px] font-semibold text-ink-400">
              Completed
            </span>
          )}

          {isNext && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
              Up Next
            </span>
          )}
        </div>

        <div className="mt-3">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-bold",
              isNow ? "bg-white/20 text-white" : "bg-brand-100 text-brand-700"
            )}
          >
            {course?.code || "Course"}
          </span>
          <h4
            className={cn(
              "mt-1.5 text-sm font-bold leading-tight",
              isNow ? "text-white" : "text-ink-900"
            )}
          >
            {course?.title || "Class Session"}
          </h4>
        </div>

        {/* Routine notice badge if active */}
        {notices.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {notices.map((n) => (
              <span
                key={n.id}
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold capitalize",
                  isNow
                    ? "bg-amber-300 text-ink-900"
                    : n.kind === "cancel"
                    ? "bg-danger-100 text-danger-600"
                    : n.kind === "reschedule"
                    ? "bg-warning-100 text-warning-600"
                    : "bg-brand-100 text-brand-700"
                )}
              >
                {n.kind}: {n.title}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          "mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-xs",
          isNow ? "border-white/20 text-white/80" : "border-edge text-ink-500"
        )}
      >
        <span className="flex items-center gap-1">
          <UserIcon className="h-3 w-3" />
          {offering?.facultyName || "Faculty"}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <MapPin className="h-3 w-3" />
          {entry.room}
        </span>
      </div>
    </div>
  );
}
