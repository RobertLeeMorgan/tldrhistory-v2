type HeaderProps = {
  children: React.ReactNode;
};

export default function HeaderContainer({ children }: HeaderProps) {
  return (
    <header
      className="
        fixed top-0 left-0 w-full z-40
        shadow-lg shadow-stone-950/30
        backdrop-blur-sm overflow-hidden border-b border-stone-800
        h-[8rem]
        sm:h-[var(--header-height-sm)]
        md:h-[var(--header-height-md)]
        lg:h-[var(--header-height-lg)]
      "
    >
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