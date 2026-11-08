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
} from "./types";

export const TODAY = "2026-11-09";

export const mockBatches: Batch[] = [
  { id: "batch-33", department: "CSE", number: 33 },
  { id: "batch-35", department: "CSE", number: 35 },
];

export const mockSections: Section[] = [
  { id: "sec-33a", batchId: "batch-33", name: "33-A", crCanApproveSignups: true },
  { id: "sec-33b", batchId: "batch-33", name: "33-B", crCanApproveSignups: false },
  { id: "sec-35a", batchId: "batch-35", name: "35-A", crCanApproveSignups: false },
];

export const mockTerms: Term[] = [
  { id: "term-fall26", name: "Fall 2026", isCurrent: true },
  { id: "term-spring26", name: "Spring 2026", isCurrent: false },
  { id: "term-fall25", name: "Fall 2025", isCurrent: false },
];

export const mockSectionTerms: SectionTerm[] = [
  { sectionId: "sec-33a", termId: "term-fall26", semesterNo: 8 },
  { sectionId: "sec-33a", termId: "term-spring26", semesterNo: 7 },
  { sectionId: "sec-33a", termId: "term-fall25", semesterNo: 6 },
  { sectionId: "sec-33b", termId: "term-fall26", semesterNo: 8 },
  { sectionId: "sec-35a", termId: "term-fall26", semesterNo: 4 },
];

export const mockCourses: Course[] = [
  { id: "crs-compiler", code: "CSE 421", title: "Compiler Design" },
  { id: "crs-compiler-lab", code: "CSE 422", title: "Compiler Design Lab" },
  { id: "crs-distributed", code: "CSE 435", title: "Distributed Systems" },
  { id: "crs-ai", code: "CSE 471", title: "Artificial Intelligence" },
  { id: "crs-ethics", code: "CSE 400", title: "Professional Ethics & Law" },
  { id: "crs-linalg", code: "MAT 215", title: "Linear Algebra & Differential Equations" },
  { id: "crs-ds", code: "CSE 211", title: "Data Structures & Algorithms" },
  { id: "crs-oop", code: "CSE 221", title: "Object Oriented Programming" },
];

export const mockOfferings: Offering[] = [
  // 33-A Fall 2026 (Semester 8) - 5 courses
  { id: "off-33a-f26-comp", courseId: "crs-compiler", sectionId: "sec-33a", termId: "term-fall26", facultyName: "Dr. K. M. Rahman" },
  { id: "off-33a-f26-lab", courseId: "crs-compiler-lab", sectionId: "sec-33a", termId: "term-fall26", facultyName: "Lec. Farhana Kabir" },
  { id: "off-33a-f26-dist", courseId: "crs-distributed", sectionId: "sec-33a", termId: "term-fall26", facultyName: "Prof. S. Ahmed" },
  { id: "off-33a-f26-ai", courseId: "crs-ai", sectionId: "sec-33a", termId: "term-fall26", facultyName: "Dr. M. Alam" },
  { id: "off-33a-f26-eth", courseId: "crs-ethics", sectionId: "sec-33a", termId: "term-fall26", facultyName: "Ms. Nazia Chowdhury" },

  // 33-A Spring 2026 (Semester 7) - 4 courses
  { id: "off-33a-s26-oop", courseId: "crs-oop", sectionId: "sec-33a", termId: "term-spring26", facultyName: "Dr. K. M. Rahman" },
  { id: "off-33a-s26-ds", courseId: "crs-ds", sectionId: "sec-33a", termId: "term-spring26", facultyName: "Prof. S. Ahmed" },
  { id: "off-33a-s26-la", courseId: "crs-linalg", sectionId: "sec-33a", termId: "term-spring26", facultyName: "Dr. T. Karim" },
  { id: "off-33a-s26-ai", courseId: "crs-ai", sectionId: "sec-33a", termId: "term-spring26", facultyName: "Dr. M. Alam" },

  // 33-A Fall 2025 (Semester 6) - 4 courses
  { id: "off-33a-f25-oop", courseId: "crs-oop", sectionId: "sec-33a", termId: "term-fall25", facultyName: "Dr. K. M. Rahman" },
  { id: "off-33a-f25-ds", courseId: "crs-ds", sectionId: "sec-33a", termId: "term-fall25", facultyName: "Prof. S. Ahmed" },
  { id: "off-33a-f25-la", courseId: "crs-linalg", sectionId: "sec-33a", termId: "term-fall25", facultyName: "Dr. T. Karim" },
  { id: "off-33a-f25-eth", courseId: "crs-ethics", sectionId: "sec-33a", termId: "term-fall25", facultyName: "Ms. Nazia Chowdhury" },

  // 35-A Fall 2026 (Semester 4) - 4 courses
  { id: "off-35a-f26-la", courseId: "crs-linalg", sectionId: "sec-35a", termId: "term-fall26", facultyName: "Dr. T. Karim" },
  { id: "off-35a-f26-ds", courseId: "crs-ds", sectionId: "sec-35a", termId: "term-fall26", facultyName: "Prof. S. Ahmed" },
  { id: "off-35a-f26-oop", courseId: "crs-oop", sectionId: "sec-35a", termId: "term-fall26", facultyName: "Dr. K. M. Rahman" },
  { id: "off-35a-f26-eth", courseId: "crs-ethics", sectionId: "sec-35a", termId: "term-fall26", facultyName: "Ms. Nazia Chowdhury" },
];

