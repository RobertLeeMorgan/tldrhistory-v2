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

      <div className="relative z-20 space-y-4">
        {post.imageUrl && (
          <figure className="overflow-hidden rounded-xl border border-divider bg-canvas/45">
            <img
              src={post.imageUrl}
              alt=""
              className="aspect-[16/10] w-full object-contain"
              loading="lazy"
            />
            {post.imageCredit && (
              <figcaption className="border-t border-divider px-3 py-2 text-xs text-content-muted">
                {post.imageCredit}
              </figcaption>
            )}
          </figure>
        )}

        <p className="text-base leading-7 text-content">
          {post.startDescription}
        </p>

        {post.endDescription && (
          <p className="text-base leading-7 text-content-muted">
            {post.endDescription}
          </p>
        )}
      </div>

      <div className="text-sm font-bold text-content-muted">{typeMeta}</div>

      <CardSubjects subjects={post.subjects} />

      {post.sourceUrl && (
        <a
          className="break-all text-sm font-bold text-accent underline decoration-control underline-offset-4 hover:text-content"
          href={post.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          {post.sourceUrl}
        </a>
      )}

      <div className="mt-2 flex flex-wrap justify-end gap-3 border-t border-divider pt-4">
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
