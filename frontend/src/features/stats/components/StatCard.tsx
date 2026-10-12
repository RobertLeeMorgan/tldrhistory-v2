type StatCardProps = {
  title: string;
  value?: string | number;
  description?: string;
  imageSrc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
  isNotFound?: boolean;
};

export default function StatCard({
  title,
  value,
  description,
  imageSrc,
  icon: Icon,
  isLoading = false,
  isNotFound = false,
}: StatCardProps) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-xl border border-divider bg-surface-raised p-4 shadow-lg shadow-black/15 sm:p-5">
      {(imageSrc || Icon) && (
        <div className="absolute bottom-3 right-3 text-accent/20" aria-hidden="true">
          {imageSrc ? (
            <img src={imageSrc} alt="" className="size-16 rounded-full object-cover opacity-35" loading="lazy" />
          ) : Icon ? (
            <Icon className="size-16" />
          ) : null}
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-[0.14em] text-content-muted">
        {title}
      </p>

      <p className="relative z-10 mt-2 truncate font-serif text-2xl font-bold text-content sm:text-3xl">
        {isLoading ? (
          <span className="loading loading-spinner loading-lg m-auto"></span>
        ) : isNotFound ? (
          "—"
        ) : (
          (value ?? "—")
        )}
      </p>

      {description && (
        <p className="relative z-10 mt-1 truncate text-sm text-content-muted">
          {description}
        </p>
      )}
    </section>
  );
}
