"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, Clock, MapPin } from "lucide-react";
import { ScheduleEntry, Offering, Course } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type ScheduleTableProps = {
  entries: ScheduleEntry[];
  offerings: Offering[];
  courses: Course[];
  canEdit: boolean;
  onSave?: (newEntries: ScheduleEntry[]) => void;
};

export function ScheduleTable({
  entries,
  offerings,
  courses,
  canEdit,
  onSave,
}: ScheduleTableProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [localEntries, setLocalEntries] = useState<ScheduleEntry[]>(entries);

  const getCourseInfo = (offeringId: string) => {
    const off = offerings.find((o) => o.id === offeringId);
    if (!off) return { code: "Unknown", title: "Course", faculty: "" };
    const crs = courses.find((c) => c.id === off.courseId);
    return {
      code: crs?.code || "Course",
      title: crs?.title || "Class",
      faculty: off.facultyName,
    };
  };

  const handleAddRow = () => {
    const newRow: ScheduleEntry = {
      id: `sch-${Date.now()}`,
      sectionId: entries[0]?.sectionId || "",
      termId: entries[0]?.termId || "",
      day: 1,
      startTime: "09:00",
      endTime: "10:20",
      offeringId: offerings[0]?.id || "",
      room: "Room 402B",
    };
    setLocalEntries([...localEntries, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setLocalEntries(localEntries.filter((e) => e.id !== id));
  };

  const handleFieldChange = (
    id: string,
    field: keyof ScheduleEntry,
    value: string | number
  ) => {
    setLocalEntries(
      localEntries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave(localEntries);
    }
    showToast("Class routine updated successfully");
  };

  const sortedEntries = [...(isEditing ? localEntries : entries)].sort((a, b) =>
    a.day !== b.day ? a.day - b.day : a.startTime.localeCompare(b.startTime)
  );

  return (
    <div className="flex flex-col gap-3">
      {canEdit && (
        <div className="flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="soft" onClick={handleAddRow} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add Row
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-1">
                <Check className="h-3.5 w-3.5" />
                Save Routine
              </Button>
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)} className="gap-1">
              <Edit2 className="h-3.5 w-3.5" />
              Edit Routine
            </Button>
          )}
        </div>
      )}

      {/* Routine Table Card */}
      <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
        <table className="w-full text-left text-xs text-ink-700">
          <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Course & Faculty</th>
              <th className="px-4 py-3">Room</th>
              {isEditing && <th className="px-4 py-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60 font-medium">
            {sortedEntries.map((entry) => {
              const info = getCourseInfo(entry.offeringId);
              return (
                <tr key={entry.id} className="hover:bg-brand-50/20 transition-colors">
                  {/* Day */}
                  <td className="px-4 py-3 font-semibold text-ink-900">
                    {isEditing ? (
                      <select
                        value={entry.day}
                        onChange={(e) => handleFieldChange(entry.id, "day", Number(e.target.value))}
                        className="h-8 rounded border border-edge bg-surface px-2 text-xs"
                      >
                        {DAYS.map((d, idx) => (
                          <option key={d} value={idx}>
                            {d}
                          </option>
                        ))}
                      </select>
                    ) : (
                      DAYS[entry.day]
                    )}
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 tabular">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={entry.startTime}
                          onChange={(e) => handleFieldChange(entry.id, "startTime", e.target.value)}
                          className="h-8 w-16 rounded border border-edge px-1.5 text-xs text-center"
                        />
                        <span>–</span>
                        <input
                          type="text"
                          value={entry.endTime}
                          onChange={(e) => handleFieldChange(entry.id, "endTime", e.target.value)}
                          className="h-8 w-16 rounded border border-edge px-1.5 text-xs text-center"
                        />
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-brand-700">
                        <Clock className="h-3 w-3 text-ink-400" />
                        {entry.startTime} – {entry.endTime}
                      </span>
                    )}
                  </td>

                  {/* Course & Faculty */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={entry.offeringId}
                        onChange={(e) => handleFieldChange(entry.id, "offeringId", e.target.value)}
                        className="h-8 rounded border border-edge bg-surface px-2 text-xs"
                      >
                        {offerings.map((o) => {
                          const crs = courses.find((c) => c.id === o.courseId);
                          return (
                            <option key={o.id} value={o.id}>
                              {crs?.code} — {crs?.title}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <div>
                        <span className="font-bold text-ink-900">
                          {info.code}: {info.title}
                        </span>
                        <span className="block text-[11px] text-ink-400">{info.faculty}</span>
                      </div>
                    )}
                  </td>

                  {/* Room */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={entry.room}
                        onChange={(e) => handleFieldChange(entry.id, "room", e.target.value)}
                        className="h-8 w-24 rounded border border-edge px-2 text-xs"
                      />
                    ) : (
                      <span className="flex items-center gap-1 text-ink-700 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-ink-400" />
                        {entry.room}
                      </span>
                    )}
                  </td>

                  {/* Edit Actions */}
                  {isEditing && (
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(entry.id)}
                        className="press text-danger-600 hover:bg-danger-100 rounded p-1"
                        title="Remove routine row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
