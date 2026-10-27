export type CRRequest = {
  id: string;
  initials: string;
  name: string;
  yearChip: string;
  roleChip: string;
  studentId: string;
  applied: string;
  statement: string;
  metrics: string[];
  status: "pending" | "approved" | "rejected";
};

export const crRequests: CRRequest[] = [
  {
    id: "r1",
    initials: "FA",
    name: "Farhan Ahmed",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Head CR Candidate",
    studentId: "21-12345-1",
    applied: "Applied 2 days ago",
    statement:
      "Interested in joining as CR to streamline faculty notices, coordinate exam schedules efficiently, and set up a centralized Google Classroom & WhatsApp communication pipeline for Section 2.",
    metrics: ["CGPA: 3.88 (Top 5%)", "14 Peer Endorsements", "Ex-Sub CR (CSE 110)"],
    status: "pending",
  },
  {
    id: "r2",
    initials: "NJ",
    name: "Nusrat Jahan",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Assistant CR Candidate",
    studentId: "21-12348-2",
    applied: "Applied 3 days ago",
    statement:
      "Eager to maintain accurate lab attendance lists, arrange peer review study groups, and serve as accessible liaison between female student representatives and departmental advisors.",
    metrics: ["CGPA: 3.76", "Robotics Club Executive", "9 Endorsements"],
    status: "pending",
  },
  {
    id: "r3",
    initials: "TH",
    name: "Tanvir Hasan",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Head CR Candidate",
    studentId: "21-12350-1",
    applied: "Applied 4 days ago",
    statement:
      "Appointed as Lead CR for the current term; re-submitting the governance profile for the consolidated cohort record.",
    metrics: ["CGPA: 3.81", "12 Peer Endorsements", "Debate Club Treasurer"],
    status: "approved",
  },
  {
    id: "r4",
    initials: "RK",
    name: "Rifat Karim",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Assistant CR Candidate",
    studentId: "21-12361-2",
    applied: "Applied 5 days ago",
    statement:
      "Willing to help organize lab groups and keep the shared drive of lab manuals and past solutions up to date for everyone.",
    metrics: ["CGPA: 3.64", "7 Endorsements"],
    status: "approved",
  },
  {
    id: "r5",
    initials: "MC",
    name: "Mehjabin Chowdhury",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Assistant CR Candidate",
    studentId: "21-12372-2",
    applied: "Applied 6 days ago",
    statement:
      "Interested in coordinating cultural events and maintaining the class notice channel during exam weeks.",
    metrics: ["CGPA: 3.71", "8 Endorsements"],
    status: "approved",
  },
  {
    id: "r6",
    initials: "SH",
    name: "Sadia Hoque",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Head CR Candidate",
    studentId: "21-12380-1",
    applied: "Applied 1 week ago",
    statement: "Applied to support exam schedule coordination and represent the section in departmental forums.",
    metrics: ["CGPA: 3.55", "5 Endorsements"],
    status: "approved",
  },
  {
    id: "r7",
    initials: "AH",
    name: "Arif Hossain",
    yearChip: "CSE 221 • 2nd Year",
    roleChip: "Assistant CR Candidate",
    studentId: "21-12390-2",
    applied: "Applied 2 weeks ago",
    statement: "Volunteered for the role but withdrew after the midterm schedule clash with training.",
    metrics: ["CGPA: 3.42", "3 Endorsements"],
    status: "rejected",
  },
];

export const cohortCapacity = {
  cap: "Cap: 2 / Sec",
  title: "Section Representation Slots",
  progress: "1 of 2 Appointed",
  detail:
    "1 slot currently active (Tanvir Hasan, Lead CR). 1 open co-representative slot remains available.",
  officer: {
    initials: "TH",
    name: "Tanvir Hasan",
    caption: "Lead CR • Appointed Oct 2026",
  },
} as const;

export const governanceRules = [
  { strong: "Minimum CGPA 3.00:", text: "Nominee must hold good academic standing with no disciplinary flags." },
  { strong: "Max 2 CRs per section:", text: "One primary spokesperson and one operational assistant." },
  { strong: "Peer Endorsement Quorum:", text: "Minimum 5 supporting endorsements from registered classmates." },
  { strong: "Advisor Sync Process:", text: "Approved CRs automatically trigger a notification to Course Instructor Dr. M. Rahman." },
] as const;

export const advisor = {
  name: "Dr. Mahbubur Rahman",
  caption: "Section Course Instructor",
} as const;
