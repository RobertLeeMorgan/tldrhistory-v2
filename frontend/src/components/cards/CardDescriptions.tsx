import { useState } from "react";
import type { Post } from "../../generated/graphql";
import { ICON_MAP } from "../../icons/iconMap";

export default function CardDescriptions({ post }: { post: Post }) {
  const imageSrc = post.cdnId
    ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
    : post.imageUrl;
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const hasImage = Boolean(imageSrc) && imageSrc !== failedImageSrc;

  const icon = post.group?.icon;
  const IconComponent = icon ? ICON_MAP[icon] : undefined;

  return (
    <div className="relative z-10 space-y-4">
      {hasImage ? (
        <div className="aspect-[16/10] overflow-hidden rounded-xl border border-divider bg-canvas/60">
          <img
            src={imageSrc!}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
            onError={() => setFailedImageSrc(imageSrc ?? null)}
          />
        </div>
      ) : IconComponent ? (
        <div className="flex aspect-[16/7] items-center justify-center overflow-hidden rounded-xl border border-divider/70 bg-canvas/35" aria-hidden="true">
          <IconComponent className="h-24 w-24 text-accent/20" />
        </div>
      ) : null}

      <p className="text-base leading-7 text-content-muted">
        {post.startDescription}
      </p>
    </div>
  );
}
