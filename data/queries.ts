import {
  User,
  Section,
  Term,
  Course,
  Offering,
  SectionCR,
  Enrollment,
  EnrollmentRequest,
  Post,
  Resource,
  ScheduleEntry,
  Notification,
} from "./types";
import { TODAY } from "./mock";

/**
 * Single source of truth for all query and access logic per Spec v3 Section 5.
 * Pages must NEVER filter raw collections themselves.
 */

export function getCurrentTerm(terms: Term[]): Term {
  return terms.find((t) => t.isCurrent) || terms[0];
}

export function isUserCR(userId: string, sectionCRs: SectionCR[]): boolean {
  return sectionCRs.some((cr) => cr.userId === userId);
}

export function getCRSections(userId: string, sectionCRs: SectionCR[], sections: Section[]): Section[] {
  const crSectionIds = sectionCRs.filter((cr) => cr.userId === userId).map((cr) => cr.sectionId);
  return sections.filter((s) => crSectionIds.includes(s.id));
}

/**
 * Access Rule 1 & 2:
 * Student sees: all offerings of their own home section, plus offerings where they have an approved retake.
 * Admin sees all offerings.
 */
export function getVisibleOfferings(
  user: User,
  offerings: Offering[],
  enrollments: Enrollment[],
  termId?: string
): Offering[] {
  let list = offerings;
  if (termId) {
    list = list.filter((o) => o.termId === termId);
  }

  if (user.role === "admin") {
    return list;
  }

  const homeSectionId = user.sectionId;
  const approvedRetakeOfferingIds = enrollments
    .filter((e) => e.studentId === user.id && (e.type === "retake" || e.type === "improvement"))
    .map((e) => e.offeringId);

  return list.filter((o) => {
    if (homeSectionId && o.sectionId === homeSectionId) return true;
    if (approvedRetakeOfferingIds.includes(o.id)) return true;
    return false;
  });
}

/**
 * Access Rules 1, 2, 3:
 * - Student sees: posts of their home section (whole section + home offerings)
 * - Retaker sees ONLY posts of the retaken offering (NOT whole section posts of the other section)
 * - Expiry rule: a post with expiresOn is hidden if TODAY is after that date (expiresOn < TODAY)
 * - Admin sees all.
 */
export function getVisiblePosts(
  user: User,
  posts: Post[],
  offerings: Offering[],
  enrollments: Enrollment[]
): Post[] {
  return posts.filter((post) => {
    // Expiry check (Rule 3)
    if (post.expiresOn && post.expiresOn < TODAY) {
      return false;
    }

    if (user.role === "admin") {
      return true;
    }

    const homeSectionId = user.sectionId;
    const approvedRetakeOfferingIds = enrollments
      .filter((e) => e.studentId === user.id && (e.type === "retake" || e.type === "improvement"))
      .map((e) => e.offeringId);

    // If whole section post (no offeringId)
    if (!post.offeringId) {
      return homeSectionId === post.sectionId;
    }

    // If attached to an offering
    const postOffering = offerings.find((o) => o.id === post.offeringId);
    if (!postOffering) return false;

    // Home section offering
    if (homeSectionId && postOffering.sectionId === homeSectionId) {
      return true;
    }

    // Approved retake offering
    if (approvedRetakeOfferingIds.includes(post.offeringId)) {
      return true;
    }

    return false;
  });
}

/**
 * Access Rules for Resources:
 * Student sees resources for home offerings + approved retake offerings.
 */
export function getVisibleResources(
  user: User,
  resources: Resource[],
  offerings: Offering[],
  enrollments: Enrollment[]
): Resource[] {
  return resources.filter((res) => {
    if (user.role === "admin") return true;

    const offering = offerings.find((o) => o.id === res.offeringId);
    if (!offering) return false;

    if (user.sectionId && offering.sectionId === user.sectionId) {
      return true;
    }

    const approvedRetakeOfferingIds = enrollments
      .filter((e) => e.studentId === user.id && (e.type === "retake" || e.type === "improvement"))
      .map((e) => e.offeringId);

    return approvedRetakeOfferingIds.includes(res.offeringId);
  });
}

/**
 * Active routine notices (reschedule, cancel, online) that have not expired.
 */
export function getActiveRoutineNotices(
  user: User,
  posts: Post[],
  offerings: Offering[],
  enrollments: Enrollment[]
): Post[] {
  const visible = getVisiblePosts(user, posts, offerings, enrollments);
  return visible.filter(
    (p) => p.kind === "reschedule" || p.kind === "cancel" || p.kind === "online"
  );
}

