import { useParams, useNavigate } from "react-router";
import { usePostQuery } from "../../src/features/review/hooks/useSuggestions";
import { useSuggestEditMutation } from "../../src/features/review/hooks/useEdit";
import { useToast } from "../../src/context/ToastContext";
import PostForm from "../../src/features/form/components/PostForm";
import PageContainer from "../../src/components/ui/PageContainer";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data } = usePostQuery({ id: Number(id!) });
  const mutation = useSuggestEditMutation();

  const handleSubmit = (data: any) => {
    mutation.mutate(
      {
        postId: Number(id),
        input: {
          ...data,
          startSignificance: data?.getPost?.startSignificance,
          endSignificance: data?.getPost?.endSignificance,
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

  if (!data) return null;

  return (
    <PageContainer>
      <div className="py-16 sm:py-24 p-4 sm:p-6 z-10">
        <h1 className="text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center">
          Suggest Edit
        </h1>
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