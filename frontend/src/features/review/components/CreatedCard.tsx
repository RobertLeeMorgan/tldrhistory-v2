import type { Post } from "../../../generated/graphql";
import CardContainer from "../../../components/cards/CardContainer";
import CardHeader from "../../../components/cards/CardHeader";
import CardSubjects from "../../../components/cards/CardSubjects";
import Button from "../../../components/ui/Button";

interface CreatedCardProps {
  post: Post;
  onApprove: () => void;
  onReject: () => void;
  approving?: boolean;
  rejecting?: boolean;
}

export default function CreatedCard({
  post,
  onApprove,
  onReject,
  approving = false,
  rejecting = false,
}: CreatedCardProps) {
  const typeMeta = `${post.type.slice(0, 1).toUpperCase() + post.type.slice(1)}${
    post.civilisation ? " | Civilisation" : ""
  }${post.group ? ` | ${post.group.name}` : ""}`;

  return (
    <CardContainer>
      <CardHeader post={post} />

      <div className="z-20">
        {post.imageUrl && (
          <div className="float-right ml-4 mb-2 max-w-32">
            <img
              src={post.imageUrl}
              alt={post.name}
              className="max-w-32 max-h-32 object-cover rounded shadow-md"
              loading="eager"
            />
            {post.imageCredit && (
              <span className="mt-2 block text-xs text-stone-400">
                {post.imageCredit}
              </span>
            )}
          </div>
        )}

        <p className="text-base md:text-lg text-stone-300">
          {post.startDescription}
        </p>

        {post.endDescription && (
          <p className="mt-3 text-base md:text-lg text-stone-400">
            {post.endDescription}
          </p>
        )}
      </div>

      <div className="text-stone-400 font-medium">{typeMeta}</div>

      <CardSubjects subjects={post.subjects} />

      {post.sourceUrl && (
        <a
          className="text-stone-400 font-medium break-all"
          href={post.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          {post.sourceUrl}
        </a>
      )}

      <div className="mt-4 flex gap-3 justify-center">
        <Button
          label="Reject"
          loading="Rejecting..."
          isLoading={rejecting}
          onClick={onReject}
        />

        <Button
          label="Approve"
          loading="Approving..."
          primary
          isLoading={approving}
          onClick={onApprove}
        />
      </div>
    </CardContainer>
  );
}
