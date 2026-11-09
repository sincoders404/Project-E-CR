import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";
import { Course, Offering } from "@/data/types";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type CourseRowProps = {
  course: Course;
  offering: Offering;
  isRetake?: boolean;
  retakeSectionName?: string;
  className?: string;
};

export function CourseRow({
  course,
  offering,
  isRetake,
  retakeSectionName,
  className,
}: CourseRowProps) {
  return (
    <Link
      href={`/courses/offering/${offering.id}`}
      className={cn(
        "press group flex items-center justify-between rounded-lg border border-edge bg-surface p-4 transition-all hover:border-brand-500 hover:bg-brand-50/40 hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 font-bold text-xs"
        >
          {course.code.split(" ")[0]}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-xs text-brand-700">{course.code}</span>
            <span className="truncate text-sm font-bold text-ink-900 group-hover:text-brand-700">
              {course.title}
            </span>
            {isRetake && (
              <Chip tone="purple">
                Retake ({retakeSectionName || "Other Sec"})
              </Chip>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-500 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-ink-400" />
            {offering.facultyName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-ink-400 group-hover:text-brand-700">
        <span className="text-xs font-semibold hidden sm:inline">View Course</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
