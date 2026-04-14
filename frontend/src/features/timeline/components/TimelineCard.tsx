import type { Post } from "../../../generated/graphql";
import CardDescriptions from "../../../components/cards/CardDescriptions";
import CardFooter from "../../../components/cards/CardFooter";
import CardSubjects from "../../../components/cards/CardSubjects";
import CardHeader from "../../../components/cards/CardHeader";
import CardContainer from "../../../components/cards/CardContainer";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <CardContainer {...(post.startSignificance === 1 && { significant: true })}>
      <CardHeader post={post} />

      {/* Description */}
      <CardDescriptions post={post} />

      {/* Subjects */}
      <div className="flex items-center mt-auto z-20">
        <CardSubjects subjects={post.subjects} />
        <CardFooter post={post} />
      </div>
    </CardContainer>
  );
}
