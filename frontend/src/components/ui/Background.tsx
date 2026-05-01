export default function Background() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/bg-home.webp"
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-0 h-[100lvh] max-w-none object-cover object-right-top"
        />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-overlay/35" />
    </>
  );
}