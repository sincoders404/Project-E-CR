import { createClient } from "@supabase/supabase-js";
import {
  mockBatches, mockSections, mockTerms, mockSectionTerms, mockCourses, mockOfferings,
  mockUsers, mockSectionCRs, mockEnrollments, mockEnrollmentRequests, mockPosts,
  mockResources, mockScheduleEntries,
} from "../data/mock";
import { getAuthEmail } from "../lib/auth-identifiers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.ECR_SEED_PASSWORD;
if (!url || !key || !password) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, and ECR_SEED_PASSWORD");
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function insert(table: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function main() {
  const batchIds = new Map<string, string>();
  const sectionIds = new Map<string, string>();
  const termIds = new Map<string, string>();
  const courseIds = new Map<string, string>();
  const offeringIds = new Map<string, string>();
  const userIds = new Map<string, string>();

  for (const batch of mockBatches) {
    const { data, error } = await supabase.from("batches").upsert(
      { department: batch.department, number: batch.number }, { onConflict: "department,number" }
    ).select("id").single();
    if (error) throw new Error(error.message);
    batchIds.set(batch.id, data.id);
  }
  for (const section of mockSections) {
    const { data, error } = await supabase.from("sections").upsert(
      { batch_id: batchIds.get(section.batchId), name: section.name, cr_can_approve_signups: section.crCanApproveSignups },
      { onConflict: "batch_id,name" }
    ).select("id").single();
    if (error) throw new Error(error.message);
    sectionIds.set(section.id, data.id);
  }
  for (const term of mockTerms) {
    const { data, error } = await supabase.from("terms").upsert(
      { name: term.name, is_current: term.isCurrent }, { onConflict: "name" }
    ).select("id").single();
    if (error) throw new Error(error.message);
    termIds.set(term.id, data.id);
  }
  await insert("section_terms", mockSectionTerms.map((row) => ({
    section_id: sectionIds.get(row.sectionId), term_id: termIds.get(row.termId), semester_no: row.semesterNo,
  })));
  for (const course of mockCourses) {
    const { data, error } = await supabase.from("courses").upsert(
      { code: course.code, title: course.title }, { onConflict: "code" }
    ).select("id").single();
    if (error) throw new Error(error.message);
    courseIds.set(course.id, data.id);
  }
  for (const offering of mockOfferings) {
    const { data, error } = await supabase.from("offerings").upsert({
      course_id: courseIds.get(offering.courseId), section_id: sectionIds.get(offering.sectionId),
      term_id: termIds.get(offering.termId), faculty_name: offering.facultyName,
    }, { onConflict: "course_id,section_id,term_id" }).select("id").single();
    if (error) throw new Error(error.message);
    offeringIds.set(offering.id, data.id);
  }

  for (const user of mockUsers) {
    const loginId = user.studentId ?? "admin-001";
    const authEmail = getAuthEmail(loginId);
    const { data: existing } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const match = existing.users.find((candidate) => candidate.email === authEmail);
    const authRole = user.role === "admin" ? "student" : user.role;
    const authSectionId = user.sectionId
      ? sectionIds.get(user.sectionId)
      : sectionIds.values().next().value;
    const result = match
      ? { data: { user: match }, error: null }
      : await supabase.auth.admin.createUser({
        email: authEmail, password, email_confirm: true,
        app_metadata: { role: authRole, status: user.status },
        user_metadata: {
          name: user.name,
          student_id: loginId,
          section_id: authSectionId,
        },
      });
    if (result.error || !result.data.user) {
      throw new Error(
        result.error
          ? `Unable to create ${user.id} (${user.name}): ${result.error.message} (${result.error.code ?? "unknown"})`
          : `Unable to create ${user.id} (${user.name})`,
      );
    }
    userIds.set(user.id, result.data.user.id);
    await supabase.from("users").update({
      name: user.name, email: authEmail, phone: null, student_id: loginId,
      section_id: user.sectionId ? sectionIds.get(user.sectionId) : null, role: user.role, status: user.status,
    }).eq("id", result.data.user.id);
  }
  await insert("section_crs", mockSectionCRs.map((row) => ({ user_id: userIds.get(row.userId), section_id: sectionIds.get(row.sectionId) })));
  await insert("enrollments", mockEnrollments.map((row) => ({ student_id: userIds.get(row.studentId), offering_id: offeringIds.get(row.offeringId), type: row.type })));
  await insert("posts", mockPosts.map((row) => ({
    id: crypto.randomUUID(), section_id: sectionIds.get(row.sectionId), offering_id: row.offeringId ? offeringIds.get(row.offeringId) : null,
    term_id: termIds.get(row.termId ?? "term-fall26"), type: row.type, kind: row.kind, title: row.title, body: row.body,
    due_at: row.dueAt ?? null, expires_on: row.expiresOn ?? null, pinned: row.pinned,
    author_id: userIds.get(row.authorId),
  })));
  await insert("resources", mockResources.map((row) => ({
    offering_id: offeringIds.get(row.offeringId), title: row.title, drive_url: row.driveUrl, author_id: userIds.get(row.authorId),
  })));
  await insert("schedule_entries", mockScheduleEntries.map((row) => ({
    section_id: sectionIds.get(row.sectionId), term_id: termIds.get(row.termId), day: row.day,
    start_time: row.startTime, end_time: row.endTime, offering_id: offeringIds.get(row.offeringId), room: row.room,
  })));
  await insert("enrollment_requests", mockEnrollmentRequests.map((row) => ({
    id: crypto.randomUUID(), student_id: userIds.get(row.studentId), offering_id: offeringIds.get(row.offeringId),
    status: row.status, reject_reason: row.rejectReason ?? null, created_at: row.createdAt,
  })));
  console.log("Seed complete.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