export const mockUsers: User[] = [
  // Personas
  {
    id: "usr-student",
    name: "Rafi Ahmed",
    email: "rafi.ahmed@cse.univ.edu",
    studentId: "20-11234",
    role: "student",
    status: "approved",
    sectionId: "sec-33a",
    phone: "+880 1711-234567",
  },
  {
    id: "usr-cr",
    name: "Syeda Dillir Hossain",
    email: "dillir.hossain@cse.univ.edu",
    studentId: "20-11001",
    role: "student",
    status: "approved",
    sectionId: "sec-33a",
    phone: "+880 1712-345678",
  },
  {
    id: "usr-cr2",
    name: "Tanzim Hossain",
    email: "tanzim.hossain@cse.univ.edu",
    studentId: "20-11002",
    role: "student",
    status: "approved",
    sectionId: "sec-33a",
    phone: "+880 1819-223344",
  },
  {
    id: "usr-admin",
    name: "Nasrin Akter",
    email: "nasrin.akter@cse.univ.edu",
    role: "admin",
    status: "approved",
    adminScope: null,
    phone: "+880 1912-887766",
  },

  // 10 other students in 33-A (Total 12)
  { id: "usr-33a-3", name: "Tanvir Hasan", email: "tanvir.h@cse.univ.edu", studentId: "20-11003", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-4", name: "Ayesha Siddiqua", email: "ayesha.s@cse.univ.edu", studentId: "20-11004", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-5", name: "Rafid Mahbub", email: "rafid.m@cse.univ.edu", studentId: "20-11005", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-6", name: "Samiul Islam", email: "samiul.i@cse.univ.edu", studentId: "20-11006", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-7", name: "Fabiha Tasnim", email: "fabiha.t@cse.univ.edu", studentId: "20-11007", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-8", name: "Mehedi Hasan", email: "mehedi.h@cse.univ.edu", studentId: "20-11008", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-9", name: "Zarin Subah", email: "zarin.s@cse.univ.edu", studentId: "20-11009", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-10", name: "Ahnaf Tahmid", email: "ahnaf.t@cse.univ.edu", studentId: "20-11010", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-11", name: "Sadia Afrin", email: "sadia.a@cse.univ.edu", studentId: "20-11011", role: "student", status: "approved", sectionId: "sec-33a" },
  { id: "usr-33a-12", name: "Kazi Nabil", email: "kazi.n@cse.univ.edu", studentId: "20-11012", role: "student", status: "approved", sectionId: "sec-33a" },

  // 8 students in 35-A
  { id: "usr-35a-1", name: "Arif Al Mamun", email: "arif.m@cse.univ.edu", studentId: "22-12001", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-2", name: "Nafisa Anjum", email: "nafisa.a@cse.univ.edu", studentId: "22-12002", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-3", name: "Rezaul Karim", email: "rezaul.k@cse.univ.edu", studentId: "22-12003", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-4", name: "Sumaiya Akter", email: "sumaiya.a@cse.univ.edu", studentId: "22-12004", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-5", name: "Hasibul Alam", email: "hasibul.a@cse.univ.edu", studentId: "22-12005", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-6", name: "Tasnim Ferdous", email: "tasnim.f@cse.univ.edu", studentId: "22-12006", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-7", name: "Imtiaz Shovon", email: "imtiaz.s@cse.univ.edu", studentId: "22-12007", role: "student", status: "approved", sectionId: "sec-35a" },
  { id: "usr-35a-8", name: "Mahira Khan", email: "mahira.k@cse.univ.edu", studentId: "22-12008", role: "student", status: "approved", sectionId: "sec-35a" },

  // Pending sign-up users (3 pending)
  { id: "usr-pending-1", name: "Junaed Siddique", email: "junaed.s@cse.univ.edu", studentId: "20-11099", role: "student", status: "pending", sectionId: "sec-33a" },
  { id: "usr-pending-2", name: "Nusrat Fariha", email: "nusrat.f@cse.univ.edu", studentId: "20-11100", role: "student", status: "pending", sectionId: "sec-33a" },
  { id: "usr-pending-3", name: "Sakib Al Hasan", email: "sakib.h@cse.univ.edu", studentId: "22-12099", role: "student", status: "pending", sectionId: "sec-35a" },
];

