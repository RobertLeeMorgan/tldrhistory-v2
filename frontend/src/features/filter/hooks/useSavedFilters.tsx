import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import {
  SAVE_FILTER_MUTATION,
  EDIT_SAVED_FILTER_MUTATION,
  DELETE_SAVED_FILTER_MUTATION,
} from "../../../graphql/mutations";
import type {
  SaveFilterMutation,
  SaveFilterMutationVariables,
  EditSavedFilterMutation,
  EditSavedFilterMutationVariables,
  DeleteSavedFilterMutation,
  DeleteSavedFilterMutationVariables,
} from "../../../generated/graphql";

export function useSaveFilterMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    SaveFilterMutation,
    Error,
    SaveFilterMutationVariables
  >({
    mutationFn: (variables) =>
      graphqlRequest<SaveFilterMutation, SaveFilterMutationVariables>(
        SAVE_FILTER_MUTATION,
        variables,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savedFilters"] });
    },
  });
}

export function useEditSavedFilterMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    EditSavedFilterMutation,
    Error,
    EditSavedFilterMutationVariables
  >({
    mutationFn: (variables) =>
      graphqlRequest<EditSavedFilterMutation, EditSavedFilterMutationVariables>(
        EDIT_SAVED_FILTER_MUTATION,
        variables,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savedFilters"] });
    },
  });
}

export function useDeleteSavedFilterMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteSavedFilterMutation,
    Error,
    DeleteSavedFilterMutationVariables
  >({
    mutationFn: (variables) =>
      graphqlRequest<DeleteSavedFilterMutation, DeleteSavedFilterMutationVariables>(
        DELETE_SAVED_FILTER_MUTATION,
        variables,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savedFilters"] });
    },
  });
}