export default function Background() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-no-repeat bg-right-top"
        style={{ backgroundImage: `url("/bg-home.webp")` }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-overlay/35" />
    </>
  );
}