import { ContextSwap } from "../../../components/ui/AnimatedValue";

type CompactStatProps = {
  title: string;
  value: React.ReactNode;
  transitionKey: React.Key;
  description?: string;
  imageSrc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
};

export default function CompactStat({
  title,
  value,
  transitionKey,
  description,
  imageSrc,
  icon: Icon,
  isLoading = false,
}: CompactStatProps) {
  return (
    <section className="min-w-0 px-3 py-3 sm:px-4">
      <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.12em] text-content-muted">{title}</p>
      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        <p className="min-w-0 flex-1 truncate font-serif text-lg font-semibold text-content">
          {isLoading ? <span className="loading loading-spinner loading-sm" aria-label="Loading" /> : (
            <ContextSwap transitionKey={transitionKey}>{value}</ContextSwap>
          )}
        </p>
        {!isLoading && (imageSrc || Icon) && (
          <ContextSwap transitionKey={`${String(transitionKey)}-media`} className="shrink-0">
            {imageSrc ? (
              <img src={imageSrc} alt="" className="size-8 rounded-full object-cover" loading="lazy" />
            ) : Icon ? (
              <Icon className="size-8 text-accent" />
            ) : null}
          </ContextSwap>
        )}
      </div>
      {description && <p className="mt-1 truncate text-xs text-content-muted">{description}</p>}
    </section>
  );
}