export const mockSectionCRs: SectionCR[] = [
  { userId: "usr-cr", sectionId: "sec-33a" },
  { userId: "usr-cr2", sectionId: "sec-33a" },
  { userId: "usr-35a-1", sectionId: "sec-35a" },
];

// Approved retakes: Rafi Ahmed taking Linear Algebra in 35-A
export const mockEnrollments: Enrollment[] = [
  { studentId: "usr-student", offeringId: "off-35a-f26-la", type: "retake" },
];

export const mockEnrollmentRequests: EnrollmentRequest[] = [
  { id: "req-1", studentId: "usr-student", offeringId: "off-35a-f26-la", status: "approved", createdAt: "2026-11-01" },
  { id: "req-2", studentId: "usr-33a-3", offeringId: "off-35a-f26-ds", status: "pending", createdAt: "2026-11-08" },
  { id: "req-3", studentId: "usr-33a-4", offeringId: "off-35a-f26-oop", status: "pending", createdAt: "2026-11-08" },
  { id: "req-4", studentId: "usr-33a-5", offeringId: "off-35a-f26-eth", status: "approved", createdAt: "2026-11-02" },
  { id: "req-5", studentId: "usr-35a-2", offeringId: "off-33a-f26-comp", status: "approved", createdAt: "2026-11-03" },
  { id: "req-6", studentId: "usr-35a-3", offeringId: "off-33a-f26-ai", status: "rejected", rejectReason: "Prerequisite not completed", createdAt: "2026-11-04" },
];

