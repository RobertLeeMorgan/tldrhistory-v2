export default function Skeleton() {
  return (
    <div className="card bg-gradient-to-br from-card-primary to-card-secondary shadow-xl shadow-stone-950/40 border border-stone-700 w-full">
      <div className="card-body w-full px-5 gap-4">
        {/* Title */}
        <div className="skeleton bg-stone-500/70 h-7 w-[70%]" />

        {/* Subheader */}
        <div className="skeleton bg-stone-500/70 h-5 w-[40%] mb-4" />

        {/* Content */}
        <div className="flex gap-4 items-start mb-2">
          {/* Text */}
          <div className="flex-1 space-y-3">
            <div className="skeleton bg-stone-500/70 h-5 w-full" />
            <div className="skeleton bg-stone-500/70 h-5 w-full" />
            <div className="skeleton bg-stone-500/70 h-5 w-full" />
            <div className="skeleton bg-stone-500/70 h-5 w-full" />
            <div className="skeleton bg-stone-500/70 h-5 w-[60%]" />
          </div>

          {/* Image */}
          <div className="skeleton bg-stone-500/70 w-32 h-32 rounded shrink-0" />

          
        </div>
        <div className="flex space-x-4">
            <div className="skeleton bg-stone-500/70 h-5 w-[20%]" />
            <div className="skeleton bg-stone-500/70 h-5 w-[20%]" />
          </div>
      </div>
    </div>
  );
}
