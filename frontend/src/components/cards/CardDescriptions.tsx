import type { Post } from "../../generated/graphql";

export default function CardDescriptions({ post }: { post: Post }) {
  return (
    <p className="relative z-10 text-[0.95rem] leading-6 text-content-muted sm:text-base sm:leading-7">
      {post.startDescription}
    </p>
  );
}
