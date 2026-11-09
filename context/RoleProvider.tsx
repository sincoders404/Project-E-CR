"use client";

import { createContext, use, useCallback, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  User, Batch, Section, Term, SectionTerm, Course, Offering, SectionCR,
  Enrollment, EnrollmentRequest, Post, Resource, ScheduleEntry, Notification,
} from "@/data/types";

export type PersonaRole = "Student" | "CR" | "Admin";

type RoleContextType = {
  personaRole: PersonaRole;
  setPersonaRole: (role: PersonaRole) => void;
  currentUser: User;
  users: User[];
  batches: Batch[];
  sections: Section[];
  terms: Term[];
  sectionTerms: SectionTerm[];
  courses: Course[];
  offerings: Offering[];
  sectionCRs: SectionCR[];
  enrollments: Enrollment[];
  enrollmentRequests: EnrollmentRequest[];
  posts: Post[];
  resources: Resource[];
  scheduleEntries: ScheduleEntry[];
  notifications: Notification[];
  addPost: (data: Omit<Post, "id" | "createdAt">) => Promise<void>;
  editPost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  addResource: (data: Omit<Resource, "id" | "createdAt">) => Promise<void>;
  editResource: (id: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  createRetakeRequest: (offeringId: string) => Promise<void>;
  approveRetakeRequest: (requestId: string) => Promise<void>;
  rejectRetakeRequest: (requestId: string, reason?: string) => Promise<void>;
  approveSignup: (userId: string) => Promise<void>;
  rejectSignup: (userId: string, reason?: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  updateScheduleEntries: (newEntries: ScheduleEntry[]) => Promise<void>;
  toggleCrCanApproveSignups: (sectionId: string) => Promise<void>;
  addSectionCR: (sectionId: string, userId: string) => Promise<void>;
  removeSectionCR: (sectionId: string, userId: string) => Promise<void>;
  addStudentToSection: (sectionId: string, student: { name: string; studentId: string; email: string }) => Promise<void>;
  removeStudentFromSection: (userId: string) => Promise<void>;
  addBatch: (batch: Batch) => Promise<void>;
  addSection: (section: Section) => Promise<void>;
  addTerm: (term: Term) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  addOffering: (offering: Offering) => Promise<void>;
  addAdminUser: (admin: User, password: string) => Promise<void>;
  removeAdminUser: (userId: string) => Promise<void>;
};

const RoleContext = createContext<RoleContextType | null>(null);
const emptyUser: User = { id: "", name: "", email: "", role: "student", status: "pending" };

function mapUser(row: Record<string, unknown>): User {
  return {
    id: String(row.id), name: String(row.name ?? ""), email: String(row.email ?? ""),
    studentId: row.student_id ? String(row.student_id) : undefined,
    role: row.role as User["role"], status: row.status as User["status"],
    sectionId: row.section_id ? String(row.section_id) : undefined,
    adminScope: row.admin_scope ? String(row.admin_scope) : null,
    phone: row.phone ? String(row.phone) : undefined,
  };
}

function mapBatch(row: Record<string, unknown>): Batch {
  return { id: String(row.id), department: String(row.department), number: Number(row.number) };
}

function mapSection(row: Record<string, unknown>): Section {
  return {
    id: String(row.id), batchId: String(row.batch_id), name: String(row.name),
    crCanApproveSignups: Boolean(row.cr_can_approve_signups),
  };
}

function mapPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id), sectionId: String(row.section_id), offeringId: row.offering_id ? String(row.offering_id) : undefined,
    termId: row.term_id ? String(row.term_id) : undefined, type: row.type as Post["type"],
    kind: row.kind as Post["kind"], title: String(row.title), body: String(row.body ?? ""),
    dueAt: row.due_at ? String(row.due_at) : undefined, expiresOn: row.expires_on ? String(row.expires_on) : undefined,
    pinned: Boolean(row.pinned), authorId: row.author_id ? String(row.author_id) : "",
    authorName: row.author_name ? String(row.author_name) : undefined, createdAt: String(row.created_at),
  };
}

function mapResource(row: Record<string, unknown>): Resource {
  return {
    id: String(row.id), offeringId: String(row.offering_id), title: String(row.title),
    driveUrl: String(row.drive_url), authorId: row.author_id ? String(row.author_id) : "",
    authorName: row.author_name ? String(row.author_name) : undefined, createdAt: String(row.created_at),
  };
}

