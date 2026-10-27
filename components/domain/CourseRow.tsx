import { BookOpen } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";
import type { CourseRow as CourseRowData } from "@/data/profile";
import { cn } from "@/lib/cn";

type CourseRowProps = {
  course: CourseRowData;
  /** Hide the instructor meta line (Academic Records attendance list). */
  bare?: boolean;
  className?: string;
};

/** Tinted course row (spec 8.19): initial tile, title + credit chip, meta, presence bar. */
export function CourseRow({ course, bare = false, className }: CourseRowProps) {
  const { showToast } = useToast();

  return (
    <div className={cn("flex items-center gap-3 rounded-md bg-brand-50 p-3", className)}>
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white"
      >
        {course.letter}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] leading-5 font-bold text-ink-900">{course.title}</h3>
          <Chip tone="info" className="h-5">
            {course.credits}
          </Chip>
        </div>
        {!bare && <p className="mt-0.5 text-[11px] text-ink-500">{course.meta}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="w-20 text-right">
          <p className="text-base font-extrabold text-ink-900 tabular">{course.presence}%</p>
          <p className="text-[10px] text-ink-500">Presence</p>
        </div>
        <ProgressBar value={course.presence} size={6} label={`${course.title} presence ${course.presence}%`} className="hidden w-24 sm:block" />
        <button
          type="button"
          onClick={() => showToast()}
          aria-label={`Open course materials for ${course.title}`}
          className="press hidden h-8 w-8 items-center justify-center rounded-md text-brand-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:flex"
        >
          <BookOpen aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
