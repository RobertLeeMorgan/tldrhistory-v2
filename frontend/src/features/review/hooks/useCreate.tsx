import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { CREATE_POST_SUGGESTION_MUTATION, APPROVE_CREATED_POST_MUTATION, REJECT_CREATED_POST_MUTATION } from "../../../graphql/mutations";
import type {
  CreatePostSuggestionMutation,
  CreatePostSuggestionMutationVariables,
} from "../../../generated/graphql";

export function useCreatePostSuggestionMutation() {
  return useMutation<CreatePostSuggestionMutation, Error, CreatePostSuggestionMutationVariables>({
    mutationFn: (variables) =>
      graphqlRequest<CreatePostSuggestionMutation, CreatePostSuggestionMutationVariables>(
        CREATE_POST_SUGGESTION_MUTATION,
        variables,
      ),
  });
}

export function useApproveCreatedPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      graphqlRequest(APPROVE_CREATED_POST_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingCreatedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useRejectCreatedPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      graphqlRequest(REJECT_CREATED_POST_MUTATION, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingCreatedPosts"] });
    },
  });
}