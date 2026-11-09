export type Role = "Student" | "CR" | "Admin";

export type UserProfile = {
  name: string;
  id: string;
  role: Role;
  email: string;
  phone: string;
  classId: string;
  className: string;
  semester: string;
};

export const student: UserProfile = {
  name: "Syeda Dillir Hossain",
  id: "21-12345",
  role: "CR",
  email: "dillir.hossain@cse.univ.edu",
  phone: "+880 1712-345678",
  classId: "cse-54-s2",
  className: "CSE Batch 54 · Sec 2",
  semester: "Spring 2026",
};

export const adminUser: UserProfile = {
  name: "Dr. K. M. Rahman",
  id: "FAC-8812",
  role: "Admin",
  email: "km.rahman@cse.univ.edu",
  phone: "+880 1819-001122",
  classId: "cse-54-s2",
  className: "Faculty Coordinator",
  semester: "Spring 2026",
};

