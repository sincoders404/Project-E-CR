export const currentUser = {
  name: "Syeda Dillir Hossain",
  firstName: "Syeda",
  studentId: "2021-1-60-042", // shown in topbar
  shortId: "21-12345", // shown on profile + login
  role: "Head CR",
  dept: "Dept. of CSE",
  year: "2nd Year",
  semester: "4th Semester",
  section: "Section 2",
  sectionLabel: "SECTION 2 (CSE 221)",
  email: "dillir.hossain@cse.univ.edu",
  phone: "+880 1712-345678",
  guardian: "Dr. M. A. Hossain (Father)",
  faculty: "Faculty of Science & Engineering",
  major: "B.Sc. in CSE",
  batch: "Spring 2024 (Batch 54)",
  cohort: "Section 2 • Cohort A",
  attendance: { percent: 94.8, delta: "+1.2%", joined: 38, total: 40 },
  standing: { label: "Top 5%", rank: 2, gpa: "3.92 / 4.00" },
  load: { courses: 6, credits: "19.5 Credits", term: "Spring 2026" },
} as const;

export const activeTerm = {
  eyebrow: "ACTIVE TERM",
  label: "Spring 2026 • CSE 221 (Sec 02)",
} as const;
