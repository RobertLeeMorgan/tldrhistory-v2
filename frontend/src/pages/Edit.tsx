import { useParams, useNavigate } from "react-router";
import { usePostQuery } from "../../src/features/review/hooks/useSuggestions";
import { useSuggestEditMutation } from "../../src/features/review/hooks/useEdit";
import { useToast } from "../../src/context/ToastContext";
import PostForm from "../../src/features/form/components/PostForm";
import PageContainer from "../../src/components/ui/PageContainer";
import type { PostFormData } from "../schemas/postSchema.client";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data, error, refetch } = usePostQuery({ id: Number(id!) });
  const mutation = useSuggestEditMutation();

  const handleSubmit = (formData: PostFormData) => {
    if (!data) return;

    mutation.mutate(
      {
        postId: Number(id),
        input: {
          ...formData,
          startSignificance: data.getPost.startSignificance,
          endSignificance: data.getPost.endSignificance,
        },
      },
      {
        onSuccess: () => {
          navigate("/");
          addToast({
            message: "Your suggestion is pending review",
            type: "success",
          });
        },
        onError: (error) => {
          addToast({
            message:
              error instanceof Error
                ? error.message
                : "Failed to submit suggestion",
            type: "error",
          });
        },
      },
    );
  };

  if (!data) return (
    <PageContainer variant="form" className="px-4"><div className="atlas-surface w-full max-w-lg rounded-2xl p-8 text-center text-content" role={error ? "alert" : "status"}>
      {error ? <><p className="font-bold">Could not load the form.</p><button type="button" className="mt-4 min-h-11 rounded-lg border border-accent px-4 font-bold text-accent" onClick={() => void refetch()}>Retry</button></> : <><span className="loading loading-spinner text-accent" aria-hidden="true" /><p className="mt-3">Loading form…</p></>}
    </div></PageContainer>
  );

  return (
    <PageContainer variant="reading" className="bg-canvas px-4 sm:px-6">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="atlas-eyebrow">Improve the record</p>
          <h1 className="mt-3 text-4xl font-bold text-content sm:text-5xl">Suggest Edit</h1>
          <p className="mt-4 text-base leading-7 text-content-muted">Propose a correction or clearer account. The published article stays unchanged until review.</p>
        </header>
        <PostForm
          mode="edit"
          initialData={data.getPost}
          formLists={data.formLists}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
        />
      </div>
    </PageContainer>
  );
}
