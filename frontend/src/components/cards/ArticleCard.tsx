import type { Post } from "../../generated/graphql";
import CardDescriptions from "./CardDescriptions";
import CardFooter from "./CardFooter";
import CardSubjects from "./CardSubjects";
import CardHeader from "./CardHeader";
import { ICON_MAP } from "../../icons/iconMap";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const icon = post.group?.icon;
  const IconComponent = icon ? ICON_MAP[icon] : undefined;

  return (
    <article
      className={`w-full card bg-base-300 shadow-xl flex flex-col overflow-hidden border ${
        post.startSignificance === 1 ? "border-yellow-300" : "border-base-300"
      }`}
    >
      {IconComponent && (
        <IconComponent className="h-70 w-70 -right-8 -bottom-8 absolute text-base-200 z-0" />
      )}
      <CardHeader post={post} />

      {/* Description */}
      <CardDescriptions post={post} />

      {/* Subjects */}
      <div className="flex my-1 items-center mt-auto z-20 pl-4">
        <CardSubjects subjects={post.subjects} />
        <CardFooter post={post} />
      </div>
    </article>
  );
}
