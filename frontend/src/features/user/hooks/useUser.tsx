import { queryOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { USER_POSTS, USER_LIKES, USER_STATS } from "../../../graphql/queries";
import { useAuth } from "../../../context/AuthContext";
import type {
  UserPostsQuery,
  UserPostsQueryVariables,
  UserLikesQuery,
  UserLikesQueryVariables,
  UserStatsQuery,
  UserStatsQueryVariables,
} from "../../../generated/graphql";

type UserStatsQueryOptionsArgs = UserStatsQueryVariables & {
  apiOrigin?: string;
};

export function fetchUserStats(variables: UserStatsQueryVariables, apiOrigin?: string) {
  return graphqlRequest<UserStatsQuery, UserStatsQueryVariables>(USER_STATS, variables, apiOrigin);
}

export function useUserPostsQuery(
  variables: UserPostsQueryVariables,
  options?: Omit<UseQueryOptions<UserPostsQuery>, "queryKey" | "queryFn">
) {
  const { isAuth } = useAuth();
  return useQuery<UserPostsQuery>({
    queryKey: ["userPosts", variables.userId, isAuth.id ?? "anonymous"],
    queryFn: () =>
      graphqlRequest<UserPostsQuery, UserPostsQueryVariables>(USER_POSTS, variables),
    staleTime: 1000 * 60 * 30,
    ...options,
  });
}

export function useUserLikesQuery(
  variables: UserLikesQueryVariables,
  options?: Omit<UseQueryOptions<UserLikesQuery>, "queryKey" | "queryFn">
) {
  const { isAuth } = useAuth();
  return useQuery<UserLikesQuery>({
    queryKey: ["userLikes", variables.userId, isAuth.id ?? "anonymous"],
    queryFn: () =>
      graphqlRequest<UserLikesQuery, UserLikesQueryVariables>(USER_LIKES, variables),
    staleTime: 1000 * 60 * 30,
    ...options,
  });
}

export function getUserStatsQueryOptions({
  apiOrigin,
  ...variables
}: UserStatsQueryOptionsArgs) {
  return queryOptions({
    queryKey: ["userStats", variables.userId],
    queryFn: () => fetchUserStats(variables, apiOrigin),
    staleTime: 1000 * 60 * 30,
  });
}

export function useUserStatsQuery(variables: UserStatsQueryVariables, initialData?: UserStatsQuery) {
  return useQuery({
    ...getUserStatsQueryOptions(variables),
    initialData,
  });
}
