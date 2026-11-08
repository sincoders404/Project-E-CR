"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Eye, EyeOff, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useRole, PersonaRole } from "@/context/RoleProvider";
import { cn } from "@/lib/cn";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { personaRole, setPersonaRole } = useRole();

  const [selectedRole, setSelectedRole] = useState<PersonaRole>(personaRole || "CR");
  const [identifier, setIdentifier] = useState(
    selectedRole === "Admin" ? "nasrin.akter@cse.univ.edu" : selectedRole === "CR" ? "20-11001" : "20-11234"
  );
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (role: PersonaRole) => {
    setSelectedRole(role);
    if (role === "Admin") {
      setIdentifier("nasrin.akter@cse.univ.edu");
    } else if (role === "CR") {
      setIdentifier("20-11001");
    } else {
      setIdentifier("20-11234");
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonaRole(selectedRole);

    if (selectedRole === "Admin") {
      router.push("/admin");
    } else if (selectedRole === "CR") {
      router.push("/cr");
    } else {
      router.push("/dashboard");
    }
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

        {/* Role Picker (Student, CR, Admin) */}
        <div className="mt-6">
          <label className="mb-1.5 block text-xs font-semibold text-ink-700">
            Sign in as
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-brand-50 p-1">
            {(["Student", "CR", "Admin"] as PersonaRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={cn(
                  "press py-2 text-xs font-semibold rounded-md transition-all",
                  selectedRole === r
                    ? "bg-surface text-brand-700 shadow-sm"
                    : "text-ink-500 hover:text-ink-900"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="mb-1.5 block text-xs font-semibold text-ink-700"
            >
              Email or Student ID
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-400">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                id="identifier"
                type="text"
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
      </div>
    </main>
  );
}
