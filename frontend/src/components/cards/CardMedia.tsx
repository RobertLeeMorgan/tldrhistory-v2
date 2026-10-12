import { useState } from "react";
import type { Post } from "../../generated/graphql";

export default function CardMedia({ post }: { post: Post }) {
  const imageSrc = post.cdnId
    ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
    : post.imageUrl;
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  if (!imageSrc || imageSrc === failedImageSrc) return null;

  return (
    <div className="aspect-[16/9] w-full overflow-hidden bg-canvas/55">
      <img
        src={imageSrc}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailedImageSrc(imageSrc)}
      />
    </div>
  );
}
