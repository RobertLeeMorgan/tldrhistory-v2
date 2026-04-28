import { jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { C as CloseIcon } from "./server-build-Ce5HpZmf.js";
function ModalShell({
  open,
  onClose,
  children,
  panelClassName = "",
  overlayClassName = ""
}) {
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
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!mounted || !open) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: `fixed inset-0 z-[9999] flex items-center justify-center bg-stone-950/60 backdrop-blur-sm ${overlayClassName}`,
        onClick: onClose,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        children: /* @__PURE__ */ jsx(
          motion.div,
          {
            className: `relative m-2 sm:m-4 max-h-[95vh] w-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl shadow-xl p-4 sm:p-6 ${panelClassName}`,
            onClick: (e) => e.stopPropagation(),
            initial: { scale: 0.85, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.85, opacity: 0 },
            transition: { duration: 0.25, ease: "easeOut" },
            children
          }
        )
      }
    ),
    document.body
  );
}
function ModalCloseButton({ onClose }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: "absolute top-4 right-4 text-stone-500 hover:text-gold text-xl z-50",
      onClick: onClose,
      "aria-label": "Close modal",
      type: "button",
      children: /* @__PURE__ */ jsx(CloseIcon, {})
    }
  );
}
export {
  ModalShell as M,
  ModalCloseButton as a
};
