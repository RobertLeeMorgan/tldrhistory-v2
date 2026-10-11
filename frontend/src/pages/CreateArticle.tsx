import { useNavigate } from "react-router";
import { useFormListsQuery } from "../../src/features/review/hooks/useSuggestions";
import { useCreatePostSuggestionMutation } from "../../src/features/review/hooks/useCreate";
import { useToast } from "../../src/context/ToastContext";
import PostForm from "../../src/features/form/components/PostForm";
import PageContainer from "../../src/components/ui/PageContainer";

export default function CreatePost() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: formListsData, error, refetch } = useFormListsQuery();
  const mutation = useCreatePostSuggestionMutation();

  const handleSubmit = (data: any) => {
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
    <PageContainer><div className="py-24 px-6 text-center text-gold" role={error ? "alert" : "status"}>
      {error ? <>Could not load the form. <button type="button" className="btn btn-sm" onClick={() => void refetch()}>Retry</button></> : "Loading form?"}
    </div></PageContainer>
  );

  return (
    <PageContainer>
      <div className="py-16 sm:py-24 p-4 sm:p-6 z-10">
        <h1 className="text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center">
          Create Article
        </h1>
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
