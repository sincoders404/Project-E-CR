"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import {
  getCurrentTerm,
  getCatalogCourses,
  getUserRetakeRequests,
} from "@/data/queries";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export default function OfferingsCatalogPage() {
  const { currentUser, courses, offerings, terms, enrollmentRequests, sections } = useRole();
  const [search, setSearch] = useState("");

  const currentTerm = getCurrentTerm(terms);
  const catalog = getCatalogCourses(courses, offerings, currentTerm.id);
  const myRequests = getUserRetakeRequests(currentUser.id, enrollmentRequests);

  const filteredCatalog = catalog.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.course.code.toLowerCase().includes(q) ||
      item.course.title.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          Course Catalog & Retake Requests
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Browse courses offered across department sections for {currentTerm.name} and submit retake enrollments.
        </p>
      </div>

      {/* Search box */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search by course code or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-edge bg-surface pr-4 pl-9 text-xs text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 shadow-xs"
        />
      </div>

      {/* Course Catalog Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredCatalog.map(({ course, offeringCount }) => (
          <Link
            key={course.id}
            href={`/offerings/${course.id}`}
            className="press group flex items-center justify-between rounded-xl border border-edge bg-surface p-4 shadow-card hover:border-brand-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 font-bold text-xs">
                <BookOpen className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-brand-700">
                    {course.code}
                  </span>
                  <span className="truncate text-sm font-bold text-ink-900 group-hover:text-brand-700">
                    {course.title}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink-500">
                  Offered by{" "}
                  <strong className="text-ink-700">
                    {offeringCount} section{offeringCount !== 1 ? "s" : ""}
                  </strong>{" "}
                  this term
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-brand-700">
              <span>View Sections</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── My Requests List (Bottom) ──────────────────────────── */}
      <div className="mt-4 flex flex-col gap-3">
        <h2 className="text-base font-bold text-ink-900 border-b border-edge/60 pb-2">
          My Retake Requests ({myRequests.length})
        </h2>

        {myRequests.length === 0 ? (
          <p className="text-xs text-ink-400 py-4">
            You haven&apos;t submitted any retake requests for {currentTerm.name}.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {myRequests.map((req) => {
              const off = offerings.find((o) => o.id === req.offeringId);
              const crs = courses.find((c) => c.id === off?.courseId);
              const sec = sections.find((s) => s.id === off?.sectionId);

              const isPending = req.status === "pending";
              const isApproved = req.status === "approved";

              return (
                <div
                  key={req.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-edge bg-surface p-3.5 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        isApproved
                          ? "bg-success-100 text-success-600"
                          : isPending
                          ? "bg-warning-100 text-warning-600"
                          : "bg-danger-100 text-danger-600"
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isPending ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-ink-900">
                        {crs?.code}: {crs?.title} (CSE {sec?.name})
                      </h4>
                      <p className="text-[11px] text-ink-500">
                        Submitted: {req.createdAt} • Faculty: {off?.facultyName}
                      </p>
                      {req.rejectReason && (
                        <p className="mt-0.5 text-xs text-danger-600 italic">
                          Reason: {req.rejectReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <Chip
                    tone={
                      isApproved ? "success" : isPending ? "warning" : "danger"
                    }
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Chip>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
