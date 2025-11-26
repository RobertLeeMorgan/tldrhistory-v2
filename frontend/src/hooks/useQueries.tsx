import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import {
  GET_POST,
  GET_HEADLINE,
  PENDING_EDITS_QUERY,
} from "../graphql/queries";
import type {
  QueryGetPostArgs,
  QueryGetHeadlineArgs,
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

export function useHeadlineQuery(variables: QueryGetHeadlineArgs) {
  return useQuery<{ getHeadline: string | null }, Error>({
    queryKey: ["headline", variables],
    queryFn: () => graphqlRequest(GET_HEADLINE, variables),
    staleTime: 1000 * 60 * 15,
    placeholderData: (prev) => prev,
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