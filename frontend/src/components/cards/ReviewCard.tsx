import type { Post } from "../../generated/graphql";
import CardDescriptions from "./CardDescriptions";
import CardSubjects from "./CardSubjects";
import CardHeader from "./CardHeader";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="w-full card bg-base-100 shadow-xl">
      <CardHeader post={post} />

      {/* DESCRIPTION */}
      <CardDescriptions post={post} />

      {/* Subjects */}
      <CardSubjects subjects={post.subjects} />
      <div className="pl-4 py-4">
        <div className="font-semibold text-base md:text-lg pt-2 text-slate-300">
          Type: <span>{post.type}</span>
        </div>
        {post.group?.name && (
          <>
            <div className="font-semibold text-base md:text-lg pt-2 text-slate-300 block">
              Group: <span>{post.group?.name}</span>
            </div>
          </>
        )}

        <p className="text-base md:text-lg pt-2 text-slate-300">
          {post.sourceUrl}
        </p>
        <p className="text-base md:text-lg pt-2 text-slate-300">
          {post.imageCredit}
        </p>
      </div>
    </article>
  );
}
