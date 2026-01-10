import { useEffect } from "react";
import type { Post } from "../../generated/graphql";
import { useDeletePost } from "../../hooks/useDeletePost";
import Actions from "./ModalActions";
import CardFooter from "../cards/CardFooter";
import ModalHeader from "./ModalHeader";
import ModalDescription from "./ModalDescription";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
}

export default function PostModal({ open, post, onClose }: PostModalProps) {
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

  const deleteMutation = useDeletePost(onClose);

  if (!open || !post || !modalRoot) return null;

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
        className="w-full max-w-2xl bg-base-200 rounded-xl shadow-xl p-1 sm:p-6 relative m-4 max-h-[98vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 text-xl"
            onClick={onClose}
          >
            ✕
          </button>

          <ModalHeader post={post} />
          <ModalDescription post={post} />

          <div className="flex overflow-y-auto my-1 items-center mt-auto">
            <p className="px-4 italic text-md text-slate-300">
              by{" "}
              <Link to={`/user/${post.user.id}`}>
                <span className="text-primary text-lg not-italic">
                  {post.user.username}
                </span>
              </Link>
            </p>
            <CardFooter post={post} />
          </div>

          <Actions
            post={post}
            deleteMutation={deleteMutation}
            onClose={onClose}
          />
        </div>
      </motion.div>
    </motion.div>,
    modalRoot
  );
}
