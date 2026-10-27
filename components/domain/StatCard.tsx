import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import { cn } from "@/lib/cn";

type StatCardProps = {
  eyebrow: string;
  chip?: { tone: React.ComponentProps<typeof Chip>["tone"]; label: string };
  tile?: { tone: React.ComponentProps<typeof IconTile>["tone"]; icon: React.ReactNode };
  value: React.ReactNode;
  valueSize?: "lg" | "md";
  sub?: React.ReactNode;
  footer?: { left: React.ReactNode; right?: React.ReactNode };
};

/** Dashboard / Class Details stat card (spec 8.5). */
export function StatCard({ eyebrow, chip, tile, value, valueSize = "lg", sub, footer }: StatCardProps) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] leading-[14px] font-bold tracking-[0.06em] text-ink-400 uppercase">{eyebrow}</p>
        {chip && <Chip tone={chip.tone}>{chip.label}</Chip>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div
          className={cn(
            "min-w-0 font-extrabold text-ink-900",
            valueSize === "lg" ? "text-[28px] leading-9 tracking-tight" : "text-xl leading-7",
          )}
        >
          {value}
        </div>
        {tile && <IconTile tone={tile.tone}>{tile.icon}</IconTile>}
      </div>

      {sub && <p className="mt-1.5 text-[13px] text-ink-500">{sub}</p>}

      {footer && (
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-edge pt-3 text-[13px]">
          <span className="flex min-w-0 items-center gap-1.5 text-ink-500 [&>svg]:h-4 [&>svg]:w-4">{footer.left}</span>
          {footer.right && <span className="shrink-0 font-semibold">{footer.right}</span>}
        </div>
      )}
    </Card>
  );
}
