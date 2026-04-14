type StatBlockProps = {
  title: string;
  description?: string;
  figure?: React.ReactNode;
  children: React.ReactNode;
};

export function StatBlock({
  title,
  description,
  figure,
  children,
}: StatBlockProps) {
  return (
    <div className="stat p-3 xs:px-5 sm:px-4 lg:px-6 space-y-1 place-content-start sm:place-content-evenly items-start sm:items-center">
      {figure && (
        <div className="stat-figure text-gold/95 hidden sm:block">
          {figure}
        </div>
      )}

      <div className="stat-title text-stone-400 truncate self-end md:text-base">
        {title}
      </div>

      <div className="text-gold/95 font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl truncate">
        {children}
      </div>

      {description && (
        <div className="stat-desc truncate self-start text-stone-400 md:text-base">
          {description}
        </div>
      )}
    </div>
  );
}