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
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ["timeline"] });

      const previous = queryClient.getQueryData<any>(["timeline"]);

      queryClient.setQueryData(["timeline"], (old: any) =>
        old?.filter((p: any) => p.id !== postId)
      );

      return { previous };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData(["timeline"], context?.previous);
      addToast({ message: _err.message, type: "error" });
    },
    onSuccess: (_postId) => {
      addToast({ message: "Post deleted", type: "success" });
      onClose();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });

  return {
    isPending,
    canDelete: currentUser?.role === "ADMIN",
    delete: mutate,
  };
}