// 14 posts: 3 pinned/urgent, 3 deadlines, 2 exams, 3 routine notices (1 expired), rest general
export const mockPosts: Post[] = [
  {
    id: "post-1",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-comp",
    type: "announcement",
    kind: "general",
    title: "Midterm Syllabus & Module 1-3 Review Materials",
    body: "Dr. Rahman has finalized the Midterm scope: Lexical analysis, Top-down parsing, and LL(1) tables will be covered in detail.",
    pinned: true,
    authorId: "usr-cr",
    createdAt: "2026-11-08T10:00:00Z",
  },
  {
    id: "post-2",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-comp",
    type: "deadline",
    kind: "general",
    title: "Assignment 2: Lexer & Recursive Descent Parser",
    body: "Submit zipped source code with test grammar files to Google Classroom before the cutoff.",
    dueAt: "2026-11-12T23:59:00Z",
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-07T14:30:00Z",
  },
  {
    id: "post-3",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-lab",
    type: "deadline",
    kind: "general",
    title: "Lab Task 04: Flex Specification Report",
    body: "Individual submission of grammar patterns and token table outputs.",
    dueAt: "2026-11-10T17:00:00Z",
    pinned: false,
    authorId: "usr-cr2",
    createdAt: "2026-11-06T11:00:00Z",
  },
  {
    id: "post-4",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-dist",
    type: "exam",
    kind: "general",
    title: "Quiz 2: Distributed Consensus & Raft Protocol",
    body: "Written 20-minute closed book quiz in lecture room 402B at start of class.",
    dueAt: "2026-11-15T11:00:00Z",
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-05T09:00:00Z",
  },
  {
    id: "post-5",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-ai",
    type: "exam",
    kind: "general",
    title: "Midterm Exam: Search Algorithms & Minimax",
    body: "Central exam hall 601. Please bring scientific calculator and student ID card.",
    dueAt: "2026-11-18T10:00:00Z",
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-04T16:00:00Z",
  },
  {
    id: "post-6",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-comp",
    type: "announcement",
    kind: "reschedule",
    title: "Compiler Design Class Rescheduled to Room 502",
    body: "Thursday's 10:30 AM session is temporarily moved to Digital Lab 502 due to projector maintenance.",
    expiresOn: "2026-11-14",
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-08T15:00:00Z",
  },
  {
    id: "post-7",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-eth",
    type: "announcement",
    kind: "online",
    title: "Professional Ethics Lecture Online via Google Meet",
    body: "Ms. Nazia Chowdhury will conduct tomorrow's lecture online. The meet link is pinned in Drive resources.",
    expiresOn: "2026-11-11",
    pinned: false,
    authorId: "usr-cr2",
    createdAt: "2026-11-08T18:00:00Z",
  },
  {
    id: "post-8",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-lab",
    type: "announcement",
    kind: "cancel",
    title: "Old Lab Makeup Session (Expired notice)",
    body: "This session already completed last week.",
    expiresOn: "2026-11-05", // Expired relative to TODAY 2026-11-09
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-02T10:00:00Z",
  },
  {
    id: "post-9",
    sectionId: "sec-33a",
    type: "announcement",
    kind: "general",
    title: "Section 33-A Farewell Gala & Batch Photo Session",
    body: "Save the date! As this is Semester 8, batch photo day will be next month. Submit costume votes to CRs.",
    pinned: true,
    authorId: "usr-cr",
    createdAt: "2026-11-07T08:00:00Z",
  },
  {
    id: "post-10",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-dist",
    type: "deadline",
    kind: "general",
    title: "Project Milestone 1: RPC Client-Server Prototype",
    body: "Demonstrate working gRPC socket connections and multi-client request handling.",
    dueAt: "2026-11-20T23:59:00Z",
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-03T12:00:00Z",
  },
  {
    id: "post-11",
    sectionId: "sec-33a",
    offeringId: "off-33a-f26-ai",
    type: "announcement",
    kind: "general",
    title: "A* Search & Heuristic Admissibility Slides Uploaded",
    body: "Dr. Alam added 2 extra practice questions to slide 28 for midterm preparation.",
    pinned: false,
    authorId: "usr-cr",
    createdAt: "2026-11-02T15:00:00Z",
  },
  {
    id: "post-12",
    sectionId: "sec-33a",
    type: "announcement",
    kind: "general",
    title: "Department Seminar: Career Paths in Cloud & DevOps",
    body: "Auditorium session with industry alumni this Friday at 3:30 PM. Attendance counts towards seminar credits.",
    pinned: false,
    authorId: "usr-cr2",
    createdAt: "2026-11-01T11:00:00Z",
  },

  // 35-A posts (Rafi Ahmed can ONLY see Linear Algebra offering posts, NOT other 35-A posts!)
  {
    id: "post-13",
    sectionId: "sec-35a",
    offeringId: "off-35a-f26-la",
    type: "announcement",
    kind: "general",
    title: "35-A Linear Algebra: Eigenvalues & Diagonalization Practice Sheet",
    body: "Dr. Karim uploaded chapter 4 practice sets. Retake students please submit handwritten solutions to 35-A CR.",
    pinned: false,
    authorId: "usr-35a-1",
    createdAt: "2026-11-06T14:00:00Z",
  },
  {
    id: "post-14",
    sectionId: "sec-35a",
    offeringId: "off-35a-f26-ds", // Other 35-A course, Rafi must NOT see this
    type: "announcement",
    kind: "general",
    title: "35-A Data Structures: Red-Black Trees Quiz",
    body: "Exclusive to Section 35-A regular data structures students.",
    pinned: false,
    authorId: "usr-35a-1",
    createdAt: "2026-11-07T14:00:00Z",
  },
];

