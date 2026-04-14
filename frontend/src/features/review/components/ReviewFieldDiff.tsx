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
      <div>
        <p className="text-stone-400 text-sm font-semibold">{label}:</p>
        <p className="text-stone-200 text-base">{render(to)}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-stone-400 text-sm font-semibold">
        {label} <span className="text-gold text-sm">(changed)</span>
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-stone-400 text-sm line-through">{render(from)}</p>
        <p className="text-stone-200 text-base">{render(to)}</p>
      </div>
    </div>
  );
}
