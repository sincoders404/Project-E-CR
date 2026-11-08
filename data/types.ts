export type UserRole = "student" | "admin";
export type UserStatus = "pending" | "approved" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  role: UserRole;
  status: UserStatus;
  sectionId?: string;
  adminScope?: string | null;
  phone?: string;
};

export type Batch = {
  id: string;
  department: string;
  number: number;
};

export type Section = {
  id: string;
  batchId: string;
  name: string;
  crCanApproveSignups: boolean;
};

export type Term = {
  id: string;
  name: string;
  isCurrent: boolean;
};

export type SectionTerm = {
  sectionId: string;
  termId: string;
  semesterNo: number;
};

export type Course = {
  id: string;
  code: string;
  title: string;
};

export type Offering = {
  id: string;
  courseId: string;
  sectionId: string;
  termId: string;
  facultyName: string;
};

export type SectionCR = {
  userId: string;
  sectionId: string;
};

export type EnrollmentType = "regular" | "retake" | "improvement";

export type Enrollment = {
  studentId: string;
  offeringId: string;
  type: EnrollmentType;
};

export type EnrollmentRequest = {
  id: string;
  studentId: string;
  offeringId: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  createdAt: string;
};

export type PostType = "announcement" | "deadline" | "exam";
export type PostKind = "general" | "reschedule" | "cancel" | "online";

export type Post = {
  id: string;
  sectionId: string;
  offeringId?: string;
  type: PostType;
  kind: PostKind;
  title: string;
  body: string;
  dueAt?: string;
  expiresOn?: string;
  pinned: boolean;
  authorId: string;
  createdAt: string;
};

export type Resource = {
  id: string;
  offeringId: string;
  title: string;
  driveUrl: string;
  authorId: string;
  createdAt: string;
};

export type ScheduleEntry = {
  id: string;
  sectionId: string;
  termId: string;
  day: number; // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  startTime: string; // "09:00"
  endTime: string; // "10:20"
  offeringId: string;
  room: string;
};

export type NotificationType = "post" | "deadline" | "resource" | "reminder";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  refId: string;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string;
};
