import Nav from "../components/ui/Nav";
import { motion } from "framer-motion";
import Background from "../components/ui/Background";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="min-h-screen w-full relative">
      <Background />
      <Nav />
      <motion.div
        className="flex-1 relative z-10 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
         <Outlet />
      </motion.div>
    </div>
  );
}