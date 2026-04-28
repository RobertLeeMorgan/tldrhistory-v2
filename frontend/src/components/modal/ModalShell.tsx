import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  overlayClassName?: string;
}

export default function ModalShell({
  open,
  onClose,
  children,
  panelClassName = "",
  overlayClassName = "",
}: ModalShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <motion.div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-stone-950/60 backdrop-blur-sm ${overlayClassName}`}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`relative m-2 sm:m-4 max-h-[95vh] w-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl shadow-xl p-4 sm:p-6 ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}