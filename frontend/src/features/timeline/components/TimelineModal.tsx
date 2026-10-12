import type { Post } from "../../../generated/graphql";
import { useDeletePost } from "../../../hooks/useDeletePost";
import Actions from "../../../components/modal/ModalActions";
import CardFooter from "../../../components/cards/CardFooter";
import ModalHeader from "../../../components/modal/ModalHeader";
import ModalDescription from "../../../components/modal/ModalDescription";
import { Link } from "react-router";
import ModalShell from "../../../components/modal/ModalShell";
import ModalCloseButton from "../../../components/modal/ModalCloseButton";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
}

export default function PostModal({ open, post, onClose }: PostModalProps) {
  const deleteMutation = useDeletePost(onClose);

  if (!post) return null;

  return (
    <ModalShell open={open} onClose={onClose} panelClassName="max-w-3xl" ariaLabel={`Article: ${post.name}`}>
      <article className="max-h-[calc(100dvh-1rem)] overflow-y-auto sm:max-h-[calc(100dvh-2.5rem)]">
        <div className="sticky top-0 z-30 flex justify-end border-b border-divider bg-surface/95 px-3 py-2 backdrop-blur sm:px-5">
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="space-y-6 px-5 pb-7 pt-5 sm:px-8 sm:pb-9 sm:pt-7">
          <header className="space-y-2 border-b border-divider pb-5">
            <p className="atlas-eyebrow">{post.type}</p>
            <h2 className="text-3xl font-bold leading-tight text-content sm:text-4xl">
              {post.name}
            </h2>
          </header>

          <ModalHeader post={post} />
          <ModalDescription post={post} />

          <div className="flex flex-wrap items-center gap-4 border-t border-divider pt-5">
            <p className="text-sm italic text-content-muted">
            by{" "}
              <Link to={`/user/${post.user.id}`} className="font-bold not-italic text-accent hover:text-content">
                {post.user.username}
              </Link>
            </p>
            <CardFooter post={post} />
          </div>

          <Actions post={post} deleteMutation={deleteMutation} />
        </div>
      </article>
    </ModalShell>
  );
}
