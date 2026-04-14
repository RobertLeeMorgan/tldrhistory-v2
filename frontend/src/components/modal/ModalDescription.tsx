import type { Post } from "../../generated/graphql";

export default function ModalDescription({ post }: { post: Post }) {
  return (
    <div className="space-y-2">
      <p className="md:text-lg text-stone-300">
        {post.startDescription}
      </p>

      {post.endDescription && (
        <p className="md:text-lg text-stone-400">{post.endDescription}</p>
      )}
    </div>
  );
}
