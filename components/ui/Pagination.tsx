"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5 py-4", className)}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="press flex h-8 w-8 items-center justify-center rounded-md border border-edge bg-surface text-ink-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-brand-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
        const active = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "press flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-semibold",
              active
                ? "bg-brand-700 text-white shadow-xs"
                : "border border-edge bg-surface text-ink-700 hover:bg-brand-50"
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="press flex h-8 w-8 items-center justify-center rounded-md border border-edge bg-surface text-ink-600 disabled:opacity-40 disabled:pointer-events-none hover:bg-brand-50"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
