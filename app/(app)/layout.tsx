import { AppShell } from "@/components/shell/AppShell";

/** Shared shell for all logged-in pages (spec 7.1). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
