import type { Post } from "../../generated/graphql";

export default function ModalDescription({ post }: { post: Post }) {
  return (
    <div className="space-y-4 text-base leading-8 text-content sm:text-lg">
      <p>
        {post.startDescription}
      </p>

      {post.endDescription && (
        <p className="text-content-muted">{post.endDescription}</p>
      )}
    </div>
  );
}
