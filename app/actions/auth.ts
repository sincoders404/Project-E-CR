"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthEmail } from "@/lib/auth-identifiers";

export type AuthActionState = { error?: string; success?: boolean };

export async function signIn(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const studentId = String(formData.get("student_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!studentId || !password) return { error: "Student ID and password are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: getAuthEmail(studentId),
    password,
  });
  return error ? { error: error.message } : { success: true };
}

export async function signUp(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const studentId = String(formData.get("student_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const sectionId = String(formData.get("section_id") ?? "").trim();

  if (!name || !studentId || !password || !sectionId) {
    return { error: "Name, student ID, password, and section are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: getAuthEmail(studentId),
    password,
    options: { data: { name, student_id: studentId, section_id: sectionId } },
  });
  return error ? { error: error.message } : { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
