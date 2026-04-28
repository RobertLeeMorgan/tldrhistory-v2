type HeaderProps = {
  children: React.ReactNode;
};

export default function HeaderContainer({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 shadow-lg shadow-stone-950/30 backdrop-blur-sm overflow-hidden border-b border-stone-800 sm:h-[var(--header-height-sm)] md:h-[var(--header-height-md)] lg:h-[var(--header-height-lg)] w-full px-2 h-[8rem]">
      <img
        src="/bg-home.webp"
        alt="Era background"
        className="absolute inset-0 w-full h-full object-cover object-top"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-overlay/56" />
      {children}
    </header>
  );
}
