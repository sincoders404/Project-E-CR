"use client";

import { useState, Suspense } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop / tablet sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] border-r border-edge bg-surface md:block xl:w-[220px]">
        <Suspense fallback={<div className="h-full w-full bg-surface" />}>
          <Sidebar />
        </Suspense>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink-900/40 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 left-0 flex w-[260px] max-w-[85vw] flex-col bg-surface shadow-pop">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="press absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
            <Suspense fallback={<div className="h-full w-full bg-surface" />}>
              <Sidebar expanded />
            </Suspense>
          </div>
        </div>
      )}

      <div className="md:pl-[72px] xl:pl-[220px]">
        <Topbar onMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
          <Suspense fallback={<div className="py-10 text-center text-xs text-ink-400">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
