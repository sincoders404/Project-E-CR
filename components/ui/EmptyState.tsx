/** Empty state for filtered lists (spec 11): icon tile + title + caption. */
export function EmptyState({
  icon,
  title,
  caption,
}: {
  icon: React.ReactNode;
  title: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-100 text-brand-700 [&>svg]:h-5 [&>svg]:w-5"
      >
        {icon}
      </span>
      <p className="mt-3 text-sm font-bold text-ink-900">{title}</p>
      <p className="mt-1 text-[13px] text-ink-500">{caption}</p>
    </div>
  );
}
