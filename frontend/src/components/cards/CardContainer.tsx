type CardContainerProps = {
  children: React.ReactNode;
  significant?: boolean;
};

export default function CardContainer({
  children,
  significant,
}: CardContainerProps) {
  return (
    <article
      className={`w-full card h-full bg-gradient-to-br from-card-primary to-card-secondary flex flex-col overflow-hidden border p-5 sm:p-6 space-y-4 sm:space-y-6 ${
        significant ? "border-gold border-2" : "border-stone-700"
      }`}
    >
      {children}
    </article>
  );
}
