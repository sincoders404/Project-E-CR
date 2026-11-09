export type Course = {
  id: string;
  code: string;
  name: string;
  teacher: string;
};

export type Student = {
  id: string;
  name: string;
};

export type ClassGroup = {
  id: string;
  name: string;
  semester: string;
  current: boolean;
  joinOpen: boolean;
  crs: string[];
  courses: Course[];
  students: Student[];
};

export const initialClasses: ClassGroup[] = [
  {
    id: "cse-54-s2",
    name: "CSE Batch 54 · Sec 2",
    semester: "Spring 2026",
    current: true,
    joinOpen: true,
    crs: ["Syeda Dillir Hossain", "Nusrat Jahan"],
    courses: [
      { id: "cse-221", code: "CSE 221", name: "Object Oriented Programming", teacher: "Dr. K. M. Rahman" },
      { id: "cse-222", code: "CSE 222", name: "Object Oriented Programming Lab", teacher: "Lec. Farhana Kabir" },
      { id: "mat-215", code: "MAT 215", name: "Linear Algebra & Differential Equations", teacher: "Prof. S. Ahmed" },
      { id: "eng-102", code: "ENG 102", name: "Technical Writing & Communication", teacher: "Ms. Nazia Chowdhury" },
    ],
    students: [
      { id: "21-12345", name: "Syeda Dillir Hossain" },
      { id: "21-12346", name: "Nusrat Jahan" },
      { id: "21-12347", name: "Tanvir Hasan" },
      { id: "21-12348", name: "Ayesha Siddiqua" },
      { id: "21-12349", name: "Rafid Mahbub" },
      { id: "21-12350", name: "Samiul Islam" },
      { id: "21-12351", name: "Fabiha Tasnim" },
      { id: "21-12352", name: "Mehedi Hasan" },
      { id: "21-12353", name: "Zarin Subah" },
      { id: "21-12354", name: "Ahnaf Tahmid" },
      { id: "21-12355", name: "Sadia Afrin" },
      { id: "21-12356", name: "Kazi Nabil" },
    ],
  },
  {
    id: "cse-54-s1",
    name: "CSE Batch 54 · Sec 1",
    semester: "Spring 2026",
    current: true,
    joinOpen: true,
    crs: ["Arif Al Mamun"],
    courses: [
      { id: "cse-221-s1", code: "CSE 221", name: "Object Oriented Programming", teacher: "Dr. K. M. Rahman" },
      { id: "cse-222-s1", code: "CSE 222", name: "Object Oriented Programming Lab", teacher: "Lec. Farhana Kabir" },
      { id: "mat-215-s1", code: "MAT 215", name: "Linear Algebra & Differential Equations", teacher: "Prof. S. Ahmed" },
      { id: "eng-102-s1", code: "ENG 102", name: "Technical Writing & Communication", teacher: "Ms. Nazia Chowdhury" },
    ],
    students: [
      { id: "21-12401", name: "Arif Al Mamun" },
      { id: "21-12402", name: "Nafisa Anjum" },
      { id: "21-12403", name: "Rezaul Karim" },
      { id: "21-12404", name: "Sumaiya Akter" },
      { id: "21-12405", name: "Hasibul Alam" },
      { id: "21-12406", name: "Tasnim Ferdous" },
      { id: "21-12407", name: "Imtiaz Shovon" },
      { id: "21-12408", name: "Mahira Khan" },
      { id: "21-12409", name: "Adnan Sami" },
      { id: "21-12410", name: "Bushra Tabassum" },
    ],
  },
  {
    id: "cse-53-s2",
    name: "CSE Batch 53 · Sec 2",
    semester: "Fall 2025",
    current: false,
    joinOpen: false,
    crs: ["Syeda Dillir Hossain", "Mahmudul Hasan"],
    courses: [
      { id: "cse-211", code: "CSE 211", name: "Data Structures", teacher: "Dr. K. M. Rahman" },
      { id: "cse-212", code: "CSE 212", name: "Data Structures Lab", teacher: "Lec. Farhana Kabir" },
      { id: "mat-120", code: "MAT 120", name: "Integral Calculus", teacher: "Prof. S. Ahmed" },
      { id: "phy-109", code: "PHY 109", name: "Physics II", teacher: "Dr. T. Karim" },
    ],
    students: [
      { id: "21-12345", name: "Syeda Dillir Hossain" },
      { id: "21-12347", name: "Tanvir Hasan" },
      { id: "21-12348", name: "Ayesha Siddiqua" },
      { id: "21-12349", name: "Rafid Mahbub" },
      { id: "21-12350", name: "Samiul Islam" },
      { id: "21-12351", name: "Fabiha Tasnim" },
      { id: "21-12352", name: "Mehedi Hasan" },
      { id: "21-12353", name: "Zarin Subah" },
    ],
  },
  {
    id: "cse-53-s1",
    name: "CSE Batch 53 · Sec 1",
    semester: "Summer 2025",
    current: false,
    joinOpen: false,
    crs: ["Syeda Dillir Hossain"],
    courses: [
      { id: "cse-110", code: "CSE 110", name: "Programming Language I", teacher: "Dr. K. M. Rahman" },
      { id: "cse-111", code: "CSE 111", name: "Discrete Mathematics", teacher: "Prof. M. Alam" },
      { id: "mat-110", code: "MAT 110", name: "Differential Calculus", teacher: "Prof. S. Ahmed" },
      { id: "eng-101", code: "ENG 101", name: "Basic English Composition", teacher: "Ms. Nazia Chowdhury" },
    ],
    students: [
      { id: "21-12345", name: "Syeda Dillir Hossain" },
      { id: "21-12347", name: "Tanvir Hasan" },
      { id: "21-12348", name: "Ayesha Siddiqua" },
      { id: "21-12349", name: "Rafid Mahbub" },
      { id: "21-12350", name: "Samiul Islam" },
      { id: "21-12351", name: "Fabiha Tasnim" },
      { id: "21-12352", name: "Mehedi Hasan" },
      { id: "21-12353", name: "Zarin Subah" },
    ],
  },
];

export const semestersList = ["Spring 2026", "Fall 2025", "Summer 2025"];

