import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import type { Session } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const stateLabel = { completed: "COMPLETED", live: "LIVE", upcoming: "UPCOMING" } as const;

/** Schedule card with completed/live/upcoming states (spec 8.19). */
export function ClassSessionCard({ session }: { session: Session }) {
  const live = session.state === "live";

  return (
    <article
      className={cn(
        "flex min-h-[132px] flex-col rounded-lg p-4",
        live ? "bg-brand-700 text-white" : "bg-brand-50 text-ink-900",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-[11px] font-medium tabular", live ? "text-white/75" : "text-ink-500")}>{session.time}</p>
        {live ? (
          <Chip tone="success" dot>
            Live Now
          </Chip>
        ) : session.state === "completed" ? (
          <CheckCircle2 aria-hidden className="h-5 w-5 text-brand-700" />
        ) : (
          <Clock aria-hidden className="h-5 w-5 text-ink-400" />
        )}
      </div>

      <h3 className="mt-2 text-[15px] leading-5 font-bold">{session.course}</h3>
      <p className={cn("mt-1 text-[11px]", live ? "text-white/75" : "text-ink-500")}>
        {session.instructor} • {session.room}
      </p>

      <div className="mt-auto flex items-center justify-between pt-3">
        {live ? (
          <>
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wide">
              <MapPin aria-hidden className="h-3 w-3" />
              {session.location}
            </span>
            <span className={cn("text-[10px] font-bold tracking-wide", "text-white/70")}>{stateLabel[session.state]}</span>
          </>
        ) : (
          <span
            className={cn(
              "text-[10px] font-bold tracking-wide",
              session.state === "completed" ? "text-ink-400" : "text-ink-400",
            )}
          >
            {stateLabel[session.state]}
          </span>
        )}
      </div>
    </article>
  );
}
