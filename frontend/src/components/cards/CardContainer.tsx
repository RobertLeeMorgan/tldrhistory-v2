type CardContainerProps = {
  children: React.ReactNode;
  significant?: boolean;
  onClick?: () => void;
};

export default function CardContainer({
  children,
  significant,
  onClick,
}: CardContainerProps) {
  return (
    <article
      onClick={onClick}
      className={`group/card relative flex w-full flex-col gap-5 overflow-hidden rounded-2xl border bg-surface-raised p-5 shadow-[0_16px_42px_rgba(0,0,0,0.24)] transition-[border-color,box-shadow,transform] duration-200 sm:p-6 ${
        significant
          ? "border-accent shadow-[0_18px_48px_rgba(185,133,57,0.14)]"
          : "border-divider hover:border-control"
      }`}
    >
      {significant && (
        <div className="-mx-6 -mt-6 h-1 bg-gradient-to-r from-accent-strong via-accent to-accent-strong" aria-hidden="true" />
      )}
      {children}
    </article>
  );
}
