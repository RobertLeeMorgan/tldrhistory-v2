import { useNavigate } from "react-router";
import { useFormListsQuery } from "../../src/features/review/hooks/useSuggestions";
import { useCreatePostSuggestionMutation } from "../../src/features/review/hooks/useCreate";
import { useToast } from "../../src/context/ToastContext";
import PostForm from "../../src/features/form/components/PostForm";
import PageContainer from "../../src/components/ui/PageContainer";
import type { PostFormData } from "../schemas/postSchema.client";

export default function CreatePost() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: formListsData, error, refetch } = useFormListsQuery();
  const mutation = useCreatePostSuggestionMutation();

  const handleSubmit = (data: PostFormData) => {
    mutation.mutate(
      { input: data },
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

  if (!formListsData) return (
    <PageContainer variant="form" className="px-4"><div className="atlas-surface w-full max-w-lg rounded-2xl p-8 text-center text-content" role={error ? "alert" : "status"}>
      {error ? <><p className="font-bold">Could not load the form.</p><button type="button" className="mt-4 min-h-11 rounded-lg border border-accent px-4 font-bold text-accent" onClick={() => void refetch()}>Retry</button></> : <><span className="loading loading-spinner text-accent" aria-hidden="true" /><p className="mt-3">Loading form…</p></>}
    </div></PageContainer>
  );

  return (
    <PageContainer variant="reading" className="bg-canvas px-4 sm:px-6">
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="atlas-eyebrow">Contribute to the atlas</p>
          <h1 className="mt-3 text-4xl font-bold text-content sm:text-5xl">Create Article</h1>
          <p className="mt-4 text-base leading-7 text-content-muted">Submit a concise, sourced historical entry. A moderator will review it before publication.</p>
        </header>
        <PostForm
          mode="create"
          formLists={formListsData}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
        />
      </div>
    </PageContainer>
  );
}
