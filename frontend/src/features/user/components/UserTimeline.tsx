import { useState } from "react";
import type { Post } from "../../../generated/graphql";
import { useUserPostsQuery, useUserLikesQuery } from "../hooks/useUser";
import ArticleCard from "../../timeline/components/TimelineCard";
import TabbedTimeline, {
  type TabConfig,
} from "../../../components/ui/TabbedTimeline";

type UserTab = "created" | "liked";

export default function UserTimeline({ userId }: { userId: number }) {
  const [activeTab, setActiveTab] = useState<UserTab>("created");

  const {
    data: createdPostsData,
    isLoading: isCreatedPostsLoading,
    isError: isCreatedPostsError,
  } = useUserPostsQuery({ userId });

  const {
    data: likedPostsData,
    isLoading: isLikedPostsLoading,
    isError: isLikedPostsError,
  } = useUserLikesQuery({ userId });

  const createdPosts: Post[] = (createdPostsData?.userPosts ?? []) as Post[];
  const likedPosts: Post[] = (likedPostsData?.userLikes.map((l) => l.post) ??[]) as Post[];

  const tabs: TabConfig<UserTab>[] = [
    {
      id: "created",
      label: "Created",
      count: createdPosts.length,
    },
    {
      id: "liked",
      label: "Liked",
      count: likedPosts.length,
    },
  ];

  const items = activeTab === "created" ? createdPosts : likedPosts;
  const isLoading =
    activeTab === "created" ? isCreatedPostsLoading : isLikedPostsLoading;
  const isError =
    activeTab === "created" ? isCreatedPostsError : isLikedPostsError;

  return (
    <TabbedTimeline
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      items={items}
      getItemKey={(post) => post.id}
      renderCard={(post) => <ArticleCard post={post} />}
      renderEmpty={(tab) => (
        <p className="min-h-[40vh] text-stone-800/86 text-shadow-sm">
          {tab === "created"
            ? "No articles created yet."
            : "No liked articles yet."}
        </p>
      )}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
