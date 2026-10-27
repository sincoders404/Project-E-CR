export type CourseRow = {
  id: string;
  letter: string;
  title: string;
  credits: string;
  meta: string;
  presence: number;
};

export const enrolledCourses: CourseRow[] = [
  {
    id: "c1",
    letter: "P",
    title: "CSE 221: Object Oriented Programming",
    credits: "3.0 Cr",
    meta: "Instructor: Prof. Tahmid Rahman • Room 402B • Mon/Wed 10:00 AM",
    presence: 96.2,
  },
  {
    id: "c2",
    letter: "D",
    title: "CSE 222: Data Structures & Algorithms",
    credits: "3.0 Cr",
    meta: "Instructor: Dr. Farzana Kabir • Lab 304 • Sun/Tue 08:30 AM",
    presence: 93.0,
  },
  {
    id: "c3",
    letter: "M",
    title: "MAT 201: Linear Algebra & Matrices",
    credits: "3.0 Cr",
    meta: "Instructor: Prof. Shamsul Haque • Room 201 • Thu 02:00 PM",
    presence: 95.0,
  },
];

export const extraCourses: CourseRow[] = [
  {
    id: "c4",
    letter: "D",
    title: "CSE 223: Database Systems",
    credits: "3.0 Cr",
    meta: "Instructor: Dr. Nafis Iqbal • Lab 210 • Sun/Tue 11:00 AM",
    presence: 91.4,
  },
  {
    id: "c5",
    letter: "D",
    title: "CSE 224: Digital Logic Design",
    credits: "3.0 Cr",
    meta: "Instructor: Prof. Rezaul Karim • Room 305 • Wed 02:00 PM",
    presence: 97.1,
  },
  {
    id: "c6",
    letter: "E",
    title: "ENG 101: Technical Writing",
    credits: "1.5 Cr",
    meta: "Instructor: Ms. Ayesha Siddiqua • Room 118 • Mon 02:00 PM",
    presence: 98.0,
  },
];

export const electionStatus = {
  chip: "CSE-221 Spring 2026",
  title: "Class Representative Nomination",
  pill: "Verification Pending",
  body: "Nomination under review by Head CR. Peer endorsements collected: 34 of 48 peers (70.8%).",
  thresholdLabel: "Peer Endorsement Threshold",
  votes: "34 / 48 Votes (Min. 25 required)",
  percent: 70.8,
} as const;

export const evaluationWindow = {
  title: "Mid-Term Evaluation Window",
  body: "Mid-semester faculty appraisals for Section 2 are now live. Make sure to complete them before October 15, 2026.",
  cta: "Complete Appraisals",
} as const;

export const credentials = {
  sync: "Last university sync: Today, 09:30 AM",
} as const;

export const gpaHistory = [
  { semester: "Spring 2024", credits: "18", gpa: "3.89", remarks: "Good Standing" },
  { semester: "Summer 2024", credits: "9", gpa: "4.00", remarks: "Excellent" },
  { semester: "Fall 2024", credits: "18", gpa: "3.92", remarks: "Good Standing" },
  { semester: "Spring 2025", credits: "18", gpa: "3.94", remarks: "Dean's List" },
] as const;

export const cumulativeGpa = { label: "Cumulative", credits: "63", gpa: "3.92 / 4.00" } as const;

export const honors = ["Dean's List", "Robotics Club", "Peer Mentor"] as const;

export const loginActivity = [
  { device: "Chrome on Windows 11", location: "Dhaka, Bangladesh", time: "Today, 09:12 AM" },
  { device: "Safari on iPhone 15", location: "Dhaka, Bangladesh", time: "Yesterday, 08:47 PM" },
  { device: "Lab Desktop • Building 3", location: "On-campus network", time: "Oct 8, 11:30 AM" },
] as const;

export const preferences = [
  { label: "Email notifications", caption: "Notices, schedule changes, approvals", on: true },
  { label: "SMS class alerts", caption: "Instant reschedule pings", on: true },
  { label: "Push notifications", caption: "Browser notifications for live sessions", on: false },
  { label: "Compact density", caption: "Tighter spacing across tables", on: false },
] as const;

export const securityOptions = {
  twoFactor: { label: "Two-factor authentication", caption: "Require an OTP at each sign-in", on: false },
  loginAlerts: { label: "Login alerts", caption: "Email me on new device sign-ins", on: true },
} as const;
