import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import { DELETE_POST } from "../graphql/mutations";

export function useDeletePost(onClose: () => void) {
  const { isAuth } = useAuth();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const currentUser = isAuth?.id
    ? { id: Number(isAuth.id), role: isAuth.role }
    : null;

  const { mutate, isPending } = useMutation({
    mutationFn: async (postId: number) => {
      const res = await api.post("", {
        query: DELETE_POST,
        variables: { id: postId },
      });
      if (res.data.errors) throw new Error(res.data.errors[0].message);
      return postId;
    },
    onSuccess: () => {
      addToast({ message: "Post deleted", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      onClose();
    },
    onError: (err: any) => addToast({ message: err.message, type: "error" }),
  });

  return {
    isPending,
    canDelete: currentUser?.role === "ADMIN",
    delete: mutate,
  };
}
