"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";

export default function JoinPage() {
  const { classes, isJoinOpen, submitJoinRequest } = useRole();
  const { showToast } = useToast();

  // Find open semesters
  const openSemesters = Array.from(
    new Set(classes.filter((c) => c.joinOpen).map((c) => c.semester))
  );

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState(openSemesters[0] || "Spring 2026");
  const [classId, setClassId] = useState(classes[0]?.id || "cse-54-s2");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const availableClassesForSemester = classes.filter(
    (c) => c.semester === semester
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId || !email) return;

    submitJoinRequest({
      name,
      studentId,
      semester,
      classId,
      email,
      phone,
    });

    setSubmitted(true);
    showToast("Join request submitted to CR");
  };

  const isCurrentSemesterOpen = isJoinOpen(semester);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4 sm:p-6">
      <div className="w-full max-w-[560px] rounded-xl bg-surface p-6 sm:p-8 shadow-login border border-edge">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-edge pb-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white"
            >
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-ink-900">Join a Class</h1>
              <p className="text-xs text-ink-500">Fill this form once each semester</p>
            </div>
          </div>
          <Link
            href="/login"
            className="press flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink-900">
              Request Sent Successfully!
            </h2>
            <p className="mt-2 max-w-sm text-sm text-ink-600">
              Your class representative will review your submission and allocate your
              course roster for this semester.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/login">
                <Button size="md">Proceed to Login</Button>
              </Link>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setStudentId("");
                  setEmail("");
                  setPhone("");
                }}
              >
                Submit Another
              </Button>
            </div>
          </div>
        ) : !isCurrentSemesterOpen ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100 text-warning-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink-900">
              This form is closed for now.
            </h2>
            <p className="mt-1.5 max-w-sm text-xs text-ink-500">
              Join request submissions for {semester} have been paused by the
              administration or class representatives.
            </p>
            <Link href="/login" className="mt-5">
              <Button variant="secondary" size="sm">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="join-name"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  Full Name
                </label>
                <input
                  id="join-name"
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="join-id"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  Student ID
                </label>
                <input
                  id="join-id"
                  type="text"
                  required
                  placeholder="e.g. 21-12347"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="join-semester"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  Semester
                </label>
                <select
                  id="join-semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
                >
                  {openSemesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="join-class"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  Class Section
                </label>
                <select
                  id="join-class"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
                >
                  {availableClassesForSemester.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="join-email"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  University Email
                </label>
                <input
                  id="join-email"
                  type="email"
                  required
                  placeholder="name@cse.univ.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="join-phone"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  Phone Number
                </label>
                <input
                  id="join-phone"
                  type="tel"
                  placeholder="+880 1712-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <Button type="submit" size="lg" block className="mt-4">
              Submit Request
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

