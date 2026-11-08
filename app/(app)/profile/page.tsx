"use client";

import { useState } from "react";
import { KeyRound, Mail, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const { currentUser, sections, batches, terms, sectionTerms } = useRole();
  const { showToast } = useToast();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const section = sections.find((s) => s.id === currentUser.sectionId);
  const batch = batches.find((b) => b.id === section?.batchId);
  const currentTerm = terms.find((t) => t.isCurrent);
  const secTerm = sectionTerms.find(
    (st) => st.sectionId === section?.id && st.termId === currentTerm?.id
  );

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }
    setPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password updated successfully");
  };

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10">
      <div className="w-full max-w-[460px] rounded-xl border border-edge bg-surface p-6 sm:p-8 shadow-card">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-edge/60 pb-5">
          <Avatar size={56} initials={initials} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-bold text-ink-900">
                {currentUser.name}
              </h1>
              <Chip tone={isAdmin ? "purple" : "info"}>
                {isAdmin ? "Administrator" : "Student"}
              </Chip>
            </div>
            {currentUser.studentId && (
              <p className="mt-0.5 text-xs text-ink-500 tabular">
                Student ID: {currentUser.studentId}
              </p>
            )}
          </div>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-3 py-5 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-brand-50/50 p-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-ink-500">
              <Mail className="h-4 w-4 text-brand-700" />
              Email
            </span>
            <span className="text-xs font-medium text-ink-900 select-all">
              {currentUser.email}
            </span>
          </div>

          {!isAdmin && (
            <>
              <div className="flex items-center justify-between rounded-lg bg-brand-50/50 p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-ink-500">
                  <BookOpen className="h-4 w-4 text-brand-700" />
                  Section & Batch
                </span>
                <span className="text-xs font-bold text-ink-900">
                  {batch?.department} {section?.name || "33-A"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-brand-50/50 p-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-ink-500">
                  <GraduationCap className="h-4 w-4 text-brand-700" />
                  Academic Term
                </span>
                <span className="text-xs font-medium text-ink-900">
                  {currentTerm?.name} (Semester {secTerm?.semesterNo || 8})
                </span>
              </div>
            </>
          )}

          {isAdmin && (
            <div className="flex items-center justify-between rounded-lg bg-brand-50/50 p-3">
              <span className="flex items-center gap-2 text-xs font-semibold text-ink-500">
                <ShieldCheck className="h-4 w-4 text-brand-700" />
                Administrative Scope
              </span>
              <span className="text-xs font-bold text-ink-900">
                Full University Access
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="border-t border-edge/60 pt-4 text-right">
          <Button
            variant="soft"
            size="sm"
            onClick={() => setPasswordModalOpen(true)}
            className="gap-1.5"
          >
            <KeyRound className="h-3.5 w-3.5" />
            Change Password
          </Button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Password"
        subtitle="Set a new password for your account"
        maxWidth="sm"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="old-pass" className="mb-1 block text-xs font-semibold text-ink-700">
              Current Password
            </label>
            <input
              id="old-pass"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="new-pass" className="mb-1 block text-xs font-semibold text-ink-700">
              New Password
            </label>
            <input
              id="new-pass"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="confirm-pass" className="mb-1 block text-xs font-semibold text-ink-700">
              Confirm New Password
            </label>
            <input
              id="confirm-pass"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-edge pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="md">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
