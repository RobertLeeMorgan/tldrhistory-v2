export default function Skeleton() {
  return (
    <div className="card bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 shadow-xl shadow-black/40 border border-neutral-700 w-full">
      <div className="card-body w-full px-5 gap-4">
        <div className="grid grid-cols-[120px_1fr] gap-6">
          <div className="skeleton bg-neutral-600 h-40 w-full" />
          <div className="space-y-3">
            <div className="skeleton bg-neutral-600 h-8 w-full" />
            <div className="skeleton bg-neutral-600 h-8 w-full" />
            <div className="skeleton bg-neutral-600 h-8 w-full" />
            <div className="skeleton bg-neutral-600 h-8 w-full" />
          </div>
        </div>

        <div className="skeleton bg-neutral-600 h-8 w-full" />
        <div className="skeleton bg-neutral-600 h-8 w-full" />
        <div className="skeleton bg-neutral-600 h-8 w-full" />
        <div className="skeleton bg-neutral-600 h-8 w-[50%]" />
      </div>
    </div>
  );
}
