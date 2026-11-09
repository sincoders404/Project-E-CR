import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type PersonRowProps = {
  name: string;
  studentId?: string;
  badge?: string;
  onRemove?: () => void;
  className?: string;
};

export function PersonRow({
  name,
  studentId,
  badge,
  onRemove,
  className,
}: PersonRowProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-edge bg-surface px-3.5 py-2.5 transition-colors hover:bg-brand-50/30",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar size={32} initials={initials} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-ink-900">
              {name}
            </span>
            {badge && (
              <Chip tone="info" className="h-4.5 px-1.5 text-[9px]">
                {badge}
              </Chip>
            )}
          </div>
          {studentId && (
            <span className="block text-xs text-ink-500 tabular">
              ID: {studentId}
            </span>
          )}
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
