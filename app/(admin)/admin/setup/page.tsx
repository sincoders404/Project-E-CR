"use client";

import { useState } from "react";
import { Plus, Sliders, CheckCircle } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Batch, Section, Term, Course, Offering } from "@/data/types";

export default function AdminSetupPage() {
  const {
    batches,
    sections,
    terms,
    courses,
    offerings,
    addBatch,
    addSection,
    addTerm,
    addCourse,
    addOffering,
  } = useRole();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("sections");

  // Modal states
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [offeringModalOpen, setOfferingModalOpen] = useState(false);

  // Form fields
  const [dept, setDept] = useState("CSE");
  const [batchNum, setBatchNum] = useState("");
  const [secBatchId, setSecBatchId] = useState(batches[0]?.id || "");
  const [secName, setSecName] = useState("");
  const [termName, setTermName] = useState("");
  const [crsCode, setCrsCode] = useState("");
  const [crsTitle, setCrsTitle] = useState("");
  const [offCrsId, setOffCrsId] = useState(courses[0]?.id || "");
  const [offSecId, setOffSecId] = useState(sections[0]?.id || "");
  const [offTermId, setOffTermId] = useState(terms[0]?.id || "");
  const [offFaculty, setOffFaculty] = useState("");

  const tabItems = [
    { id: "sections", label: "Batches & Sections", count: sections.length },
    { id: "terms", label: "Academic Terms", count: terms.length },
    { id: "courses", label: "Course Catalog", count: courses.length },
    { id: "offerings", label: "Term Offerings", count: offerings.length },
  ];

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNum) return;
    const newBatch: Batch = {
      id: `batch-${batchNum}`,
      department: dept.trim(),
      number: Number(batchNum),
    };
    addBatch(newBatch);
    showToast(`Added Batch ${dept} ${batchNum}`);
    setBatchModalOpen(false);
    setBatchNum("");
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName || !secBatchId) return;
    const newSection: Section = {
      id: `sec-${Date.now()}`,
      batchId: secBatchId,
      name: secName.trim(),
      crCanApproveSignups: false,
    };
    addSection(newSection);
    showToast(`Added Section ${secName}`);
    setSectionModalOpen(false);
    setSecName("");
  };

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName.trim()) return;
    const newTerm: Term = {
      id: `term-${Date.now()}`,
      name: termName.trim(),
      isCurrent: false,
    };
    addTerm(newTerm);
    showToast(`Added Term ${termName}`);
    setTermModalOpen(false);
    setTermName("");
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsCode.trim() || !crsTitle.trim()) return;
    const newCrs: Course = {
      id: `crs-${Date.now()}`,
      code: crsCode.trim(),
      title: crsTitle.trim(),
    };
    addCourse(newCrs);
    showToast(`Added course ${crsCode}`);
    setCourseModalOpen(false);
    setCrsCode("");
    setCrsTitle("");
  };

  const handleAddOffering = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offFaculty.trim()) return;
    const newOff: Offering = {
      id: `off-${Date.now()}`,
      courseId: offCrsId,
      sectionId: offSecId,
      termId: offTermId,
      facultyName: offFaculty.trim(),
    };
    addOffering(newOff);
    showToast("Added new course offering");
    setOfferingModalOpen(false);
    setOffFaculty("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          Academic Structure Setup
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Configure university departments, batches, sections, terms, and curriculum offerings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          label="Setup tabs"
          value={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </div>

      {/* ── TAB 1: BATCHES & SECTIONS ── */}
      {activeTab === "sections" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">
              Configured Batches & Sections
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => setBatchModalOpen(true)}>
                + New Batch
              </Button>
              <Button size="sm" onClick={() => setSectionModalOpen(true)}>
                + New Section
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
            <table className="w-full text-left text-xs text-ink-700">
              <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
                <tr>
                  <th className="px-4 py-3">Section Name</th>
                  <th className="px-4 py-3">Department & Batch</th>
                  <th className="px-4 py-3">CR Sign-up Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/60 font-medium">
                {sections.map((sec) => {
                  const b = batches.find((batch) => batch.id === sec.batchId);
                  return (
                    <tr key={sec.id} className="hover:bg-brand-50/20">
                      <td className="px-4 py-3 font-bold text-ink-900">
                        {b?.department} {sec.name}
                      </td>
                      <td className="px-4 py-3">
                        Batch {b?.number} ({b?.department})
                      </td>
                      <td className="px-4 py-3">
                        {sec.crCanApproveSignups ? (
                          <span className="text-success-600 font-bold">Enabled</span>
                        ) : (
                          <span className="text-ink-400">Disabled (Admin only)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: TERMS ── */}
      {activeTab === "terms" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Academic Terms</h2>
            <Button size="sm" onClick={() => setTermModalOpen(true)}>
              + New Term
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
            <table className="w-full text-left text-xs text-ink-700">
              <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
                <tr>
                  <th className="px-4 py-3">Term Name</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/60 font-medium">
                {terms.map((t) => (
                  <tr key={t.id} className="hover:bg-brand-50/20">
                    <td className="px-4 py-3 font-bold text-ink-900">{t.name}</td>
                    <td className="px-4 py-3">
                      {t.isCurrent ? (
                        <span className="inline-flex items-center gap-1 rounded bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                          <CheckCircle className="h-3 w-3" />
                          Current Active Term
                        </span>
                      ) : (
                        <span className="text-ink-400">Past Term</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: COURSES ── */}
      {activeTab === "courses" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">
              Department Course Catalog
            </h2>
            <Button size="sm" onClick={() => setCourseModalOpen(true)}>
              + Add Catalog Course
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
            <table className="w-full text-left text-xs text-ink-700">
              <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Course Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/60 font-medium">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-50/20">
                    <td className="px-4 py-3 font-bold text-brand-700">{c.code}</td>
                    <td className="px-4 py-3 text-ink-900 font-semibold">{c.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: OFFERINGS ── */}
      {activeTab === "offerings" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">
              Assigned Course Offerings
            </h2>
            <Button size="sm" onClick={() => setOfferingModalOpen(true)}>
              + Assign Course Offering
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
            <table className="w-full text-left text-xs text-ink-700">
              <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Faculty Instructor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/60 font-medium">
                {offerings.map((o) => {
                  const c = courses.find((crs) => crs.id === o.courseId);
                  const s = sections.find((sec) => sec.id === o.sectionId);
                  const t = terms.find((term) => term.id === o.termId);

                  return (
                    <tr key={o.id} className="hover:bg-brand-50/20">
                      <td className="px-4 py-3 font-bold text-ink-900">
                        {c?.code}: {c?.title}
                      </td>
                      <td className="px-4 py-3">CSE {s?.name}</td>
                      <td className="px-4 py-3">{t?.name}</td>
                      <td className="px-4 py-3 font-semibold text-brand-700">
                        {o.facultyName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals for Adding */}
      <Modal open={batchModalOpen} onClose={() => setBatchModalOpen(false)} title="Add Batch" maxWidth="sm">
        <form onSubmit={handleAddBatch} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Department</label>
            <input
              type="text"
              required
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Batch Number</label>
            <input
              type="number"
              required
              placeholder="e.g. 36"
              value={batchNum}
              onChange={(e) => setBatchNum(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => setBatchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">Add Batch</Button>
          </div>
        </form>
      </Modal>

      <Modal open={sectionModalOpen} onClose={() => setSectionModalOpen(false)} title="Add Section" maxWidth="sm">
        <form onSubmit={handleAddSection} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Batch</label>
            <select
              value={secBatchId}
              onChange={(e) => setSecBatchId(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.department} {b.number}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Section Name</label>
            <input
              type="text"
              required
              placeholder="e.g. 33-C"
              value={secName}
              onChange={(e) => setSecName(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => setSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">Add Section</Button>
          </div>
        </form>
      </Modal>

      <Modal open={termModalOpen} onClose={() => setTermModalOpen(false)} title="Add Academic Term" maxWidth="sm">
        <form onSubmit={handleAddTerm} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Term Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Spring 2027"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => setTermModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">Add Term</Button>
          </div>
        </form>
      </Modal>

      <Modal open={courseModalOpen} onClose={() => setCourseModalOpen(false)} title="Add Course Catalog" maxWidth="sm">
        <form onSubmit={handleAddCourse} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Course Code</label>
            <input
              type="text"
              required
              placeholder="e.g. CSE 480"
              value={crsCode}
              onChange={(e) => setCrsCode(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Cloud Computing Architecture"
              value={crsTitle}
              onChange={(e) => setCrsTitle(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => setCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">Save Course</Button>
          </div>
        </form>
      </Modal>

      <Modal open={offeringModalOpen} onClose={() => setOfferingModalOpen(false)} title="Assign Course Offering" maxWidth="sm">
        <form onSubmit={handleAddOffering} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Course</label>
            <select
              value={offCrsId}
              onChange={(e) => setOffCrsId(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code}: {c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Section</label>
            <select
              value={offSecId}
              onChange={(e) => setOffSecId(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>CSE {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Term</label>
            <select
              value={offTermId}
              onChange={(e) => setOffTermId(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            >
              {terms.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Faculty Instructor</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. K. M. Rahman"
              value={offFaculty}
              onChange={(e) => setOffFaculty(e.target.value)}
              className="h-10 w-full rounded border border-edge px-3 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => setOfferingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">Assign Offering</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
