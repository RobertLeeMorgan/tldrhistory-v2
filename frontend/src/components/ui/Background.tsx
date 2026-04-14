import bg from "../../assets/bg-home.webp";

export default function Background() {
  return (
    <>
      <img
        src={bg}
        alt="Era background"
        className="fixed inset-0 min-h-screen object-cover object-top-right z-0"
        fetchPriority="high"
      />
      <div className="fixed inset-0 bg-overlay/35 z-0 min-h-screen" />
    </>
  );
}
