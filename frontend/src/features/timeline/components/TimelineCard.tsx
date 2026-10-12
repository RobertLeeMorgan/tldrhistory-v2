import type { Post } from "../../../generated/graphql";
import CardDescriptions from "../../../components/cards/CardDescriptions";
import CardFooter from "../../../components/cards/CardFooter";
import CardSubjects from "../../../components/cards/CardSubjects";
import CardHeader from "../../../components/cards/CardHeader";
import CardContainer from "../../../components/cards/CardContainer";

interface ArticleCardProps {
  post: Post;
  onOpen?: () => void;
}

export default function ArticleCard({ post, onOpen }: ArticleCardProps) {
  return (
    <CardContainer {...(post.startSignificance === 1 && { significant: true })}>
      <CardHeader post={post} onOpen={onOpen} />

      {/* Description */}
      <CardDescriptions post={post} />

      {/* Subjects */}
      <div className="relative z-20 mt-auto flex items-center gap-3 border-t border-divider/70 pt-4">
        <CardSubjects subjects={post.subjects} />
        <CardFooter post={post} />
      </div>
    </CardContainer>
  );
}
