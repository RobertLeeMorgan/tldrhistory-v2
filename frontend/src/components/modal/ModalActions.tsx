import type { Post } from "../../generated/graphql";
import Button from "../ui/Button";

interface ModalActionsProps {
  post: Post;
  deleteMutation: {
    canDelete: boolean;
    isPending: boolean;
    delete: (id: number) => void;
  };
}

export default function ModalActions({ post, deleteMutation }: ModalActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-3 border-t border-divider pt-5">
      <Button label="Suggest Edit" to={`/articles/edit/${post.id}`} />

      {deleteMutation.canDelete && (
        <Button
          onClick={() => post?.id && deleteMutation.delete(Number(post.id))}
          label="Delete Post"
          loading="Deleting..."
          isLoading={deleteMutation.isPending}
          primary
        />
      )}
    </div>
  );
}
