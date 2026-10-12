type StatsProps = {
  children: React.ReactNode;
};

export default function StatsContainer({ children }: StatsProps) {
  return (
    <aside className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Summary statistics">
      <div className="grid gap-3 sm:grid-cols-3">
        {children}
      </div>
    </aside>
  );
}
