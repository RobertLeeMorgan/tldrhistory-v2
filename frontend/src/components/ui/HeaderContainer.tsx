import bg from "../../assets/bg-home.webp";

type HeaderProps = {
  children: React.ReactNode;
  timeline?: boolean;
};

export default function HeaderContainer({ children, timeline }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 shadow-lg shadow-stone-950/30 backdrop-blur-sm overflow-hidden border-b border-stone-800 h-[6.2rem] sm:h-[var(--header-height-sm)] md:h-[var(--header-height-md)] lg:h-[var(--header-height-lg)] w-full px-5">
      {timeline && (
        <h1 className="sr-only">Interactive Human History Timeline</h1>
      )}
      <img
        src={bg}
        alt="Era background"
        className="absolute inset-0 w-full h-full object-cover object-top blur-[1px]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-overlay/56" />
      {children}
    </header>
  );
}
