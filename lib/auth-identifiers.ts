const INTERNAL_AUTH_DOMAIN = "students.ecr.internal";

export function getAuthEmail(studentId: string): string {
  const normalizedId = studentId.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `student-${normalizedId}@${INTERNAL_AUTH_DOMAIN}`;
}
