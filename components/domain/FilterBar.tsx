import { Search } from "lucide-react";
import { Term, Course } from "@/data/types";

type FilterBarProps = {
  terms: Term[];
  courses: Course[];
  selectedTerm: string;
  onTermChange: (termId: string) => void;
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function FilterBar({
  terms,
  courses,
  selectedTerm,
  onTermChange,
  selectedCourse,
  onCourseChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.5fr] items-center rounded-xl border border-edge bg-surface p-4 shadow-card">
      {/* Term select */}
      <div>
        <label htmlFor="filter-term" className="sr-only">
          Filter by Term
        </label>
        <select
          id="filter-term"
          value={selectedTerm}
          onChange={(e) => onTermChange(e.target.value)}
          className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-xs font-semibold text-ink-700 focus-visible:outline-brand-500"
        >
          <option value="all">All Terms</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} {t.isCurrent ? "(Current)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Course select */}
      <div>
        <label htmlFor="filter-course" className="sr-only">
          Filter by Course
        </label>
        <select
          id="filter-course"
          value={selectedCourse}
          onChange={(e) => onCourseChange(e.target.value)}
          className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-xs font-semibold text-ink-700 focus-visible:outline-brand-500"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Search Query */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search notices, deadlines, keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-md border border-edge bg-brand-50/50 pr-4 pl-9 text-xs text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:bg-white transition-colors"
        />
      </div>
    </div>
  );
}
