import { useNavigate } from "react-router-dom";

export default function ModalActions({ post, deleteMutation }: any) {
  const navigate = useNavigate();

  const handleSuggestEdit = () => navigate(`/edit/${post.id}`);

  return (
    <div className="flex gap-3 justify-center p-4">
      <button className="btn btn-outline" onClick={handleSuggestEdit} aria-label="suggest edit">
        Suggest Edit
      </button>

      {deleteMutation.canDelete && (
        <button
          className={`btn btn-error ${
            deleteMutation.isPending ? "btn-disabled" : ""
          }`}
          onClick={() => deleteMutation.delete(Number(post.id))}
          aria-label="delete post"
        >
          {deleteMutation.isPending ? (
            <>
              <span className="loading loading-spinner loading-md"></span>
              Deleting...
            </>
          ) : (
            "Delete Post"
          )}
        </button>
      )}
    </div>
  );
}
