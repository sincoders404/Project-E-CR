"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, BookOpen, Plus } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { getCurrentTerm, getVisibleOfferings } from "@/data/queries";
import { CourseRow } from "@/components/domain/CourseRow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CoursesPage() {
  const { currentUser, offerings, enrollments, courses, terms, sections } = useRole();

  const currentTerm = getCurrentTerm(terms);
  const previousTerms = terms.filter((t) => !t.isCurrent);

  // Track expanded state for previous terms
  const [openTerms, setOpenTerms] = useState<Record<string, boolean>>({});

  const toggleTerm = (termId: string) => {
    setOpenTerms((prev) => ({ ...prev, [termId]: !prev[termId] }));
  };

  // This term offerings
  const currentOfferings = getVisibleOfferings(currentUser, offerings, enrollments, currentTerm.id);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            My Courses
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Current curriculum subjects and archives of previous terms.
          </p>
        </div>

        <Link href="/offerings">
          <Button size="md" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Retake a Course
          </Button>
        </Link>
      </div>

      {/* ── This Term Courses (Open by default) ─────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-ink-900">
              {currentTerm.name} (Current Term)
            </h2>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
              {currentOfferings.length} Courses
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {currentOfferings.map((offering) => {
            const course = courses.find((c) => c.id === offering.courseId);
            if (!course) return null;

            const isRetake = offering.sectionId !== currentUser.sectionId;
            const otherSection = sections.find((s) => s.id === offering.sectionId);

            return (
              <CourseRow
                key={offering.id}
                course={course}
                offering={offering}
                isRetake={isRetake}
                retakeSectionName={otherSection ? `CSE ${otherSection.name}` : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* ── Previous Terms (Collapsed dropdowns, newest first) ─── */}
      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-sm font-bold text-ink-700 uppercase tracking-wider">
          Previous Terms Archive
        </h2>

        {previousTerms.map((term) => {
          const termOfferings = getVisibleOfferings(currentUser, offerings, enrollments, term.id);
          const isOpen = openTerms[term.id] || false;

          return (
            <Card key={term.id} variant="muted" className="overflow-hidden p-4">
              <div
                onClick={() => toggleTerm(term.id)}
                className="flex cursor-pointer items-center justify-between select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-ink-600 font-bold">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">{term.name}</h3>
                    <p className="text-[11px] text-ink-500">
                      {termOfferings.length} Completed Course(s)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={isOpen ? "Collapse term" : "Expand term"}
                  className="press p-1 text-ink-500 hover:text-ink-900"
                >
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {isOpen && (
                <div className="mt-4 grid gap-3 border-t border-edge/60 pt-4 sm:grid-cols-2">
                  {termOfferings.map((offering) => {
                    const course = courses.find((c) => c.id === offering.courseId);
                    if (!course) return null;
                    return (
                      <CourseRow
                        key={offering.id}
                        course={course}
                        offering={offering}
                      />
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
