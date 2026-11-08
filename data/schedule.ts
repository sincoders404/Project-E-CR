export type ScheduleStatus = "done" | "now" | "next";

export type ScheduleItemData = {
  id: string;
  time: string;
  courseCode: string;
  courseName: string;
  teacher: string;
  room: string;
  status: ScheduleStatus;
};

export const todaySchedule: ScheduleItemData[] = [
  {
    id: "sch-1",
    time: "09:00 AM – 10:20 AM",
    courseCode: "CSE 221",
    courseName: "Object Oriented Programming",
    teacher: "Dr. K. M. Rahman",
    room: "Room 402B",
    status: "done",
  },
  {
    id: "sch-2",
    time: "10:30 AM – 01:30 PM",
    courseCode: "CSE 222",
    courseName: "Object Oriented Programming Lab",
    teacher: "Lec. Farhana Kabir",
    room: "Digital Lab 501",
    status: "now",
  },
  {
    id: "sch-3",
    time: "02:00 PM – 03:20 PM",
    courseCode: "MAT 215",
    courseName: "Linear Algebra & Differential Equations",
    teacher: "Prof. S. Ahmed",
    room: "Room 305",
    status: "next",
  },
];

