import { Outlet } from "react-router";
import Nav from "../components/ui/Nav";
import Background from "../components/ui/Background";

export default function RootLayout() {
  return (
    <div data-app-root className="relative min-h-screen w-full bg-canvas text-content">
      <a
        href="#main-content"
        className="fixed left-4 top-2 z-[100] -translate-y-20 rounded-md bg-accent px-4 py-2 font-semibold text-on-accent transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Background />
      <Nav />
      <div id="main-content" className="relative z-10 w-full pt-[var(--nav-height)]">
        <Outlet />
      </div>
    </div>
  );
}
