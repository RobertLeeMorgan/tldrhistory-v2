import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Post, TimelineQueryVariables } from "../../../generated/graphql";
import { useAuth } from "../../../context/AuthContext";
import { timelineInfiniteQueryOptions } from "./timelineQuery";
import type { timelineLoader } from "./timelineLoader";
import { useLoaderData } from "react-router";

interface UseTimelineOptions {
  filter?: TimelineQueryVariables["filter"];
}

const EMPTY_POSTS: Post[] = [];

export default function useTimeline({ filter }: UseTimelineOptions = {}) {
  const { isAuth } = useAuth();
   const viewerKey = isAuth.id != null ? String(isAuth.id) : "anonymous";

  const { initialData } = useLoaderData() as Awaited<
    ReturnType<typeof timelineLoader>
  >;

  const query = useInfiniteQuery({
    ...timelineInfiniteQueryOptions({
      filter,
      viewerKey,
    }),
initialData:
  viewerKey === "anonymous" && initialData
    ? {
        pages: [initialData],
        pageParams: [null],
      }
    : undefined,
    placeholderData: keepPreviousData
    // (previousData, previousQuery) => {
    //   const previousKey = previousQuery?.queryKey as
    //     | readonly [
    //         string,
    //         string,
    //         TimelineQueryVariables["filter"] | null,
    //         string,
    //       ]
    //     | undefined;

    //   const previousFilter = previousKey?.[2] ?? null;
    //   const previousViewerKey = previousKey?.[3];
    //   const currentFilter = filter ?? null;

    //   const isSameFilter =
    //     JSON.stringify(previousFilter) === JSON.stringify(currentFilter);

    //   const isViewerTransition =
    //     previousViewerKey === "anonymous" && viewerKey !== "anonymous";

    //   const isSameViewer = previousViewerKey === viewerKey;

    //   return isSameFilter && (isSameViewer || isViewerTransition)
    //     ? previousData
    //     : undefined;
    // }
    ,
    staleTime: 30_000,
    refetchOnMount: viewerKey === "anonymous" ? false : "always",
  });

  const posts = useMemo(
    () => query.data?.pages.flatMap((page) => page.posts) ?? EMPTY_POSTS,
    [query.data],
  );

  return {
    posts,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}
