import Button from "../ui/Button";

export default function ModalActions({ post, deleteMutation }: any) {
  return (
    <div className="flex gap-4 justify-center">
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
