export const courseHero = {
  breadcrumb: ["Academic Operations", "Course Details"],
  termChip: "Spring 2026",
  chips: ["CORE CURRICULUM", "4th Semester • 2nd Year", "3.0 Credits (Theory + Lab)"],
  title: "CSE 221 — Object Oriented Programming",
  meta: "Department of Computer Science & Engineering • Faculty of Science & Technology",
  next: { eyebrow: "NEXT UPCOMING CLASS", value: "Tomorrow, 10:30 AM", caption: "Lab Room 302 • Sec A" },
} as const;

export const courseStats = [
  { icon: "people", eyebrow: "Total Enrolled", value: "42", caption: "Students", footer: "100% Registered", footerTone: "success" },
  { icon: "monitor", eyebrow: "Department Code", value: "CSE", caption: "", footer: "Cohort '21 • Computer Science", footerTone: "plain" },
  { icon: "layout", eyebrow: "Section & Venue", value: "Sec A • RM 302", caption: "", footer: "Faculty Bldg 2", footerTone: "brand" },
  { icon: "calendar", eyebrow: "Class Cadence", value: "Mon, Wed", caption: "", footer: "10:30 AM – 12:00 PM", footerTone: "plain" },
] as const;

export const leadCR = {
  name: "Farhan Ahmed",
  chip: "Lead Class Representative",
  caption: "Student ID: 21-12345 • Section A Coordinator • Elected Jan 2026",
  email: "farhan.cr@univ.edu",
  phone: "+880 1711-209481",
} as const;

export type Notice = {
  id: string;
  type: string;
  typeTone: "danger" | "info" | "neutral";
  date: string;
  title: string;
  body: string;
  attachment?: { name: string; size: string; meta: string };
  author: string;
  authorInitials: string;
  verified: string;
};

export const courseNotices: Notice[] = [
  {
    id: "n1",
    type: "Important Notice",
    typeTone: "danger",
    date: "Posted 2 hours ago",
    title: "Midterm Lab Assessment Schedule & Submission Guidelines",
    body: "All students are required to verify their project repositories on the university GitLab portal before Wednesday midnight. The hands-on evaluation will run during regular lab hours in Room 302. Please ensure your local environments run Java 17 LTS and JavaFX runtime dependencies.",
    attachment: { name: "CSE221_Lab_Evaluation_Rubric_v2.pdf", size: "1.4 MB • PDF Document", meta: "1.4 MB • PDF" },
    author: "Farhan Ahmed (Lead CR)",
    authorInitials: "FA",
    verified: "Verified by Dr. Farhana Akhter",
  },
  {
    id: "n2",
    type: "Schedule Change",
    typeTone: "info",
    date: "Oct 2, 2026",
    title: "Class Routine Updated: Makeup Class for Object Oriented Design",
    body: "Due to the faculty seminar on Thursday, the planned tutorial session has been moved to Monday 12:15 PM in Seminar Hall B. Attendance is mandatory for group project allocations.",
    author: "Farhan Ahmed (Lead CR)",
    authorInitials: "FA",
    verified: "CSE Coordination Desk",
  },
  {
    id: "n3",
    type: "Academic Resource",
    typeTone: "neutral",
    date: "Sep 28, 2026",
    title: "Lab Session Moved to Main Software Lab 302",
    body: "All subsequent practical sessions for Section A will occur in Computer Lab 302 with dual monitor setups. Please review Lecture 04 slides uploaded on LMS prior to arrival.",
    author: "Farhan Ahmed (Lead CR)",
    authorInitials: "FA",
    verified: "CSE Coordination Desk",
  },
];

export type ClassMember = {
  id: string;
  name: string;
  initials: string;
  studentId: string;
  role?: string;
};

export const classMembers: ClassMember[] = [
  { id: "m1", name: "Farhan Ahmed", initials: "FA", studentId: "21-12345", role: "Lead CR" },
  { id: "m2", name: "Nusrat Jahan", initials: "NJ", studentId: "21-1-60-112", role: "Assistant CR" },
  { id: "m3", name: "Syeda Dillir Hossain", initials: "SD", studentId: "2021-1-60-042" },
  { id: "m4", name: "Tanvir Hasan", initials: "TH", studentId: "21-12350" },
  { id: "m5", name: "Rifat Karim", initials: "RK", studentId: "21-12361" },
  { id: "m6", name: "Mehjabin Chowdhury", initials: "MC", studentId: "21-12372" },
];

export type FacultyContact = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
};

export const facultyContacts: FacultyContact[] = [
  { id: "f1", name: "Dr. Farhana Akhter", initials: "FA", email: "farhana.akhter@cse.univ.edu", role: "Course Instructor" },
  { id: "f2", name: "Engr. Tanvir Ahmed", initials: "TA", email: "tanvir.ahmed@cse.univ.edu", role: "Lab Instructor" },
];

export type RoutineDay = {
  day: string;
  tone: "active" | "lab" | "optional";
  chip: string;
  time: string;
  title: string;
  caption: string;
};

export const weeklyRoutine: RoutineDay[] = [
  {
    day: "Monday",
    tone: "active",
    chip: "Active",
    time: "10:30 AM – 12:00 PM",
    title: "Theory: OOP & Polymorphism",
    caption: "Room 302 • Dr. Farhana Akhter",
  },
  {
    day: "Wednesday",
    tone: "lab",
    chip: "Lab Hands-on",
    time: "10:30 AM – 12:00 PM",
    title: "Lab Evaluation & JavaFX GUI Building",
    caption: "Engr. Tanvir Ahmed",
  },
  {
    day: "Thursday (Optional)",
    tone: "optional",
    chip: "Office Hour",
    time: "02:00 PM – 03:30 PM",
    title: "Student Query & CR Sync Hour",
    caption: "Faculty Room 412",
  },
];

export const attendanceHealth = {
  percent: 92,
  detail: "22 of 24 Sessions",
  caption: "Class average quorum is exceptional this semester.",
  chip: "Good Standing • Above 80%",
} as const;

export const courseResources = [
  { label: "Lecture Slide Deck (01-08)", caption: "PDF • Updated last week" },
  { label: "Lab Assignment Starter Code", caption: "ZIP • Java 17 + JavaFX" },
  { label: "WhatsApp Batch Discussion", caption: "Group invite • 48 members", external: true },
] as const;
