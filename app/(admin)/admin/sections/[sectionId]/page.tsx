import { Suspense } from "react";
import { AdminSectionDetailClient } from "./AdminSectionDetailClient";
import { mockSections } from "@/data/mock";

export function generateStaticParams() {
  return mockSections.map((s) => ({ sectionId: s.id }));
}

export default function Page({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-ink-400">
          Loading section details...
        </div>
      }
    >
      <AdminSectionDetailClient params={params} />
    </Suspense>
  );
}
