"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { getClassmates, getSectionCRs } from "@/data/queries";
import { PersonRow } from "@/components/domain/PersonRow";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ClassmatesPage() {
  const { currentUser, users, sections, sectionCRs } = useRole();
  const [search, setSearch] = useState("");

  const userSectionId = currentUser.sectionId || "sec-33a";
  const userSection = sections.find((s) => s.id === userSectionId);
  const classmates = getClassmates(userSectionId, users);
  const sectionCRList = getSectionCRs(userSectionId, sectionCRs, users);

  const filteredClassmates = classmates.filter((st) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      st.name.toLowerCase().includes(q) ||
      st.studentId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Classmates
          </h1>
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
            CSE {userSection?.name || "33-A"}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Enrolled students officially registered in your home section.
        </p>
      </div>

      {/* Search box */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search by name or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-edge bg-surface pr-4 pl-9 text-xs text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500 shadow-xs"
        />
      </div>

      {/* Roster Grid */}
      {filteredClassmates.length === 0 ? (
        <div className="rounded-xl border border-edge bg-surface py-12">
          <EmptyState
            icon={<Search />}
            title="No classmates found"
            caption="No students matched your search criteria."
          />
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClassmates.map((st) => (
            <PersonRow
              key={st.id}
              name={st.name}
              studentId={st.studentId}
              badge={sectionCRList.some((cr) => cr.id === st.id) ? "CR" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
