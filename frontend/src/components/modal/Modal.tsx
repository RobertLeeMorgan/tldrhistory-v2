import { useEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open || !modalRoot) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-neutral-900 rounded-xl shadow-xl sm:p-6 relative m-4 max-h-[98vh] justify-center items-center flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button
          className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 text-xl"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="overflow-auto">{children}</div>
      </motion.div>
    </motion.div>,
    modalRoot
  );
}