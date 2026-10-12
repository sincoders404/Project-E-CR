import Link from "next/link";
import { Compass } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
          <div className="w-full max-w-[520px] rounded-lg bg-surface p-10 text-center shadow-card">
            <span
              aria-hidden
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-brand-100 text-brand-700"
            >
              <Compass className="h-5 w-5" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Page not found</h1>
            <p className="mt-2 text-sm text-ink-500">
              The page you&apos;re looking for doesn&apos;t exist or was moved.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-md border border-edge-strong bg-surface px-4 text-sm font-semibold text-ink-700"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
