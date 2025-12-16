import type { Post } from "../../generated/graphql";

export default function CardDescriptions({ post }: { post: Post }) {
  return (
    <div className="px-4 pb-4 z-20">
      <p className="text-base md:text-lg text-slate-300 mb-2">
        {post.startDescription}
      </p>

      {post.endDescription && (
        <p className="italic text-sm text-slate-400">{post.endDescription}</p>
      )}
    </div>
  );
}
