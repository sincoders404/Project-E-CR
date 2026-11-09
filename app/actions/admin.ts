"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");
  const { data: profile, error } = await supabase
    .from("users").select("role, status").eq("id", user.id).single();
  if (error || profile.role !== "admin" || profile.status !== "approved") {
    throw new Error("Administrator access required");
  }
}

export async function createAdmin(name: string, email: string, password: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    app_metadata: { role: "admin", status: "approved" },
    user_metadata: { name },
  });
  if (error) throw new Error(error.message);
  const { error: inviteError } = await admin.auth.admin.generateLink({ type: "invite", email });
  if (inviteError) throw new Error(inviteError.message);
  return data.user;
}

export async function addStudent(name: string, studentId: string, email: string, sectionId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email, email_confirm: false,
    app_metadata: { status: "approved" },
    user_metadata: { name, student_id: studentId, section_id: sectionId },
  });
  if (error) throw new Error(error.message);
  return data.user;
}

export async function removeStudent(userId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin.from("users")
    .select("role").eq("id", userId).single();
  if (profileError) throw new Error(profileError.message);
  if (profile.role !== "student") throw new Error("Only students can be removed with this action");
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}

export async function removeAdmin(userId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { count, error: countError } = await admin.from("users")
    .select("id", { count: "exact", head: true }).eq("role", "admin").eq("status", "approved");
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) <= 1) throw new Error("The last administrator cannot be removed");
  const { data: profile, error: profileError } = await admin.from("users")
    .select("role").eq("id", userId).single();
  if (profileError) throw new Error(profileError.message);
  if (profile.role !== "admin") throw new Error("Target user is not an administrator");
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
}
