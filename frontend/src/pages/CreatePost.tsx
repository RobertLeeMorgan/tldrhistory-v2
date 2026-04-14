import { useNavigate } from "react-router-dom";
import { useFormListsQuery } from "../features/review/hooks/useSuggestions";
import { useCreatePostSuggestionMutation } from "../features/review/hooks/useCreate";
import { useToast } from "../context/ToastContext";
import PostForm from "../features/form/components/PostForm";
import PageContainer from "../components/ui/PageContainer";

export default function CreatePost() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: formListsData } = useFormListsQuery();
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

  if (!formListsData) return null;

  return (
    <PageContainer>
      <div className="py-16 sm:py-24 p-4 sm:p-6 z-10">
        <h1 className="text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center">
          Create Post
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
