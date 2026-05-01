import Nav from "../components/ui/Nav";
import Background from "../components/ui/Background";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-screen w-full relative">
      <Background />
      <Nav />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  );
}