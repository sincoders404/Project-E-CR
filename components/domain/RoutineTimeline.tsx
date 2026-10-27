import { Clock, MapPin, User } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import type { RoutineDay } from "@/data/course";

const dotTone = { active: "bg-brand-700", lab: "bg-success-600", optional: "bg-ink-400" } as const;

/** Vertical routine timeline (spec 8.19): coloured dots + connector line. */
export function RoutineTimeline({ days }: { days: RoutineDay[] }) {
  return (
    <ol className="relative flex flex-col">
      {days.map((day, i) => (
        <li key={day.day} className="relative flex gap-4 pb-6 last:pb-0">
          {/* connector */}
          {i < days.length - 1 && <span aria-hidden className="absolute top-5 left-[5px] h-full w-px bg-edge" />}
          <span aria-hidden className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotTone[day.tone]}`} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-ink-900">{day.day}</h3>
              <Chip tone={day.tone === "lab" ? "success" : day.tone === "active" ? "info" : "neutral"} className="h-5">
                {day.chip}
              </Chip>
            </div>
            <p className="mt-1 text-[15px] font-bold text-brand-700 tabular">{day.time}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-700">
              <Clock aria-hidden className="h-3.5 w-3.5 text-ink-400" />
              {day.title}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
              <User aria-hidden className="h-3.5 w-3.5 text-ink-400" />
              {day.caption}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function RoutineLocationHint({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-ink-500">
      <MapPin aria-hidden className="h-3.5 w-3.5" />
      {text}
    </p>
  );
}
