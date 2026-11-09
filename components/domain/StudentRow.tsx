import { Avatar } from "@/components/ui/Avatar";
import { Student } from "@/data/classes";
import { cn } from "@/lib/cn";

type StudentRowProps = {
  student: Student;
  isCR?: boolean;
  onRemove?: () => void;
  className?: string;
};

export function StudentRow({
  student,
  isCR,
  onRemove,
  className,
}: StudentRowProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border border-edge bg-surface px-3 py-2.5 transition-colors hover:bg-brand-50/30",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar size={32} initials={initials} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-ink-900">
              {student.name}
            </span>
            {isCR && (
              <span className="rounded bg-brand-100 px-1.5 py-0.2 text-[10px] font-bold text-brand-700">
                CR
              </span>
            )}
          </div>
          <span className="block text-xs text-ink-500 tabular">
            ID: {student.id}
          </span>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="press text-xs font-semibold text-danger-600 hover:underline px-2 py-1"
        >
          Remove
        </button>
      )}
    </div>
  );
}

