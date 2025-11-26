import { useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELETE_POST } from "../graphql/mutations";

export default function PostModal({ open, post, onClose, onDeleted }: any) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const currentUser = isAuth?.id
    ? { id: Number(isAuth.id), username: isAuth.username, role: isAuth.role }
    : null;

  // Delete Post
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await api.post("", {
        query: DELETE_POST,
        variables: { id: postId },
      });

      if (res.data.errors) {
        throw new Error(res.data.errors[0].message);
      }

      return postId;
    },

    onSuccess: (deletedId) => {
      toast.success("Post deleted");

      onClose();
      onDeleted(deletedId);

      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },

    onError: (err: any) => {
      toast.error(err.message || "Failed to delete");
    },
  });

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

  if (!open || !post) return null;

  // Suggest Edit
  const handleSuggestEdit = () => {
    if (!currentUser) return navigate("/login");
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = () => {
    if (!currentUser || currentUser.role !== "ADMIN") return;
    if (!confirm("Are you sure you want to delete this post?")) return;
    deleteMutation.mutate(Number(post.id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6 relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <ArticleCard post={post} />

        <div className="mt-6 flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={handleSuggestEdit}>
            Suggest Edit
          </button>

          {currentUser?.role === "ADMIN" && (
            <button
              className={`btn btn-error ${
                deleteMutation.isPending ? "btn-disabled" : ""
              }`}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete Post"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
