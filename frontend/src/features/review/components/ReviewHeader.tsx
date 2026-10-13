export default function ReviewHeader() {
  return (
    <header className="border-b border-divider bg-surface px-4 pb-10 pt-[calc(var(--nav-height)+2.5rem)] text-center sm:px-6 sm:pb-14 sm:pt-[calc(var(--nav-height)+3.5rem)]">
      <p className="atlas-eyebrow">Moderation workspace</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-content sm:text-4xl lg:text-5xl">Review Suggestions</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-content-muted sm:text-base">Compare proposed changes, verify sources, and resolve community submissions.</p>
    </header>
  );
}
