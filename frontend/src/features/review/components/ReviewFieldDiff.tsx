interface ReviewFieldDiffProps<T> {
  label: string;
  from: T;
  to: T;
  render: (value: T) => React.ReactNode;
  isDiff: boolean;
}

export default function ReviewFieldDiff<T>({
  label,
  from,
  to,
  render,
  isDiff,
}: ReviewFieldDiffProps<T>) {
  if (!isDiff) {
    return (
      <div className="rounded-lg border border-divider/70 bg-canvas/25 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-content-muted">{label}</p>
        <div className="mt-1 break-words text-sm text-content">{render(to)}</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-accent/45 bg-accent/8 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-content-muted">
        {label} <span className="ml-1 text-accent">Changed</span>
      </p>
      <div className="mt-2 grid gap-2">
        <div className="break-words text-sm text-content-muted line-through">{render(from)}</div>
        <div className="break-words border-l-2 border-accent pl-3 text-sm text-content">{render(to)}</div>
      </div>
    </div>
  );
}
