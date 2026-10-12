export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-canvas" />
      <div className="absolute inset-x-0 top-0 h-[70dvh] bg-[radial-gradient(circle_at_75%_5%,rgba(214,173,104,0.12),transparent_38%),radial-gradient(circle_at_15%_25%,rgba(80,116,122,0.16),transparent_42%)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}
