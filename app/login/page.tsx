"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  IdCard,
  Badge,
  Megaphone,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useToast } from "@/components/ui/Toast";

const roleOptions = [
  { id: "student", label: "Student / Class Rep", icon: <Badge /> },
  { id: "faculty", label: "Faculty / Admin", icon: <Users /> },
];

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [role, setRole] = useState("student");
  const [remember, setRemember] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-login-canvas px-4 py-10 sm:px-6">
      <div className="w-full max-w-[1040px] overflow-hidden rounded-xl bg-surface shadow-login">
        <div className="flex flex-col lg:flex-row">
          {/* ── Left brand panel ─────────────────────────────────────── */}
          <div className="relative flex flex-col overflow-hidden bg-grad-brand p-6 text-white lg:w-[45%] lg:p-8">
            {/* subtle radial highlights */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl"
            />

            <div className="relative">
              {/* Logo row */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15"
                >
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg font-bold">E-CR</span>
                    <span className="rounded-[4px] bg-white/20 px-1 py-px text-[9px] leading-[14px] font-bold">
                      V2.4
                    </span>
                  </span>
                  <span className="block text-[11px] text-white/80">Class Representative Portal</span>
                </span>
              </div>

              {/* Term chip */}
              <span className="mt-4 inline-flex h-6 items-center gap-2 rounded-full bg-white/15 px-3 text-[11px] font-semibold">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
                Spring 2026 Academic Coordination
              </span>

              {/* Headline */}
              <h1 className="mt-6 text-[32px] leading-[38px] font-extrabold tracking-tight lg:text-4xl lg:leading-[42px]">
                Better Class.
                <br />
                Better University.
              </h1>

              <p className="mt-4 max-w-[360px] text-sm leading-5 text-white/85 max-lg:hidden">
                Connect effortlessly with course peers, resolve schedule clashes, broadcast official notices, and
                coordinate with faculty in real-time.
              </p>

              {/* Photo card */}
              <div className="relative mt-6 hidden h-[150px] overflow-hidden rounded-lg lg:block">
                <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold">
                    <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />
                    Verified Department Representatives
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide uppercase">SEC-A / CSE</span>
                </div>
              </div>

              {/* Feature tiles */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-white/12 p-3 text-center max-lg:hidden">
                {[
                  { icon: <Share2 className="h-4 w-4" />, title: "Connect", caption: "Whole Batch" },
                  { icon: <Megaphone className="h-4 w-4" />, title: "Communicate", caption: "Instant Routine" },
                  { icon: <ArrowLeftRight className="h-4 w-4" />, title: "Coordinate", caption: "CR Approvals" },
                ].map((f) => (
                  <div key={f.title} className="flex flex-col items-center gap-1">
                    <span aria-hidden className="text-white/90">
                      {f.icon}
                    </span>
                    <span className="text-xs font-bold">{f.title}</span>
                    <span className="text-[10px] text-white/70">{f.caption}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-[10px] text-white/70 max-lg:hidden">
                <span>Institutional SSO Enabled</span>
                <span>Accredited Portal • 2026</span>
              </div>
            </div>
          </div>

          {/* ── Right form panel ─────────────────────────────────────── */}
          <div className="flex min-w-0 flex-1 flex-col">
            <form
              className="flex-1 p-6 sm:p-10"
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/dashboard");
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-700" />
                  Authorized Access
                </p>
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-brand-100 px-2.5 text-[11px] font-semibold text-brand-700">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success-600" />
                  Server Online: CSE Dept
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-900">Welcome Back!</h2>
              <p className="mt-1.5 text-sm text-ink-500">
                Sign in to your E-CR account to oversee class schedules and pending notices.
              </p>

              <div className="mt-6">
                <SegmentedControl options={roleOptions} value={role} onChange={setRole} label="Sign in as" />
              </div>

              <div className="mt-5 space-y-4">
                <TextField
                  label="University Email or Student ID"
                  name="identifier"
                  autoComplete="username"
                  defaultValue="21-12345"
                  icon={<IdCard />}
                />
                <PasswordField
                  label="Password"
                  trailing={
                    <button
                      type="button"
                      onClick={() => showToast()}
                      className="press text-xs font-semibold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                    >
                      Forgot Password?
                    </button>
                  }
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-2">
                <Checkbox checked={remember} onCheckedChange={setRemember} label="Remember my device for 30 days" />
                <span className="flex shrink-0 items-center gap-1 text-[11px] text-ink-400">
                  <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
                  SSL 256-bit
                </span>
              </div>

              <Button type="submit" size="lg" block className="mt-5">
                Sign In to E-CR
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Button>

              <div className="my-5 flex items-center gap-3" aria-hidden>
                <span className="h-px flex-1 bg-edge" />
                <span className="text-[11px] font-semibold tracking-[0.06em] text-ink-400 uppercase">Or sign in with</span>
                <span className="h-px flex-1 bg-edge" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => showToast()}
                  className="press flex h-11 items-center justify-center gap-2 rounded-md bg-brand-50 text-[13px] font-semibold text-brand-700 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <CreditCard aria-hidden className="h-4 w-4" />
                  Campus Smartcard
                </button>
                <button
                  type="button"
                  onClick={() => showToast()}
                  className="press flex h-11 items-center justify-center gap-2 rounded-md bg-brand-50 text-[13px] font-semibold text-brand-700 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  <Building2 aria-hidden className="h-4 w-4" />
                  EduID SSO
                </button>
              </div>
            </form>

            {/* Bottom strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-50 px-6 py-5 sm:px-10">
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink-900">New Representative or Class Member?</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  Request student role onboarding or register your section batch.
                </p>
              </div>
              <Button
                variant="soft"
                className="bg-white"
                onClick={() => showToast()}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer outside the card */}
      <div className="mt-6 flex max-w-[1040px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] text-ink-500">
        <span className="flex items-center gap-1.5">
          <BadgeCheck aria-hidden className="h-3.5 w-3.5" />
          Department of Academic Affairs & Student Governance
        </span>
        <span aria-hidden>•</span>
        {["System Guidelines", "CR Election Protocols", "IT Help Desk"].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => showToast()}
            className="press hover:text-ink-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {l}
          </button>
        ))}
      </div>

    </main>
  );
}
