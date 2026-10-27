import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

/** Breadcrumb row (spec 8.17): book icon + segments + trailing chip node. */
export function Breadcrumb({
  segments,
  trailing,
}: {
  segments: Array<{ label: string; href?: string }>;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-ink-500">
      <BookOpen aria-hidden className="h-3.5 w-3.5" />
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
        {segments.map((s, i) => (
          <span key={s.label} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="h-3 w-3 shrink-0" />}
            {s.href ? (
              <Link href={s.href} className="truncate hover:text-ink-700 hover:underline underline-offset-2">
                {s.label}
              </Link>
            ) : (
              <span className={cnLast(i, segments.length)}>{s.label}</span>
            )}
          </span>
        ))}
      </nav>
      {trailing}
    </div>
  );
}

function cnLast(i: number, len: number) {
  return i === len - 1 ? "truncate font-semibold text-ink-700" : "truncate";
}
