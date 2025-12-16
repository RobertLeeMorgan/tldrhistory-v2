import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import { SUGGEST_EDIT, APPROVE_EDIT_MUTATION,
  REJECT_EDIT_MUTATION, } from "../graphql/mutations";

export function useSuggestEditMutation() {
  return useMutation({
    mutationFn: ({ postId, input }: { postId: number; input: any }) => {
      return graphqlRequest(SUGGEST_EDIT, { postId, input });
    },
  });
}

export function useApproveEdit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      graphqlRequest(APPROVE_EDIT_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingEdits"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useRejectEdit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      graphqlRequest(REJECT_EDIT_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingEdits"] });
    },
  });
}
