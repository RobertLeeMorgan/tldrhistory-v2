import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import { DELETE_POST } from "../graphql/mutations";

export function useDeletePost(onClose: () => void) {
  const { isAuth } = useAuth();
  const queryClient = useQueryClient();

  const currentUser = isAuth?.id
    ? { id: Number(isAuth.id), role: isAuth.role }
    : null;

  const { mutate, isPending } = useMutation({
    mutationFn: async (postId: number) => {
      const res = await api.post("", { query: DELETE_POST, variables: { id: postId }});
      if (res.data.errors) throw new Error(res.data.errors[0].message);
      return postId;
    },
    onSuccess: () => {
      toast.success("Post deleted");

      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      onClose();
    },
    onError: (err: any) => toast.error(err.message),
  });

  return {
    isPending,
    canDelete: currentUser?.role === "ADMIN",
    delete: mutate,
  };
}
