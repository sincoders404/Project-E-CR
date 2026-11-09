"use client";

import { useState } from "react";
import { ShieldCheck, Plus, Trash2 } from "lucide-react";
import { useRole } from "@/context/RoleProvider";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { User } from "@/data/types";

export default function AdminUsersPage() {
  const { users, addAdminUser, removeAdminUser } = useRole();
  const { showToast } = useToast();

  const adminUsers = users.filter((u) => u.role === "admin");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetAdmin, setTargetAdmin] = useState<User | null>(null);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || adminPassword.length < 8) return;

    const newAdmin: User = {
      id: `usr-admin-${Date.now()}`,
      name: adminName.trim(),
      email: adminEmail.trim(),
      role: "admin",
      status: "approved",
      adminScope: null,
    };

    await addAdminUser(newAdmin, adminPassword);
    showToast(`Added administrator ${adminName}`);
    setAddModalOpen(false);
    setAdminName("");
    setAdminEmail("");
    setAdminPassword("");
  };

  const handleConfirmRemove = () => {
    if (targetAdmin) {
      removeAdminUser(targetAdmin.id);
      showToast(`Removed administrator ${targetAdmin.name}`);
      setTargetAdmin(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            System Administrators
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage administrative personnel with full department access and coordination privileges.
          </p>
        </div>

        <div>
          <label htmlFor="adm-password" className="mb-1 block text-xs font-semibold text-ink-700">
            Temporary Password
          </label>
          <input
            id="adm-password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        <Button size="md" onClick={() => setAddModalOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Admins Table */}
      <div className="overflow-x-auto rounded-xl border border-edge bg-surface shadow-card">
        <table className="w-full text-left text-xs text-ink-700">
          <thead className="bg-brand-50/60 text-[11px] font-bold text-ink-500 uppercase tracking-wider border-b border-edge">
            <tr>
              <th className="px-4 py-3">Administrator</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Administrative Scope</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60 font-medium">
            {adminUsers.map((admin) => (
              <tr key={admin.id} className="hover:bg-brand-50/20 transition-colors">
                <td className="px-4 py-3 font-bold text-ink-900 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  {admin.name}
                </td>
                <td className="px-4 py-3 select-all">{admin.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                    All (Full Department)
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetAdmin(admin);
                      setConfirmModalOpen(true);
                    }}
                    className="press rounded p-1 text-ink-400 hover:bg-danger-100 hover:text-danger-600"
                    title="Remove administrator"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-ink-400">
        Batch scopes are coming later. Currently all administrators have global access.
      </p>

      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Administrator"
        subtitle="Grant full portal administration access to a faculty member or coordinator."
        maxWidth="sm"
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label htmlFor="adm-name" className="mb-1 block text-xs font-semibold text-ink-700">
              Full Name
            </label>
            <input
              id="adm-name"
              type="text"
              required
              placeholder="e.g. Dr. K. M. Rahman"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="adm-email" className="mb-1 block text-xs font-semibold text-ink-700">
              University Email
            </label>
            <input
              id="adm-email"
              type="email"
              required
              placeholder="e.g. km.rahman@cse.univ.edu"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-edge bg-brand-50/50 px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-edge pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="md">
              Add Administrator
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Remove Modal */}
      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Administrator"
        message={`Are you sure you want to revoke administrative permissions from ${targetAdmin?.name}?`}
        confirmLabel="Remove"
      />
    </div>
  );
}
