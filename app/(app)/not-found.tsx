import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[520px] py-16">
      <Card className="p-10 text-center">
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
          <ButtonLink href="/dashboard">Go to Dashboard</ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Back to Login
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
