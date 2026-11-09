import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountStatusPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users")
    .select("status, reject_reason").eq("id", user.id).single();
  if (profile?.status === "approved") redirect("/dashboard");

  const rejected = profile?.status === "rejected";
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <section className="max-w-md rounded-xl border border-edge bg-surface p-8 text-center shadow-login">
        <h1 className="text-xl font-bold text-ink-900">
          {rejected ? "Sign-up request rejected" : "Approval pending"}
        </h1>
        <p className="mt-3 text-sm text-ink-600">
          {rejected
            ? profile.reject_reason || "Please contact an administrator for more information."
            : "Your account is waiting for approval. You can sign in again after an administrator approves it."}
        </p>
      </section>
    </main>
  );
}
