import { createClient } from "@/lib/supabase/server";
import type { Course, EnrollmentRequest, Notification, Offering, Post, Resource, ScheduleEntry, Term, User } from "./types";

type DbUser = Record<string, unknown>;

function mapUser(row: DbUser): User {
  return {
    id: String(row.id), name: String(row.name), email: String(row.email),
    studentId: row.student_id ? String(row.student_id) : undefined,
    role: row.role as User["role"], status: row.status as User["status"],
    sectionId: row.section_id ? String(row.section_id) : undefined,
    adminScope: row.admin_scope ? String(row.admin_scope) : null,
    phone: row.phone ? String(row.phone) : undefined,
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  if (!user) return null;
  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();
  if (error) throw new Error(error.message);
  const { count, error: crError } = await supabase.from("section_crs")
    .select("section_id", { count: "exact", head: true }).eq("user_id", user.id);
  if (crError) throw new Error(crError.message);
  return { user: mapUser(data as DbUser), isCr: (count ?? 0) > 0 };
}

export async function getMyOfferings(termId?: string) {
  const supabase = await createClient();
  let query = supabase.from("my_offerings")
    .select("*, courses(id,code,title), terms(id,name,is_current)");
  if (termId) query = query.eq("term_id", termId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPosts(options: { page?: number; size?: number; termId?: string; courseId?: string; type?: string } = {}) {
  const supabase = await createClient();
  const page = Math.max(1, options.page ?? 1);
  const size = Math.max(1, Math.min(100, options.size ?? 10));
  let query = supabase.from("posts").select("*, offerings(courses(id,code,title))", { count: "exact" })
    .order("pinned", { ascending: false }).order("created_at", { ascending: false })
    .range((page - 1) * size, page * size - 1);
  if (options.termId) query = query.eq("term_id", options.termId);
  if (options.type) query = query.eq("type", options.type);
  if (options.courseId) query = query.eq("offerings.course_id", options.courseId);
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { data: (data ?? []) as Post[], count: count ?? 0, page, size };
}

export async function getCourseData(offeringId: string) {
  const supabase = await createClient();
  const [posts, resources, offering] = await Promise.all([
    supabase.from("posts").select("*").eq("offering_id", offeringId).order("created_at", { ascending: false }),
    supabase.from("resources").select("*").eq("offering_id", offeringId).order("created_at", { ascending: false }),
    supabase.from("offerings").select("*, courses(*), sections(*)").eq("id", offeringId).single(),
  ]);
  for (const result of [posts, resources, offering]) if (result.error) throw new Error(result.error.message);
  return { posts: posts.data as Post[], resources: resources.data as Resource[], offering: offering.data };
}

export async function getRoutine(termId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("schedule_entries")
    .select("*, offerings(courses(id,code,title))").eq("term_id", termId)
    .order("day").order("start_time");
  if (error) throw new Error(error.message);
  return (data ?? []) as ScheduleEntry[];
}

export async function getClassmates() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("classmates").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMyCRs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("my_crs").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getNotifications() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Notification[];
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createEnrollmentRequest(offeringId: string, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");
  const { data, error } = await supabase.from("enrollment_requests")
    .insert({ student_id: user.id, offering_id: offeringId, note: note || null }).select().single();
  if (error) throw new Error(error.message);
  return data as EnrollmentRequest;
}

export async function decideEnrollmentRequest(id: string, approve: boolean, reason?: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_enrollment_request", { p_request: id, p_approve: approve, p_reason: reason ?? null });
  if (error) throw new Error(error.message);
}

export async function decideSignup(id: string, approve: boolean, reason?: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_signup", { p_user: id, p_approve: approve, p_reason: reason ?? null });
  if (error) throw new Error(error.message);
}

export async function getCatalog() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("courses").select("*, offerings(*, sections(*), terms(*))").order("code");
  if (error) throw new Error(error.message);
  return (data ?? []) as (Course & { offerings: Offering[] })[];
}

export async function getCurrentTerm(): Promise<Term | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("terms").select("*").eq("is_current", true).single();
  if (error) throw new Error(error.message);
  return data as Term;
}
