import { queryOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { USER_POSTS, USER_LIKES, USER_STATS } from "../../../graphql/queries";
import type {
  UserPostsQuery,
  UserPostsQueryVariables,
  UserLikesQuery,
  UserLikesQueryVariables,
  UserStatsQuery,
  UserStatsQueryVariables,
} from "../../../generated/graphql";

export function useUserPostsQuery(
  variables: UserPostsQueryVariables,
  options?: Omit<UseQueryOptions<UserPostsQuery>, "queryKey" | "queryFn">
) {
  return useQuery<UserPostsQuery>({
    queryKey: ["userPosts", variables.userId],
    queryFn: () =>
      graphqlRequest<UserPostsQuery, UserPostsQueryVariables>(USER_POSTS, variables),
    staleTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    ...options,
  });
}

export function useUserLikesQuery(
  variables: UserLikesQueryVariables,
  options?: Omit<UseQueryOptions<UserLikesQuery>, "queryKey" | "queryFn">
) {
  return useQuery<UserLikesQuery>({
    queryKey: ["userLikes", variables.userId],
    queryFn: () =>
      graphqlRequest<UserLikesQuery, UserLikesQueryVariables>(USER_LIKES, variables),
    staleTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    ...options,
  });
}

export function getUserStatsQueryOptions(variables: UserStatsQueryVariables) {
  return queryOptions({
    queryKey: ["userStats", variables.userId],
    queryFn: () =>
      graphqlRequest<UserStatsQuery, UserStatsQueryVariables>(
        USER_STATS,
        variables
      ),
    staleTime: 1000 * 60 * 30,
  });
}

export function useUserStatsQuery(variables: UserStatsQueryVariables) {
  return useQuery({
    ...getUserStatsQueryOptions(variables),
    placeholderData: (prev) => prev,
  });
}