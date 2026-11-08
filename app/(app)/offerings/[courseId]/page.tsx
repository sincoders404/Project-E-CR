import { Suspense } from "react";
import { OfferingsDetailClient } from "./OfferingsDetailClient";
import { mockCourses } from "@/data/mock";

export function generateStaticParams() {
  return mockCourses.map((c) => ({ courseId: c.id }));
}

export default function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-ink-400">
          Loading course offerings...
        </div>
      }
    >
      <OfferingsDetailClient params={params} />
    </Suspense>
  );
}
