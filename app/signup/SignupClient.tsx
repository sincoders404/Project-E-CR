"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { getAuthEmail } from "@/lib/auth-identifiers";

export default function SignupPage() {
  const { batches, sections } = useRole();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || "");
  const availableSections = sections.filter((s) => s.batchId === selectedBatchId);
  const [selectedSectionId, setSelectedSectionId] = useState(
    availableSections[0]?.id || ""
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId || !selectedSectionId) return;

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: getAuthEmail(studentId),
      password,
      options: {
        data: {
          name: name.trim(),
          student_id: studentId.trim(),
          section_id: selectedSectionId,
        },
      },
    });
    if (error) {
      showToast(error.message);
      return;
    }

    setSubmitted(true);
    showToast("Sign-up request submitted");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4 sm:p-6">
      <div className="w-full max-w-[500px] rounded-xl bg-surface p-6 sm:p-8 shadow-login border border-edge">
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
              <h1 className="text-xl font-bold text-ink-900">Student Sign Up</h1>
              <p className="text-xs text-ink-500">Register for your university section</p>
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
              Request Sent!
            </h2>
            <p className="mt-2 max-w-sm text-sm text-ink-600">
              Your sign-up request has been sent. An administrator or class representative will approve you soon.
            </p>
            <Link href="/login" className="mt-6">
              <Button size="md">Return to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="reg-name" className="mb-1 block text-xs font-semibold text-ink-700">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                placeholder="e.g. Rafi Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div>
                <label htmlFor="reg-id" className="mb-1 block text-xs font-semibold text-ink-700">
                  Student ID
                </label>
                <input
                  id="reg-id"
                  type="text"
                  required
                  placeholder="e.g. CSE03308387"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
                />
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1 block text-xs font-semibold text-ink-700">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-batch" className="mb-1 block text-xs font-semibold text-ink-700">
                  Batch
                </label>
                <select
                  id="reg-batch"
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    const secs = sections.filter((s) => s.batchId === e.target.value);
                    if (secs[0]) setSelectedSectionId(secs[0].id);
                  }}
                  className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.department} {b.number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reg-section" className="mb-1 block text-xs font-semibold text-ink-700">
                  Section
                </label>
                <select
                  id="reg-section"
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="h-10 w-full rounded-md border border-edge bg-surface px-3 text-sm text-ink-900 focus-visible:outline-brand-500"
                >
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" size="lg" block className="mt-4">
              Submit Sign Up Request
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
