export type JoinRequest = {
  id: string;
  name: string;
  studentId: string;
  classId: string;
  className: string;
  semester: string;
  email: string;
  phone: string;
  sent: string;
  status: "pending" | "approved" | "rejected";
  courses?: string[];
};

export const initialRequests: JoinRequest[] = [
  {
    id: "req-1",
    name: "Kamrul Islam",
    studentId: "21-12360",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "kamrul.islam@cse.univ.edu",
    phone: "+880 1711-223344",
    sent: "25m ago",
    status: "pending",
  },
  {
    id: "req-2",
    name: "Mahir Faisal",
    studentId: "21-12361",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "mahir.faisal@cse.univ.edu",
    phone: "+880 1812-334455",
    sent: "2h ago",
    status: "pending",
  },
  {
    id: "req-3",
    name: "Tanvir Hasan",
    studentId: "21-12347",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "tanvir.hasan@cse.univ.edu",
    phone: "+880 1913-445566",
    sent: "2d ago",
    status: "approved",
    courses: ["cse-221", "cse-222", "mat-215", "eng-102"],
  },
  {
    id: "req-4",
    name: "Ayesha Siddiqua",
    studentId: "21-12348",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "ayesha.s@cse.univ.edu",
    phone: "+880 1714-556677",
    sent: "3d ago",
    status: "approved",
    courses: ["cse-221", "cse-222", "mat-215", "eng-102"],
  },
  {
    id: "req-5",
    name: "Rafid Mahbub",
    studentId: "21-12349",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "rafid.m@cse.univ.edu",
    phone: "+880 1615-667788",
    sent: "4d ago",
    status: "approved",
    courses: ["cse-221", "cse-222"],
  },
  {
    id: "req-6",
    name: "Samiul Islam",
    studentId: "21-12350",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "samiul.i@cse.univ.edu",
    phone: "+880 1516-778899",
    sent: "5d ago",
    status: "approved",
    courses: ["cse-221", "mat-215", "eng-102"],
  },
  {
    id: "req-7",
    name: "Fabiha Tasnim",
    studentId: "21-12351",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "fabiha.t@cse.univ.edu",
    phone: "+880 1317-889900",
    sent: "5d ago",
    status: "approved",
    courses: ["cse-221", "cse-222", "mat-215", "eng-102"],
  },
  {
    id: "req-8",
    name: "Farhan Tariq",
    studentId: "20-99881",
    classId: "cse-54-s2",
    className: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    email: "farhan.t@cse.univ.edu",
    phone: "+880 1718-990011",
    sent: "6d ago",
    status: "rejected",
  },
];

