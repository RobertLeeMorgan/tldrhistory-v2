import type { Post } from "../../../generated/graphql";
import CardDescriptions from "../../../components/cards/CardDescriptions";
import CardFooter from "../../../components/cards/CardFooter";
import CardSubjects from "../../../components/cards/CardSubjects";
import CardHeader from "../../../components/cards/CardHeader";
import CardContainer from "../../../components/cards/CardContainer";
import CardMedia from "../../../components/cards/CardMedia";
import { LuBookmark } from "react-icons/lu";

interface ArticleCardProps {
  post: Post;
  onOpen?: () => void;
}

export default function ArticleCard({ post, onOpen }: ArticleCardProps) {
  return (
    <CardContainer flush {...(post.startSignificance === 1 && { significant: true })}>
      <CardMedia post={post} />
      <span
        className="absolute right-3 top-3 z-30 inline-flex size-9 items-center justify-center rounded-full border border-divider/70 bg-canvas/85 text-content-muted shadow-lg backdrop-blur-sm"
        title="Saved timelines coming soon"
        aria-label="Saved timelines coming soon"
      >
        <LuBookmark aria-hidden="true" className="size-4.5" />
      </span>

      <div className="space-y-3 p-4 sm:p-5">
        <div className="pr-8"><CardHeader post={post} onOpen={onOpen} /></div>
        <CardDescriptions post={post} />

        <div className="relative z-20 mt-auto flex items-center gap-2 border-t border-divider/70 pt-3">
          <CardSubjects subjects={post.subjects} />
          <CardFooter post={post} />
        </div>
      </div>
    </CardContainer>
  );
}
