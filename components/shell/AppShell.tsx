"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * App shell grid (spec 7.1): fixed sidebar + sticky topbar + scrolling main.
 * ≥1280 exact · 768–1023 icon rail · <768 off-canvas drawer.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop / tablet sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[72px] border-r border-edge bg-surface md:block xl:w-[220px]">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink-900/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-[260px] flex-col bg-surface shadow-pop">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="press absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="md:pl-[72px] xl:pl-[220px]">
        <Topbar onMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