export const mockResources: Resource[] = [
  { id: "res-1", offeringId: "off-33a-f26-comp", title: "Lecture 01-06 Slides: Lexer & Grammar Derivations", driveUrl: "https://drive.google.com/drive/folders/demo-compiler-slides", authorId: "usr-cr", createdAt: "2026-11-02" },
  { id: "res-2", offeringId: "off-33a-f26-comp", title: "Bison & Flex Starter Template (C++)", driveUrl: "https://drive.google.com/drive/folders/demo-flex-bison", authorId: "usr-cr", createdAt: "2026-11-03" },
  { id: "res-3", offeringId: "off-33a-f26-lab", title: "Lab Manual & JUnit Automated Test Harness", driveUrl: "https://drive.google.com/drive/folders/demo-lab-manual", authorId: "usr-cr2", createdAt: "2026-11-04" },
  { id: "res-4", offeringId: "off-33a-f26-dist", title: "Raft Consensus Visualizer & Paper PDF", driveUrl: "https://drive.google.com/drive/folders/demo-raft-paper", authorId: "usr-cr", createdAt: "2026-11-05" },
  { id: "res-5", offeringId: "off-33a-f26-ai", title: "Python Starter Notebook: A* Search on Grid Maps", driveUrl: "https://drive.google.com/drive/folders/demo-astar-notebook", authorId: "usr-cr", createdAt: "2026-11-06" },
  { id: "res-6", offeringId: "off-33a-f26-eth", title: "Bangladesh Cyber Security Act & Case Studies PDF", driveUrl: "https://drive.google.com/drive/folders/demo-ethics-cases", authorId: "usr-cr2", createdAt: "2026-11-07" },
  { id: "res-7", offeringId: "off-35a-f26-la", title: "Matrix Decomposition & SVD Formula Guide", driveUrl: "https://drive.google.com/drive/folders/demo-mat-svd", authorId: "usr-35a-1", createdAt: "2026-11-05" },
  { id: "res-8", offeringId: "off-35a-f26-ds", title: "35-A Tree Algorithms Visualization Archives", driveUrl: "https://drive.google.com/drive/folders/demo-ds-trees", authorId: "usr-35a-1", createdAt: "2026-11-06" },
];

