import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import {
  GET_POST,
  PENDING_EDITS_QUERY,
} from "../graphql/queries";
import type {
  QueryGetPostArgs,
  PostWithLists,
  PendingEditsQueryVariables,
  PendingEditsQuery,
  EditSuggestion,
} from "../generated/graphql";

interface GetPost {
  getPost: PostWithLists;
}

export function usePostQuery(variables: QueryGetPostArgs) {
  return useQuery<GetPost, Error>({
    queryKey: ["post", variables],
    queryFn: () => graphqlRequest<GetPost>(GET_POST, variables),
  });
}

export function usePendingEdits(variables?: PendingEditsQueryVariables) {
  return useQuery<EditSuggestion[]>({
    queryKey: ["pendingEdits", variables],
    queryFn: async () => {
      const response = await graphqlRequest<PendingEditsQueryVariables, PendingEditsQuery>(
        PENDING_EDITS_QUERY
      );
      return response.pendingEdits;
    },
  });
}