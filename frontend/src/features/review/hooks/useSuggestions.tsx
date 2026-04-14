import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import {
  GET_FORM_LISTS,
  GET_POST,
  PENDING_CREATED_POSTS_QUERY,
  PENDING_EDITS_QUERY,
  PENDING_STATS_QUERY,
} from "../../../graphql/queries";
import type {
  GetPostWithFormListsQueryVariables,
  GetPostWithFormListsQuery,
  PendingEditsQuery,
  GetFormListsQuery,
  PendingCreatedPostsQuery,
  PendingStatsQuery,
} from "../../../generated/graphql";

export function usePostQuery(variables: GetPostWithFormListsQueryVariables) {
  return useQuery<GetPostWithFormListsQuery, Error>({
    queryKey: ["post", variables],
    queryFn: () =>
      graphqlRequest<
        GetPostWithFormListsQuery,
        GetPostWithFormListsQueryVariables
      >(GET_POST, variables),
  });
}

export function usePendingEdits() {
  return useQuery<PendingEditsQuery["pendingEdits"], Error>({
    queryKey: ["pendingEdits"],
    queryFn: async () => {
      const response =
        await graphqlRequest<PendingEditsQuery>(PENDING_EDITS_QUERY);
      return response.pendingEdits;
    },
  });
}

export function usePendingStats() {
  return useQuery<
    PendingStatsQuery["pendingStats"], // or wherever you generated the type
    Error
  >({
    queryKey: ["pendingStats"],
    queryFn: async () => {
      const data = await graphqlRequest<PendingStatsQuery>(PENDING_STATS_QUERY);
      return data.pendingStats;
    },
  });
}

export function useFormListsQuery() {
  return useQuery<GetFormListsQuery["formLists"], Error>({
    queryKey: ["formLists"],
    queryFn: async () => {
      const response = await graphqlRequest<GetFormListsQuery>(GET_FORM_LISTS);
      return response.formLists;
    },
  });
}

export function usePendingCreatedPostsQuery() {
  return useQuery({
    queryKey: ["pendingCreatedPosts"],
    queryFn: async () => {
      const data = await graphqlRequest<PendingCreatedPostsQuery>(
        PENDING_CREATED_POSTS_QUERY,
      );
      return data.pendingCreatedPosts;
    },
  });
}
