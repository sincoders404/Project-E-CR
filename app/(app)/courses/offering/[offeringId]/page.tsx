import { Suspense } from "react";
import { CourseDetailClient } from "./CourseDetailClient";

export default function Page({
  params,
}: {
  params: Promise<{ offeringId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-ink-400">
          Loading course...
        </div>
      }
    >
      <CourseDetailClient params={params} />
    </Suspense>
  );
}
