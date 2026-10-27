import { Eye, EyeOff, Lock } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = {
  label: string;
  icon: React.ReactNode;
  defaultValue?: string;
  type?: string;
  name?: string;
  autoComplete?: string;
};

const fieldClasses =
  "h-12 w-full rounded-md border-2 border-transparent bg-brand-50 pr-4 pl-10 text-sm text-ink-900 outline-none " +
  "placeholder:text-ink-400 transition-colors duration-150 ease-out " +
  "focus:border-brand-500 focus:bg-white";

/** Height 48 input on brand-50, leading 18px icon, 2px brand ring on focus (spec 8.11). */
export function TextField({ label, icon, defaultValue, type = "text", name, autoComplete }: TextFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-ink-900">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-400 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </span>
        <input id={id} type={type} name={name} autoComplete={autoComplete} defaultValue={defaultValue} className={fieldClasses} />
      </div>
    </div>
  );
}

/** Password field with a local eye/eye-off visibility toggle (spec 8.11 + 9.1). */
export function PasswordField({ label, trailing }: { label: string; trailing?: React.ReactNode }) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="block text-[13px] font-semibold text-ink-900">
          {label}
        </label>
        {trailing}
      </div>
      <div className="relative">
        <span aria-hidden className="absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-400">
          <Lock className="h-[18px] w-[18px]" />
        </span>
        <input
          id={id}
          type={visible ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          defaultValue="password123"
          className={cn(fieldClasses, "pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="press absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </div>
  );
}
