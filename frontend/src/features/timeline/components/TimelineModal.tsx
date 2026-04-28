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
    <ModalShell open={open} onClose={onClose} panelClassName="max-w-2xl">
      <div className="overflow-y-auto space-y-4 sm:space-y-6 max-h-[calc(95vh-3rem)] sm:max-h-[calc(95vh-5rem)]">
        <ModalCloseButton onClose={onClose} />

        <h2 className="card-title text-stone-300 text-xl sm:text-2xl">
          {post.name}
        </h2>

        <ModalHeader post={post} />
        <ModalDescription post={post} />

        <div className="flex items-center">
          <p className="italic text-md text-stone-300">
            by{" "}
            <Link to={`/user/${post.user.id}`}>
              <span className="text-gold text-lg not-italic">
                {post.user.username}
              </span>
            </Link>
          </p>
          <CardFooter post={post} />
        </div>

        <Actions
          post={post}
          deleteMutation={deleteMutation}
          onClose={onClose}
        />
      </div>
    </ModalShell>
  );
}
