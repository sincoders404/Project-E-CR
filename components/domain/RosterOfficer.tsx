import { Mail } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useToast } from "@/components/ui/Toast";
import type { RosterOfficer as Officer } from "@/data/dashboard";

/** Officer row (spec 8.19): initials tile + name + role + mail button. */
export function RosterOfficer({ officer }: { officer: Officer }) {
  const { showToast } = useToast();
  return (
    <div className="flex items-center gap-3 rounded-md bg-brand-50 p-3">
      <Avatar size={36} initials={officer.initials} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink-900">{officer.name}</p>
        <p className="truncate text-[11px] text-ink-500">{officer.caption}</p>
      </div>
      <button
        type="button"
        onClick={() => showToast()}
        aria-label={`Email ${officer.name}`}
        className="press flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-brand-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Mail aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
