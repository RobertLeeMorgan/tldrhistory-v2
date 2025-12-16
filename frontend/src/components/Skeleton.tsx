export default function Skeleton() {
  return (
    <div className="card bg-base-300 shadow-xl w-full">
      <div className="card-body w-full px-8 gap-4">
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <div className="skeleton bg-base-100 h-40 w-full" />
          <div className="space-y-2">
            <div className="skeleton bg-base-100 h-8 w-full" />
            <div className="skeleton bg-base-100 h-8 w-full" />
            <div className="skeleton bg-base-100 h-8 w-full" />
            <div className="skeleton bg-base-100 h-8 w-full" />
          </div>
        </div>

        <div className="skeleton bg-base-100 h-8 w-full" />
        <div className="skeleton bg-base-100 h-8 w-full" />
        <div className="skeleton bg-base-100 h-8 w-full" />
        <div className="skeleton bg-base-100 h-8 w-10" />
      </div>
    </div>
  );
}