// 10 schedule rows for 33-A Fall 2026
// Day: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu
export const mockScheduleEntries: ScheduleEntry[] = [
  // Sunday
  { id: "sch-1", sectionId: "sec-33a", termId: "term-fall26", day: 0, startTime: "09:00", endTime: "10:20", offeringId: "off-33a-f26-comp", room: "Room 402B" },
  { id: "sch-2", sectionId: "sec-33a", termId: "term-fall26", day: 0, startTime: "10:30", endTime: "11:50", offeringId: "off-33a-f26-dist", room: "Room 402B" },

  // Monday (TODAY: 2026-11-09 is a Monday!)
  { id: "sch-3", sectionId: "sec-33a", termId: "term-fall26", day: 1, startTime: "09:00", endTime: "10:20", offeringId: "off-33a-f26-comp", room: "Room 402B" },
  { id: "sch-4", sectionId: "sec-33a", termId: "term-fall26", day: 1, startTime: "10:30", endTime: "01:30", offeringId: "off-33a-f26-lab", room: "Digital Lab 501" },
  { id: "sch-5", sectionId: "sec-33a", termId: "term-fall26", day: 1, startTime: "02:00", endTime: "03:20", offeringId: "off-33a-f26-ai", room: "Room 305" },

  // Tuesday
  { id: "sch-6", sectionId: "sec-33a", termId: "term-fall26", day: 2, startTime: "09:00", endTime: "10:20", offeringId: "off-33a-f26-dist", room: "Room 402B" },
  { id: "sch-7", sectionId: "sec-33a", termId: "term-fall26", day: 2, startTime: "10:30", endTime: "11:50", offeringId: "off-33a-f26-eth", room: "Room 302" },

  // Wednesday
  { id: "sch-8", sectionId: "sec-33a", termId: "term-fall26", day: 3, startTime: "09:00", endTime: "10:20", offeringId: "off-33a-f26-ai", room: "Room 305" },
  { id: "sch-9", sectionId: "sec-33a", termId: "term-fall26", day: 3, startTime: "10:30", endTime: "11:50", offeringId: "off-33a-f26-comp", room: "Room 402B" },

  // Thursday
  { id: "sch-10", sectionId: "sec-33a", termId: "term-fall26", day: 4, startTime: "11:00", endTime: "12:20", offeringId: "off-33a-f26-eth", room: "Room 302" },
];

export const mockNotifications: Notification[] = [
  { id: "notif-1", userId: "usr-student", type: "post", refId: "post-1", title: "Midterm Syllabus Released", message: "Dr. Rahman posted the final syllabus for Compiler Design.", createdAt: "2026-11-08T10:05:00Z" },
  { id: "notif-2", userId: "usr-student", type: "deadline", refId: "post-2", title: "Upcoming Deadline Reminder", message: "Assignment 2 is due in 3 days.", createdAt: "2026-11-08T12:00:00Z" },
  { id: "notif-3", userId: "usr-student", type: "resource", refId: "res-5", title: "New Resource in AI", message: "Python Starter Notebook uploaded for A* Search.", createdAt: "2026-11-08T16:00:00Z" },
  { id: "notif-4", userId: "usr-student", type: "reminder", refId: "sch-4", title: "Lab Session Today", message: "Compiler Design Lab starts at 10:30 AM in Digital Lab 501.", createdAt: "2026-11-07T08:00:00Z", readAt: "2026-11-07T09:00:00Z" },
  { id: "notif-5", userId: "usr-student", type: "post", refId: "post-7", title: "Class Mode Shift", message: "Tomorrow's Professional Ethics lecture will be held online.", createdAt: "2026-11-06T19:00:00Z", readAt: "2026-11-06T20:00:00Z" },
  { id: "notif-6", userId: "usr-student", type: "post", refId: "post-9", title: "Farewell Batch Announcement", message: "Batch 33 photo day discussion started.", createdAt: "2026-11-05T14:00:00Z", readAt: "2026-11-05T15:00:00Z" },
  { id: "notif-7", userId: "usr-student", type: "deadline", refId: "post-3", title: "Lab Report Due", message: "Lab task 04 Flex report submission is open.", createdAt: "2026-11-04T11:00:00Z", readAt: "2026-11-04T12:00:00Z" },
  { id: "notif-8", userId: "usr-student", type: "post", refId: "post-13", title: "Retake Class Notice (35-A)", message: "New Linear Algebra practice sheet uploaded for your retake.", createdAt: "2026-11-03T10:00:00Z", readAt: "2026-11-03T11:00:00Z" },
];
