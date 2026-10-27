export type Announcement = {
  id: string;
  kind: "urgent" | "meeting" | "routine" | "exam";
  tags: string[];
  course?: string;
  time: string;
  title: string;
  body: string;
  attachment?: { name: string; size: string };
  meta?: { when: string; where: string; cta: string };
};

export const announcements: Announcement[] = [
  {
    id: "a1",
    kind: "urgent",
    tags: ["Urgent Notice"],
    course: "CSE 221",
    time: "45 mins ago",
    title: "Midterm Examination Schedule & Syllabus Topics Published",
    body: "The Department of Computer Science has finalized the Midterm timetable. Room allocations for Section 02 will be in Building 3, Hall A. Please bring your student ID cards and arrive 15 minutes early.",
    attachment: { name: "CSE221_Spring2026_Midterm_Syllabus.pdf", size: "1.4 MB" },
  },
  {
    id: "a2",
    kind: "meeting",
    tags: ["CR Meeting", "General"],
    time: "3 hours ago",
    title: "Class Representative & Faculty Coordination Session",
    body: "All section CRs and co-representatives are requested to join a brief 20-minute alignment session tomorrow at 03:00 PM via Google Meet regarding lab schedule swaps.",
    meta: { when: "Tomorrow, 3:00 PM", where: "Online Meeting", cta: "RSVP Details" },
  },
  {
    id: "a3",
    kind: "routine",
    tags: ["Routine Update", "Lab Session"],
    time: "Yesterday",
    title: "Algorithm Lab Session Shifted to Software Lab 302",
    body: "Due to hardware maintenance in Lab 204, Wednesday's 10:30 AM practical algorithm demonstration will take place in Room 302 (Computing Annex). Bring your student badges.",
  },
  {
    id: "a4",
    kind: "exam",
    tags: ["Exams"],
    course: "CSE 222",
    time: "Yesterday",
    title: "CSE 222 Quiz 02 Marks Published on LMS",
    body: "Quiz 02 scores for Data Structures & Algorithms are now visible on the LMS gradebook. Recheck requests open until Thursday, 5:00 PM via the departmental portal form.",
  },
  {
    id: "a5",
    kind: "urgent",
    tags: ["Urgent Notice"],
    course: "MAT 205",
    time: "2 days ago",
    title: "MAT 205 Assignment 02 Submission Portal Closes Tonight",
    body: "The Linear Algebra assignment portal closes at 11:59 PM tonight. Late submissions will incur the standard 10% per-day penalty as per the course outline.",
  },
  {
    id: "a6",
    kind: "meeting",
    tags: ["CR Meeting"],
    time: "2 days ago",
    title: "Section 02 Photo Session for Departmental Yearbook",
    body: "The yearbook committee will photograph Section 02 after Thursday's theory class in front of Building 2. Wear the departmental jersey if you have one.",
  },
  {
    id: "a7",
    kind: "routine",
    tags: ["Routine Update"],
    time: "3 days ago",
    title: "Thursday Office Hour Moved to Faculty Room 412",
    body: "Dr. S. Rahman's weekly office hour is relocated to Faculty Room 412 for the rest of the month. Email in advance if you need a slot outside the window.",
  },
  {
    id: "a8",
    kind: "exam",
    tags: ["Exams", "General"],
    time: "4 days ago",
    title: "Midterm Seat Plan Draft Released for Review",
    body: "The draft seat plan for the midterm week is on the notice board. Report discrepancies to your CR before Friday noon so corrections can be sent to the exam controller.",
  },
];

export const specialNotice = {
  chip: "CR Special Notice",
  when: "Today",
  title: "Assignment 03 Deadline Extension",
  body: "Following discussion with Course Faculty, the dynamic programming assignment deadline has moved to Friday, 11:59 PM. No further extensions!",
  authorInitials: "NJ",
  authorName: "Nusrat Jahan (CR)",
} as const;

export type QuickAction = {
  title: string;
  caption: string;
  href: string;
  tone: "brand" | "success" | "warning" | "info";
  icon: "monitor" | "user-plus" | "calendar" | "chat";
};

export const quickActions: QuickAction[] = [
  { title: "Class Details", caption: "Course specs & syllabus", href: "/class-details", tone: "brand", icon: "monitor" },
  { title: "Join CR Team", caption: "Apply as Assistant CR", href: "/cr-join-requests", tone: "success", icon: "user-plus" },
  { title: "Class Routine", caption: "Weekly timetable view", href: "/class-details", tone: "info", icon: "calendar" },
  { title: "Contact CR", caption: "Direct message or query request", href: "#", tone: "warning", icon: "chat" },
];

export type RosterOfficer = {
  initials: string;
  name: string;
  caption: string;
};

export const rosterOfficers: RosterOfficer[] = [
  { initials: "NJ", name: "Nusrat Jahan", caption: "Lead Representative • Sec 02" },
  { initials: "TH", name: "Tanzim Hossain", caption: "Assistant CR • Lab Affairs" },
];

export type Session = {
  id: string;
  state: "completed" | "live" | "upcoming";
  time: string;
  course: string;
  instructor: string;
  room: string;
  location?: string;
};

export const todaySchedule: Session[] = [
  {
    id: "s1",
    state: "completed",
    time: "08:30 AM – 10:00 AM",
    course: "CSE 221 • Lecture",
    instructor: "Prof. Tariqul Islam",
    room: "Rm 402B",
  },
  {
    id: "s2",
    state: "live",
    time: "10:30 AM – 12:00 PM",
    course: "CSE 222 • Algorithms Lab",
    instructor: "Engr. Nusrat Jahan",
    room: "Rm 302",
    location: "COMPUTING ANNEX",
  },
  {
    id: "s3",
    state: "upcoming",
    time: "02:00 PM – 03:30 PM",
    course: "MAT 205 • Linear Alg",
    instructor: "Dr. S. Rahman",
    room: "Rm 501",
  },
];