function mapSchedule(row: Record<string, unknown>): ScheduleEntry {
  return {
    id: String(row.id), sectionId: String(row.section_id), termId: String(row.term_id),
    day: Number(row.day), startTime: String(row.start_time), endTime: String(row.end_time),
    offeringId: String(row.offering_id), room: String(row.room ?? ""),
  };
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [personaRole, setPersonaRoleState] = useState<PersonaRole>("Student");
  const [currentUser, setCurrentUser] = useState<User>(emptyUser);
  const [users, setUsers] = useState<User[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [sectionTerms, setSectionTerms] = useState<SectionTerm[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [sectionCRs, setSectionCRs] = useState<SectionCR[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const setPersonaRole = useCallback((role: PersonaRole) => {
    setPersonaRoleState(role);
    if (typeof window !== "undefined") localStorage.setItem("ecr_v3_role", role);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadError(null);
      const supabase = createClient();
      const [publicBatches, publicSections] = await Promise.all([
        supabase.from("batches").select("*").order("number"),
        supabase.from("sections").select("*").order("name"),
      ]);
      if (publicBatches.error) throw new Error(publicBatches.error.message);
      if (publicSections.error) throw new Error(publicSections.error.message);
      setBatches((publicBatches.data ?? []).map((row) => mapBatch(row as Record<string, unknown>)));
      setSections((publicSections.data ?? []).map((row) => mapSection(row as Record<string, unknown>)));

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setReady(true);
        return;
      }

      const [profile, allUsers, batchRows, sectionRows, termRows, sectionTermRows, courseRows,
        offeringRows, crRows, enrollmentRows, requestRows, postRows, resourceRows, scheduleRows, notificationRows] =
        await Promise.all([
          supabase.from("users").select("*").eq("id", authUser.id).single(),
          supabase.from("users").select("*"),
          supabase.from("batches").select("*").order("number"),
          supabase.from("sections").select("*").order("name"),
          supabase.from("terms").select("*").order("name", { ascending: false }),
          supabase.from("section_terms").select("*"),
          supabase.from("courses").select("*").order("code"),
          supabase.from("offerings").select("*"),
          supabase.from("section_crs").select("*"),
          supabase.from("enrollments").select("*"),
          supabase.from("enrollment_requests").select("*").order("created_at", { ascending: false }),
          supabase.from("posts").select("*").order("created_at", { ascending: false }),
          supabase.from("resources").select("*").order("created_at", { ascending: false }),
          supabase.from("schedule_entries").select("*"),
          supabase.from("notifications").select("*").order("created_at", { ascending: false }),
        ]);
      const result = [profile, allUsers, batchRows, sectionRows, termRows, sectionTermRows, courseRows,
        offeringRows, crRows, enrollmentRows, requestRows, postRows, resourceRows, scheduleRows, notificationRows];
      const failed = result.find((item) => item.error);
      if (failed?.error) throw new Error(failed.error.message);

      setCurrentUser(mapUser(profile.data as Record<string, unknown>));
      setUsers((allUsers.data ?? []).map((row) => mapUser(row as Record<string, unknown>)));
      setBatches((batchRows.data ?? []).map((row) => mapBatch(row as Record<string, unknown>)));
      setSections((sectionRows.data ?? []).map((row) => mapSection(row as Record<string, unknown>)));
      setTerms((termRows.data ?? []).map((row) => ({
        id: String(row.id), name: String(row.name), isCurrent: Boolean(row.is_current),
      })));
      setSectionTerms((sectionTermRows.data ?? []).map((row) => ({
        sectionId: String(row.section_id), termId: String(row.term_id), semesterNo: Number(row.semester_no),
      })));
      setCourses((courseRows.data ?? []).map((row) => ({
        id: String(row.id), code: String(row.code), title: String(row.title),
      })));
      setOfferings((offeringRows.data ?? []).map((row) => ({
        id: String(row.id), courseId: String(row.course_id), sectionId: String(row.section_id),
        termId: String(row.term_id), facultyName: String(row.faculty_name),
      })));
      setSectionCRs((crRows.data ?? []).map((row) => ({ userId: String(row.user_id), sectionId: String(row.section_id) })));
      setEnrollments((enrollmentRows.data ?? []).map((row) => ({
        studentId: String(row.student_id), offeringId: String(row.offering_id), type: row.type as Enrollment["type"],
      })));
      setEnrollmentRequests((requestRows.data ?? []).map((row) => ({
        id: String(row.id), studentId: String(row.student_id), offeringId: String(row.offering_id),
        note: row.note ? String(row.note) : undefined, status: row.status as EnrollmentRequest["status"],
        rejectReason: row.reject_reason ? String(row.reject_reason) : undefined, createdAt: String(row.created_at),
      })));
      setPosts((postRows.data ?? []).map((row) => mapPost(row as Record<string, unknown>)));
      setResources((resourceRows.data ?? []).map((row) => mapResource(row as Record<string, unknown>)));
      setScheduleEntries((scheduleRows.data ?? []).map((row) => mapSchedule(row as Record<string, unknown>)));
      setNotifications((notificationRows.data ?? []).map((row) => ({
        id: String(row.id), userId: String(row.user_id), type: row.type as Notification["type"],
        refId: String(row.ref_id), title: String(row.title ?? ""), message: String(row.message ?? ""),
        createdAt: String(row.created_at), readAt: row.read_at ? String(row.read_at) : undefined,
      })));
      setPersonaRole(profile.data.role === "admin" ? "Admin" : "Student");
      setReady(true);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load portal data.");
      setReady(true);
    }
  }, [setPersonaRole]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadData();
    }, 0);
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      void loadData();
    });
    return () => {
      window.clearTimeout(initialLoad);
      listener.subscription.unsubscribe();
    };
  }, [loadData]);

  const mutate = useCallback(async (operation: () => Promise<{ error: { message: string } | null }>) => {
    const { error } = await operation();
    if (error) throw new Error(error.message);
    await loadData();
  }, [loadData]);

  const addPost = (data: Omit<Post, "id" | "createdAt">) => mutate(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return supabase.from("posts").insert({
      section_id: data.sectionId, offering_id: data.offeringId ?? null, type: data.type, kind: data.kind,
      title: data.title, body: data.body, due_at: data.dueAt ?? null, expires_on: data.expiresOn ?? null,
      pinned: data.pinned, author_id: user?.id,
    });
  });
  const editPost = (id: string, updates: Partial<Post>) => mutate(async () => createClient().from("posts").update({
    title: updates.title, body: updates.body, type: updates.type, kind: updates.kind,
    due_at: updates.dueAt, expires_on: updates.expiresOn, pinned: updates.pinned,
  }).eq("id", id));
  const deletePost = (id: string) => mutate(async () => createClient().from("posts").delete().eq("id", id));
  const addResource = (data: Omit<Resource, "id" | "createdAt">) => mutate(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return supabase.from("resources").insert({
      offering_id: data.offeringId, title: data.title, drive_url: data.driveUrl, author_id: user?.id,
    });
  });
  const editResource = (id: string, updates: Partial<Resource>) => mutate(async () => createClient().from("resources").update({
    title: updates.title, drive_url: updates.driveUrl,
  }).eq("id", id));
  const deleteResource = (id: string) => mutate(async () => createClient().from("resources").delete().eq("id", id));
  const createRetakeRequest = (offeringId: string) => mutate(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return supabase.from("enrollment_requests").insert({ student_id: user?.id, offering_id: offeringId, status: "pending" });
  });
  const decideRequest = (requestId: string, approve: boolean, reason?: string) => mutate(async () =>
    createClient().rpc("decide_enrollment_request", { p_request: requestId, p_approve: approve, p_reason: reason ?? null }));
  const approveRetakeRequest = (id: string) => decideRequest(id, true);
  const rejectRetakeRequest = (id: string, reason?: string) => decideRequest(id, false, reason);
  const decideSignup = (id: string, approve: boolean, reason?: string) => mutate(async () =>
    createClient().rpc("decide_signup", { p_user: id, p_approve: approve, p_reason: reason ?? null }));
  const approveSignup = (id: string) => decideSignup(id, true);
  const rejectSignup = (id: string, reason?: string) => decideSignup(id, false, reason);
  const markNotificationRead = (id: string) => mutate(async () =>
    createClient().from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id));
  const markAllNotificationsRead = () => mutate(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user?.id).is("read_at", null);
  });
  const updateScheduleEntries = (entries: ScheduleEntry[]) => mutate(async () => {
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("schedule_entries").delete().eq("section_id", entries[0]?.sectionId ?? "");
    if (deleteError) return { error: deleteError };
    return supabase.from("schedule_entries").insert(entries.map((entry) => ({
      id: entry.id, section_id: entry.sectionId, term_id: entry.termId, day: entry.day,
      start_time: entry.startTime, end_time: entry.endTime, offering_id: entry.offeringId, room: entry.room,
    })));
  });
  const toggleCrCanApproveSignups = (id: string) => mutate(async () => {
    const section = sections.find((item) => item.id === id);
    return createClient().from("sections").update({ cr_can_approve_signups: !section?.crCanApproveSignups }).eq("id", id);
  });
  const addSectionCR = (sectionId: string, userId: string) => mutate(async () => createClient().from("section_crs").insert({ section_id: sectionId, user_id: userId }));
  const removeSectionCR = (sectionId: string, userId: string) => mutate(async () => createClient().from("section_crs").delete().eq("section_id", sectionId).eq("user_id", userId));
  const addStudentToSection = async (sectionId: string, student: { name: string; studentId: string; email: string }) => {
    const { addStudent } = await import("@/app/actions/admin");
    await addStudent(student.name, student.studentId, student.email, sectionId);
    await loadData();
  };
  const removeStudentFromSection = async (userId: string) => {
    const { removeStudent } = await import("@/app/actions/admin");
    await removeStudent(userId);
    await loadData();
  };
  const addBatch = (batch: Batch) => mutate(async () => createClient().from("batches").insert({ department: batch.department, number: batch.number }));
  const addSection = (section: Section) => mutate(async () => createClient().from("sections").insert({ batch_id: section.batchId, name: section.name, cr_can_approve_signups: section.crCanApproveSignups }));
  const addTerm = (term: Term) => mutate(async () => createClient().from("terms").insert({ name: term.name, is_current: term.isCurrent }));
  const addCourse = (course: Course) => mutate(async () => createClient().from("courses").insert({ code: course.code, title: course.title }));
  const addOffering = (offering: Offering) => mutate(async () => createClient().from("offerings").insert({
    course_id: offering.courseId, section_id: offering.sectionId, term_id: offering.termId, faculty_name: offering.facultyName,
  }));
  const addAdminUser = async (admin: User, password: string) => {
    const { createAdmin } = await import("@/app/actions/admin");
    await createAdmin(admin.name, admin.email, password);
    await loadData();
  };
  const removeAdminUser = async (userId: string) => {
    const { removeAdmin } = await import("@/app/actions/admin");
    await removeAdmin(userId);
    await loadData();
  };

  const value = {
    personaRole, setPersonaRole, currentUser, users, batches, sections, terms, sectionTerms, courses,
    offerings, sectionCRs, enrollments, enrollmentRequests, posts, resources, scheduleEntries, notifications,
    addPost, editPost, deletePost, addResource, editResource, deleteResource, createRetakeRequest,
    approveRetakeRequest, rejectRetakeRequest, approveSignup, rejectSignup,
    markNotificationRead, markAllNotificationsRead, updateScheduleEntries, toggleCrCanApproveSignups,
    addSectionCR, removeSectionCR, addStudentToSection, removeStudentFromSection, addBatch, addSection,
    addTerm, addCourse, addOffering, addAdminUser, removeAdminUser,
  };

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-500">Loading portal...</div>;
  }
  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6 text-center">
        <div className="max-w-lg rounded-xl border border-edge bg-surface p-8 shadow-card">
          <h1 className="text-lg font-bold text-ink-900">Portal setup required</h1>
          <p className="mt-2 text-sm text-ink-600">
            Supabase data could not be loaded. Apply the migrations in <code>supabase/migrations</code> and refresh.
          </p>
          <p className="mt-3 break-words text-xs text-danger-600">{loadError}</p>
        </div>
      </div>
    );
  }
  return <RoleContext value={value}>{children}</RoleContext>;
}

export function useRole() {
  const context = use(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}
