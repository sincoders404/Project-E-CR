import { Suspense } from "react";
import { CourseDetailClient } from "./CourseDetailClient";
import { initialClasses } from "@/data/classes";

export function generateStaticParams() {
  return initialClasses
    .flatMap((c) => c.courses)
    .map((course) => ({ courseId: course.id }));
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-ink-400">
          Loading course details...
        </div>
      }
    >
      <CourseDetailClient params={params} />
    </Suspense>
  );
}
