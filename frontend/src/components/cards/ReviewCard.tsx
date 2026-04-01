import type { Post } from "../../generated/graphql";
import CardDescriptions from "./CardDescriptions";
import CardSubjects from "./CardSubjects";
import CardHeader from "./CardHeader";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="w-full card bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 shadow-xl shadow-black/40 border border-stone-700">
      <CardHeader post={post} />

      {/* DESCRIPTION */}
      <CardDescriptions post={post} />

      <div className="pl-4 py-4">
        <div className="font-semibold md:text-lg pt-2 text-neutral-300">
          Type: <span>{post.type}</span>
        </div>
        {post.group?.name && (
          <>
            <div className="font-semibold md:text-lg pt-2 text-neutral-300 block">
              Group: <span>{post.group?.name}</span>
            </div>
          </>
        )}
        {post.civilisation && (
          <div className="font-semibold md:text-lg pt-2 text-neutral-300 block">
            Civilisation
          </div>
        )}

        <p className="md:text-lg pt-2 text-neutral-300">{post.sourceUrl}</p>
        <p className="md:text-lg pt-2 text-neutral-300">{post.imageCredit}</p>
      </div>
      <div className="flex my-1 items-center mb-4 z-20 pl-4">
        <CardSubjects subjects={post.subjects} />
      </div>
    </article>
  );
}
