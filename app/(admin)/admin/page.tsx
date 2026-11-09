"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, GraduationCap, Users, ShieldCheck, UserPlus, CheckCircle, ArrowRight } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { getCurrentTerm, getPendingSignups } from "@/data/queries";

export default function AdminDashboardPage() {
  const {
    currentUser,
    sections,
    batches,
    terms,
    sectionTerms,
    sectionCRs,
    users,
  } = useRole();

  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentTerm = getCurrentTerm(terms);
  const pendingSignups = getPendingSignups(currentUser, sectionCRs, sections, users);

  // Calculate metrics
  const totalSections = sections.length;
  const allCRs = new Set(sectionCRs.map((cr) => cr.userId));
  const totalCRs = allCRs.size;
  const allStudents = users.filter((u) => u.role === "student" && u.status === "approved");
  const totalStudents = allStudents.length;

  // Filter sections
  const filteredSections = sections.filter((sec) => {
    if (selectedBatchId !== "all" && sec.batchId !== selectedBatchId) {
      return false;
    }
    const batch = batches.find((b) => b.id === sec.batchId);
    const fullName = `${batch?.department} ${sec.name}`.toLowerCase();
    if (searchQuery.trim() && !fullName.includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            All Sections & Department Coordination
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Administrative overview of class batches, appointed representatives, and student rosters.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-3.5 py-1.5 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-brand-700" />
          <span className="text-xs font-bold text-brand-700">
            Administrator Console
          </span>
        </div>
      </div>

      {/* 4 Metric Numbers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Link href="/admin/signups" className="press">
          <Card className="flex items-center gap-3.5 p-4 hover:border-brand-500 transition-colors">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-100 text-warning-600 font-bold">
              <UserPlus className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
                Pending Sign-ups
              </p>
              <p className="text-2xl font-extrabold text-ink-900 tabular">
                {pendingSignups.length}
              </p>
            </div>
          </Card>
        </Link>

        <Card className="flex items-center gap-3.5 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 font-bold">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
              Sections
            </p>
            <p className="text-2xl font-extrabold text-ink-900 tabular">
              {totalSections}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-violet-accent font-bold">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
              Active CRs
            </p>
            <p className="text-2xl font-extrabold text-ink-900 tabular">
              {totalCRs}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-100 text-success-600 font-bold">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
              Students
            </p>
            <p className="text-2xl font-extrabold text-ink-900 tabular">
              {totalStudents}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge bg-surface p-4 shadow-card">
        <div className="flex items-center gap-2">
          <label htmlFor="admin-batch" className="text-xs font-semibold text-ink-500">
            Batch:
          </label>
          <select
            id="admin-batch"
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="h-9 rounded-md border border-edge bg-brand-50/50 px-3 text-xs font-semibold text-ink-700 focus-visible:outline-brand-500"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.department} {b.number}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            placeholder="Search section name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-edge bg-brand-50/50 pr-3 pl-9 text-xs text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Sections Table */}
      <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
        <table className="w-full text-left text-xs text-ink-700">
          <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
            <tr>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Term & Semester</th>
              <th className="px-4 py-3">Class Representatives</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">CR Approval Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60 font-medium">
            {filteredSections.map((sec) => {
              const batch = batches.find((b) => b.id === sec.batchId);
              const secTerm = sectionTerms.find(
                (st) => st.sectionId === sec.id && st.termId === currentTerm.id
              );
              const crList = sectionCRs
                .filter((cr) => cr.sectionId === sec.id)
                .map((cr) => users.find((u) => u.id === cr.userId)?.name)
                .filter(Boolean);
              const studentCount = users.filter(
                (u) => u.sectionId === sec.id && u.role === "student" && u.status === "approved"
              ).length;

              return (
                <tr key={sec.id} className="hover:bg-brand-50/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-ink-900">
                    <Link
                      href={`/admin/sections/${sec.id}`}
                      className="hover:text-brand-700 hover:underline"
                    >
                      {batch?.department} {sec.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {currentTerm.name} (Sem {secTerm?.semesterNo || 4})
                  </td>
                  <td className="px-4 py-3">
                    {crList.length > 0 ? (
                      <span className="font-semibold text-brand-700">
                        {crList.join(", ")}
                      </span>
                    ) : (
                      <span className="text-ink-400 italic">None appointed</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular">
                    <strong>{studentCount}</strong> enrolled
                  </td>
                  <td className="px-4 py-3">
                    {sec.crCanApproveSignups ? (
                      <span className="inline-flex items-center gap-1 rounded bg-success-100 px-2 py-0.5 text-[10px] font-bold text-success-600">
                        <CheckCircle className="h-3 w-3" />
                        CRs can approve
                      </span>
                    ) : (
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-ink-400">
                        Admin only
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/sections/${sec.id}`}
                      className="press inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline"
                    >
                      Manage
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