/**
 * Today's schedule entries for a section in a term.
 * Monday is day 1 (TODAY = 2026-11-09 is a Monday).
 */
export function getTodaySchedule(
  sectionId: string,
  termId: string,
  scheduleEntries: ScheduleEntry[],
  day: number = 1
): ScheduleEntry[] {
  return scheduleEntries
    .filter((s) => s.sectionId === sectionId && s.termId === termId && s.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/**
 * Section schedule table (all days)
 */
export function getSectionSchedule(
  sectionId: string,
  termId: string,
  scheduleEntries: ScheduleEntry[]
): ScheduleEntry[] {
  return scheduleEntries
    .filter((s) => s.sectionId === sectionId && s.termId === termId)
    .sort((a, b) => (a.day !== b.day ? a.day - b.day : a.startTime.localeCompare(b.startTime)));
}

/**
 * Access Rule 6:
 * Friends list (classmates) shows only users of the student's own section, with name and student ID only.
 */
export function getClassmates(sectionId: string, users: User[]): { id: string; name: string; studentId: string }[] {
  return users
    .filter((u) => u.sectionId === sectionId && u.role === "student" && u.status === "approved" && u.studentId)
    .map((u) => ({ id: u.id, name: u.name, studentId: u.studentId! }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get CRs for a section.
 */
export function getSectionCRs(sectionId: string, sectionCRs: SectionCR[], users: User[]): User[] {
  const crUserIds = sectionCRs.filter((cr) => cr.sectionId === sectionId).map((cr) => cr.userId);
  return users.filter((u) => crUserIds.includes(u.id));
}

/**
 * Notifications queries
 */
export function getUserNotifications(userId: string, notifications: Notification[]): Notification[] {
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadNotificationsCount(userId: string, notifications: Notification[]): number {
  return notifications.filter((n) => n.userId === userId && !n.readAt).length;
}

/**
 * Retake catalog queries
 */
export function getCatalogCourses(courses: Course[], offerings: Offering[], currentTermId: string) {
  return courses.map((course) => {
    const termOfferings = offerings.filter(
      (o) => o.courseId === course.id && o.termId === currentTermId
    );
    return {
      course,
      offeringCount: termOfferings.length,
      offerings: termOfferings,
    };
  });
}

export function getCourseOfferingsWithDetails(
  courseId: string,
  offerings: Offering[],
  sections: Section[],
  currentTermId: string
) {
  const relevant = offerings.filter(
    (o) => o.courseId === courseId && o.termId === currentTermId
  );
  return relevant.map((offering) => {
    const section = sections.find((s) => s.id === offering.sectionId);
    return {
      offering,
      sectionName: section ? `CSE ${section.name}` : offering.sectionId,
      facultyName: offering.facultyName,
    };
  });
}

export function getUserRetakeRequests(studentId: string, requests: EnrollmentRequest[]) {
  return requests
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * CR Retake Requests query:
 * CR can only review requests for offerings in sections they manage.
 */
export function getCRRequests(
  crUserId: string,
  sectionCRs: SectionCR[],
  offerings: Offering[],
  requests: EnrollmentRequest[]
) {
  const managedSectionIds = sectionCRs
    .filter((cr) => cr.userId === crUserId)
    .map((cr) => cr.sectionId);

  const managedOfferingIds = offerings
    .filter((o) => managedSectionIds.includes(o.sectionId))
    .map((o) => o.id);

  return requests
    .filter((r) => managedOfferingIds.includes(r.offeringId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Signups query:
 * Admin can review all pending signups.
 * CR can review signups for their section ONLY if that section has crCanApproveSignups === true.
 */
export function getPendingSignups(
  user: User,
  sectionCRs: SectionCR[],
  sections: Section[],
  users: User[]
): User[] {
  const pendingUsers = users.filter((u) => u.status === "pending");

  if (user.role === "admin") {
    return pendingUsers;
  }

  // Check if CR
  const managedSectionIds = sectionCRs
    .filter((cr) => cr.userId === user.id)
    .map((cr) => cr.sectionId);

  const allowedSectionIds = sections
    .filter((s) => managedSectionIds.includes(s.id) && s.crCanApproveSignups)
    .map((s) => s.id);

  return pendingUsers.filter((u) => u.sectionId && allowedSectionIds.includes(u.sectionId));
}
