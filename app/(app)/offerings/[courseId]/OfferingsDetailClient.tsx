"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Users, GraduationCap, Clock } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import {
  getCurrentTerm,
  getCourseOfferingsWithDetails,
  getUserRetakeRequests,
} from "@/data/queries";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Offering } from "@/data/types";

export function OfferingsDetailClient({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const {
    currentUser,
    courses,
    offerings,
    sections,
    terms,
    enrollmentRequests,
    createRetakeRequest,
  } = useRole();
  const { showToast } = useToast();

  const currentTerm = getCurrentTerm(terms);
  const course = courses.find((c) => c.id === courseId);
  const availableOfferings = getCourseOfferingsWithDetails(
    courseId,
    offerings,
    sections,
    currentTerm.id
  );
  const myRequests = getUserRetakeRequests(currentUser.id, enrollmentRequests);

  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-bold text-ink-900">Course Not Found</h2>
        <Link href="/offerings" className="mt-4">
          <Button variant="secondary" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const handleOpenRequestModal = (offering: Offering) => {
    setSelectedOffering(offering);
    setSubmitted(false);
    setNote("");
    setModalOpen(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffering) return;

    createRetakeRequest(selectedOffering.id);
    setSubmitted(true);
    showToast("Retake enrollment request sent to CR");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-ink-500">
        <Link
          href="/offerings"
          className="press flex items-center gap-1 font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Catalog
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-700">{course.code}</span>
      </div>

      {/* Banner */}
      <div className="rounded-xl border border-edge bg-surface p-6 shadow-card">
        <span className="rounded-md bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-700">
          {course.code}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
          {course.title}
        </h1>
        <p className="mt-1 text-xs text-ink-500">
          Select an available section below to request retake or improvement registration for {currentTerm.name}.
        </p>
      </div>

      {/* Sections offering this course */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-ink-900">
          Sections Offering This Course ({availableOfferings.length})
        </h2>

        {availableOfferings.length === 0 ? (
          <p className="py-8 text-center text-xs text-ink-400">
            No sections are offering this course in {currentTerm.name}.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {availableOfferings.map(({ offering, sectionName, facultyName }) => {
              const alreadyRequested = myRequests.some(
                (r) => r.offeringId === offering.id
              );
              const isHomeSection = offering.sectionId === currentUser.sectionId;

              return (
                <div
                  key={offering.id}
                  className="flex flex-col justify-between rounded-xl border border-edge bg-surface p-4 shadow-card"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-ink-900">
                        {sectionName}
                      </span>
                      {isHomeSection && (
                        <span className="rounded bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                          Your Section
                        </span>
                      )}
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-600">
                      <GraduationCap className="h-4 w-4 text-brand-700" />
                      Instructor: {facultyName}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-edge/60 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-ink-400">
                      {currentTerm.name}
                    </span>

                    {alreadyRequested ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning-600">
                        <Clock className="h-3.5 w-3.5" />
                        Request Pending
                      </span>
                    ) : isHomeSection ? (
                      <span className="text-xs font-semibold text-success-600">
                        Enrolled
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenRequestModal(offering)}
                      >
                        Request
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Request Course Retake"
        subtitle="Submit your retake enrollment to the section's Class Representatives."
      >
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-ink-900">
              Request Sent!
            </h3>
            <p className="mt-1 text-xs text-ink-600">
              A CR of that section will review your submission. Once approved, the course will appear in your Courses view.
            </p>
            <Button
              size="sm"
              className="mt-5"
              onClick={() => setModalOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-500">
                  Student Name
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={currentUser.name}
                  className="h-9 w-full rounded-md border border-edge bg-muted px-3 text-xs text-ink-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-500">
                  Student ID
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={currentUser.studentId || ""}
                  className="h-9 w-full rounded-md border border-edge bg-muted px-3 text-xs text-ink-700 tabular"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-500">
                  Course
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={`${course.code}: ${course.title}`}
                  className="h-9 w-full rounded-md border border-edge bg-muted px-3 text-xs text-ink-700 truncate"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-500">
                  Target Section
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    sections.find((s) => s.id === selectedOffering?.sectionId)
                      ? `CSE ${sections.find((s) => s.id === selectedOffering?.sectionId)?.name}`
                      : ""
                  }
                  className="h-9 w-full rounded-md border border-edge bg-muted px-3 text-xs text-ink-700"
                />
              </div>
            </div>

            <div>
              <label htmlFor="req-note" className="mb-1 block text-xs font-semibold text-ink-700">
                Optional Note to CR
              </label>
              <textarea
                id="req-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Cleared prerequisite in Spring 26"
                className="w-full rounded-md border border-edge bg-surface p-2.5 text-xs text-ink-900 focus-visible:outline-brand-500"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-edge pt-4">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="md">
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
