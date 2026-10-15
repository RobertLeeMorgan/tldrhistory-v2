import { useState } from "react";
import type { Post } from "../../generated/graphql";

export default function CardMedia({ post }: { post: Post }) {
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  const cdnId = post.cdnId?.trim();
  const imageUrl = post.imageUrl?.trim();

  const imageSrc = cdnId
    ? `https://cdn.tldrhistory.xyz/${cdnId}`
    : imageUrl;

  if (!imageSrc || imageSrc === failedImageSrc) return null;

  if (cdnId?.length === 0 && imageUrl?.length === 0) return null;

  return (
    <div className="max-h-48 sm:max-h-68 w-full overflow-hidden bg-canvas/55">
      <img
        src={imageSrc}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setFailedImageSrc(imageSrc)}
      />
    </div>
  );
}
