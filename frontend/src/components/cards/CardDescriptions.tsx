import type { Post } from "../../generated/graphql";
import { ICON_MAP } from "../../icons/iconMap";

export default function CardDescriptions({ post }: { post: Post }) {
  const imageSrc = post.cdnId
    ? `https://cdn.tldrhistory.xyz/${post.cdnId}`
    : post.imageUrl;
  const hasImage = Boolean(imageSrc);

  const icon = post.group?.icon;
  const IconComponent = icon ? ICON_MAP[icon] : undefined;

  return (
    <div className="z-20 ">
      {hasImage ? (
        <img
          src={imageSrc!}
          alt={post.name}
          className="float-right ml-4 max-w-32 max-h-32 object-cover rounded shadow-md"
          loading="eager"
        />
      ) : IconComponent ? (
        <IconComponent className="h-70 w-70 -right-8 -bottom-8 absolute text-stone-400/6 z-0" />
      ) : null}

      <p className="text-base md:text-lg text-stone-300">
        {post.startDescription}
      </p>
    </div>
  );
}
