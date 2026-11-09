"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Eye, EyeOff, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { getAuthEmail } from "@/lib/auth-identifiers";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loginRole, setLoginRole] = useState<"student" | "admin">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: getAuthEmail(identifier),
      password,
    });
    if (error || !data.user) {
      showToast(error?.message || "Unable to sign in");
      return;
    }
    const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
    if (profile?.role !== loginRole) {
      await supabase.auth.signOut();
      showToast(`This account is registered as a ${profile?.role ?? "student"}, not a ${loginRole} account.`);
      return;
    }
    router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4 sm:p-6">
      <div className="w-full max-w-[440px] rounded-xl bg-surface p-6 sm:p-8 shadow-login border border-edge">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <span
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm"
          >
            <GraduationCap className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink-900">
            Welcome to E-CR
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Class announcements, routine schedules & Google Drive resources
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-md bg-brand-50 p-1" role="tablist" aria-label="Login role">
          {(["student", "admin"] as const).map((role) => (
            <button
              key={role}
              type="button"
              role="tab"
              aria-selected={loginRole === role}
              onClick={() => setLoginRole(role)}
              className={`rounded px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                loginRole === role
                  ? "bg-surface text-brand-700 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="mb-1.5 block text-xs font-semibold text-ink-700"
            >
              {loginRole === "admin" ? "Admin ID" : "Student ID"}
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder={loginRole === "admin" ? "e.g. admin-001" : "e.g. CSE03308387"}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-11 w-full rounded-md border border-edge bg-brand-50/50 pr-4 pl-9 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-ink-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast()}
                className="press text-xs font-medium text-brand-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-md border border-edge bg-brand-50/50 pr-10 pl-9 text-sm text-ink-900 outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="press absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" block className="mt-2">
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Sign up link */}
        {loginRole === "student" && (
          <div className="mt-6 border-t border-edge pt-4 text-center">
            <p className="text-xs text-ink-500">
              New student?{" "}
              <Link
                href="/signup"
                className="press font-semibold text-brand-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
