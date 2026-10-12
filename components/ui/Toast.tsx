"use client";

import { createContext, use, useCallback, useMemo, useRef, useState } from "react";

type Toast = { id: number; message: string };
type ToastContextValue = { showToast: (message?: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

/** Demo-only toast (spec 11): bottom-right, dark, 3s auto-dismiss. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((message = "Demo only — not connected yet") => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast rounded-md bg-ink-900 px-4 py-3 text-[13px] text-white shadow-pop motion-reduce:animate-none"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast(): ToastContextValue {
  const ctx = use(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
