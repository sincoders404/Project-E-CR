"use client";

import { createContext, use, useState, ReactNode } from "react";
import {
  User,
  Batch,
  Section,
  Term,
  SectionTerm,
  Course,
  Offering,
  SectionCR,
  Enrollment,
  EnrollmentRequest,
  Post,
  Resource,
  ScheduleEntry,
  Notification,
} from "@/data/types";
import {
  mockBatches,
  mockSections,
  mockTerms,
  mockSectionTerms,
  mockCourses,
  mockOfferings,
  mockUsers,
  mockSectionCRs,
  mockEnrollments,
  mockEnrollmentRequests,
  mockPosts,
  mockResources,
  mockScheduleEntries,
  mockNotifications,
  TODAY,
} from "@/data/mock";

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

  // Mutations
  addPost: (data: Omit<Post, "id" | "createdAt">) => void;
  editPost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addResource: (data: Omit<Resource, "id" | "createdAt">) => void;
  editResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  createRetakeRequest: (offeringId: string) => void;
  approveRetakeRequest: (requestId: string) => void;
  rejectRetakeRequest: (requestId: string, reason?: string) => void;
  approveSignup: (userId: string) => void;
  rejectSignup: (userId: string) => void;
  addSignupRequest: (data: { name: string; email: string; studentId: string; sectionId: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateScheduleEntries: (newEntries: ScheduleEntry[]) => void;
  toggleCrCanApproveSignups: (sectionId: string) => void;
  addSectionCR: (sectionId: string, userId: string) => void;
  removeSectionCR: (sectionId: string, userId: string) => void;
  addStudentToSection: (sectionId: string, student: { name: string; studentId: string; email: string }) => void;
  removeStudentFromSection: (userId: string) => void;
  addBatch: (batch: Batch) => void;
  addSection: (section: Section) => void;
  addTerm: (term: Term) => void;
  addCourse: (course: Course) => void;
  addOffering: (offering: Offering) => void;
  addAdminUser: (admin: User) => void;
  removeAdminUser: (userId: string) => void;
};

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [personaRole, setPersonaRoleState] = useState<PersonaRole>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ecr_v3_role") as PersonaRole | null;
      if (saved && (saved === "Student" || saved === "CR" || saved === "Admin")) {
        return saved;
      }
    }
    return "CR";
  });

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [terms, setTerms] = useState<Term[]>(mockTerms);
  const [sectionTerms, setSectionTerms] = useState<SectionTerm[]>(mockSectionTerms);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [offerings, setOfferings] = useState<Offering[]>(mockOfferings);
  const [sectionCRs, setSectionCRs] = useState<SectionCR[]>(mockSectionCRs);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>(mockEnrollmentRequests);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>(mockScheduleEntries);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const setPersonaRole = (role: PersonaRole) => {
    setPersonaRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecr_v3_role", role);
    }
  };

  // Resolve current active persona
  const currentUser: User = (() => {
    if (personaRole === "Admin") {
      return users.find((u) => u.id === "usr-admin") || users[3];
    }
    if (personaRole === "CR") {
      return users.find((u) => u.id === "usr-cr") || users[1];
    }
    return users.find((u) => u.id === "usr-student") || users[0];
  })();

  const addPost = (data: Omit<Post, "id" | "createdAt">) => {
    const newPost: Post = {
      ...data,
      id: `post-${Date.now()}`,
      createdAt: `${TODAY}T12:00:00Z`,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const editPost = (id: string, updates: Partial<Post>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const addResource = (data: Omit<Resource, "id" | "createdAt">) => {
    const newRes: Resource = {
      ...data,
      id: `res-${Date.now()}`,
      createdAt: TODAY,
    };
    setResources((prev) => [newRes, ...prev]);
  };

  const editResource = (id: string, updates: Partial<Resource>) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const createRetakeRequest = (offeringId: string) => {
    const newReq: EnrollmentRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUser.id,
      offeringId,
      status: "pending",
      createdAt: TODAY,
    };
    setEnrollmentRequests((prev) => [newReq, ...prev]);
  };

  const approveRetakeRequest = (requestId: string) => {
    const req = enrollmentRequests.find((r) => r.id === requestId);
    if (!req) return;

    setEnrollmentRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "approved" as const } : r))
    );

    // Add enrollment row
    setEnrollments((prev) => {
      const exists = prev.some(
        (e) => e.studentId === req.studentId && e.offeringId === req.offeringId
      );
      if (exists) return prev;
      return [...prev, { studentId: req.studentId, offeringId: req.offeringId, type: "retake" }];
    });
  };

  const rejectRetakeRequest = (requestId: string, reason?: string) => {
    setEnrollmentRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "rejected" as const, rejectReason: reason }
          : r
      )
    );
  };

  const approveSignup = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
    );
  };

  const rejectSignup = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "rejected" as const } : u))
    );
  };

  const addSignupRequest = (data: {
    name: string;
    email: string;
    studentId: string;
    sectionId: string;
  }) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      studentId: data.studentId,
      role: "student",
      status: "pending",
      sectionId: data.sectionId,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: `${TODAY}T12:00:00Z` } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || `${TODAY}T12:00:00Z` }))
    );
  };

  const updateScheduleEntries = (newEntries: ScheduleEntry[]) => {
    setScheduleEntries(newEntries);
  };

  const toggleCrCanApproveSignups = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, crCanApproveSignups: !s.crCanApproveSignups } : s
      )
    );
  };

  const addSectionCR = (sectionId: string, userId: string) => {
    setSectionCRs((prev) => {
      const exists = prev.some((cr) => cr.sectionId === sectionId && cr.userId === userId);
      if (exists) return prev;
      return [...prev, { sectionId, userId }];
    });
  };

  const removeSectionCR = (sectionId: string, userId: string) => {
    setSectionCRs((prev) =>
      prev.filter((cr) => !(cr.sectionId === sectionId && cr.userId === userId))
    );
  };

  const addStudentToSection = (
    sectionId: string,
    student: { name: string; studentId: string; email: string }
  ) => {
    const newStudent: User = {
      id: `usr-${Date.now()}`,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      role: "student",
      status: "approved",
      sectionId,
    };
    setUsers((prev) => [...prev, newStudent]);
  };

  const removeStudentFromSection = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, sectionId: undefined } : u))
    );
  };

  const addBatch = (batch: Batch) => setBatches((prev) => [...prev, batch]);
  const addSection = (section: Section) => setSections((prev) => [...prev, section]);
  const addTerm = (term: Term) => setTerms((prev) => [...prev, term]);
  const addCourse = (course: Course) => setCourses((prev) => [...prev, course]);
  const addOffering = (offering: Offering) => setOfferings((prev) => [...prev, offering]);
  const addAdminUser = (admin: User) => setUsers((prev) => [...prev, admin]);
  const removeAdminUser = (userId: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== userId));

  const value = {
    personaRole,
    setPersonaRole,
    currentUser,
    users,
    batches,
    sections,
    terms,
    sectionTerms,
    courses,
    offerings,
    sectionCRs,
    enrollments,
    enrollmentRequests,
    posts,
    resources,
    scheduleEntries,
    notifications,
    addPost,
    editPost,
    deletePost,
    addResource,
    editResource,
    deleteResource,
    createRetakeRequest,
    approveRetakeRequest,
    rejectRetakeRequest,
    approveSignup,
    rejectSignup,
    addSignupRequest,
    markNotificationRead,
    markAllNotificationsRead,
    updateScheduleEntries,
    toggleCrCanApproveSignups,
    addSectionCR,
    removeSectionCR,
    addStudentToSection,
    removeStudentFromSection,
    addBatch,
    addSection,
    addTerm,
    addCourse,
    addOffering,
    addAdminUser,
    removeAdminUser,
  };

  return <RoleContext value={value}>{children}</RoleContext>;
}

export function useRole() {
  const ctx = use(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return ctx;
}
