export type PostType = "announcement" | "deadline" | "resource";

export type Post = {
  id: string;
  type: PostType;
  courseId: string;
  courseCode: string;
  semester: string;
  title: string;
  body: string;
  time: string;
  authorName?: string;
  authorRole?: string;
  pinned?: boolean;
  urgent?: boolean;
  due?: string;
  driveUrl?: string;
  label?: string;
};

export const initialPosts: Post[] = [
  {
    id: "post-1",
    type: "announcement",
    courseId: "cse-221",
    courseCode: "CSE 221",
    semester: "Spring 2026",
    title: "Midterm Exam Syllabus & Question Format Clarification",
    body: "Dr. Rahman confirmed that Midterms will cover Modules 1 through 4 (Polymorphism, Abstract Classes, and Interfaces). MCQ 20 marks, Coding 30 marks.",
    time: "2 hours ago",
    authorName: "Syeda Dillir Hossain",
    authorRole: "CR",
    pinned: true,
  },
  {
    id: "post-2",
    type: "deadline",
    courseId: "cse-221",
    courseCode: "CSE 221",
    semester: "Spring 2026",
    title: "Assignment 2: Java Polymorphism & Abstract Factory Pattern",
    body: "Submit your zipped project directory containing source code and JUnit test report via Google Classroom before midnight.",
    time: "Yesterday",
    due: "Tomorrow, 11:59 PM",
    urgent: true,
  },
  {
    id: "post-3",
    type: "resource",
    courseId: "cse-221",
    courseCode: "CSE 221",
    semester: "Spring 2026",
    title: "Lecture 08 Slides: Interface Inheritance & Design Patterns",
    body: "Annotated PDF slides including whiteboard drawings from today's class on OOP principles.",
    time: "Yesterday",
    driveUrl: "https://drive.google.com/drive/folders/demo-cse221-l8",
    label: "Lecture 08 PDF (4.2 MB)",
  },
  {
    id: "post-4",
    type: "announcement",
    courseId: "cse-222",
    courseCode: "CSE 222",
    semester: "Spring 2026",
    title: "Lab Room Shift for Next Thursday Session",
    body: "Due to hardware upgrades in Lab 402B, Thursday's lab session will temporarily take place in Digital Lab 501.",
    time: "2 days ago",
    authorName: "Syeda Dillir Hossain",
    authorRole: "CR",
  },
  {
    id: "post-5",
    type: "deadline",
    courseId: "cse-222",
    courseCode: "CSE 222",
    semester: "Spring 2026",
    title: "Lab Task 04: Multi-threaded Banking Simulation Report",
    body: "Individual submission of thread synchronization logs and deadlock analysis.",
    time: "3 days ago",
    due: "In 3 days (Nov 11), 5:00 PM",
  },
  {
    id: "post-6",
    type: "resource",
    courseId: "cse-222",
    courseCode: "CSE 222",
    semester: "Spring 2026",
    title: "Starter Code & Test Harness: Lab 05 Producer-Consumer",
    body: "GitHub template repository and zip bundle containing starter boilerplate for next week.",
    time: "3 days ago",
    driveUrl: "https://drive.google.com/drive/folders/demo-cse222-lab5",
    label: "Lab05-Starter.zip (1.1 MB)",
  },
  {
    id: "post-7",
    type: "deadline",
    courseId: "mat-215",
    courseCode: "MAT 215",
    semester: "Spring 2026",
    title: "Problem Set 3: Eigenvalues, Diagonalization & Cayley-Hamilton",
    body: "Complete all questions from Section 4.3 and 4.4. Handwritten physical submission to CR at start of lecture.",
    time: "4 days ago",
    due: "Nov 14, 10:00 AM",
  },
  {
    id: "post-8",
    type: "resource",
    courseId: "mat-215",
    courseCode: "MAT 215",
    semester: "Spring 2026",
    title: "Matrix Decomposition Formula Sheet & Worked Examples",
    body: "Handwritten revision notes compiled by the TA covering Gram-Schmidt and SVD steps.",
    time: "5 days ago",
    driveUrl: "https://drive.google.com/drive/folders/demo-mat215-notes",
    label: "Formula-Sheet-v2.pdf",
  },
  {
    id: "post-9",
    type: "announcement",
    courseId: "eng-102",
    courseCode: "ENG 102",
    semester: "Spring 2026",
    title: "Research Proposal Group Formation Rules",
    body: "Each group must strictly contain 3 or 4 members from Section 2. Send member IDs to the CR by Friday evening.",
    time: "6 days ago",
    authorName: "Syeda Dillir Hossain",
    authorRole: "CR",
  },
  {
    id: "post-10",
    type: "deadline",
    courseId: "eng-102",
    courseCode: "ENG 102",
    semester: "Spring 2026",
    title: "Draft Proposal Abstract Submission (250 words)",
    body: "Submit abstract on Turnitin with problem background, research gap, and methodology synopsis.",
    time: "1 week ago",
    due: "Nov 16, 11:59 PM",
  },
  {
    id: "post-11",
    type: "announcement",
    courseId: "cse-211",
    courseCode: "CSE 211",
    semester: "Fall 2025",
    title: "End-Semester Grade Submission and Script Consultation",
    body: "All final exam scripts are reviewed. Consultation hours will be held in faculty room 604.",
    time: "3 months ago",
    authorName: "Syeda Dillir Hossain",
    authorRole: "CR",
  },
  {
    id: "post-12",
    type: "resource",
    courseId: "cse-211",
    courseCode: "CSE 211",
    semester: "Fall 2025",
    title: "Complete AVL & Red-Black Tree Visualization Archives",
    body: "Archived animations and trace sheets used during Fall 2025 midterm prep.",
    time: "4 months ago",
    driveUrl: "https://drive.google.com/drive/folders/demo-cse211-archive",
    label: "Fall25-DS-Archive.zip (18 MB)",
  },
];

