import { usePendingEdits} from "../hooks/useQueries";
import { useApproveEdit, useRejectEdit} from "../hooks/useEdit"
import ReviewCard from "../components/ReviewCard";

export default function ReviewSuggestions() {
  const { data, isLoading, error } = usePendingEdits();
  const approveEdit = useApproveEdit();
  const rejectEdit = useRejectEdit();

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Failed to load suggestions.</div>;

  return (
    <div className="min-h-screen bg-base-200 w-full">
      <h1 className="text-3xl font-semibold mb-8 text-center pt-20">
        Review Edit Suggestions
      </h1>

      <div className="space-y-12">
        {data?.map((suggestion) => (
          <div
            key={suggestion.id}
            className="grid grid-cols-2 gap-6 p-6 shadow-sm"
          >
            {/* LEFT: ORIGINAL POST */}
            <div>
              <h2 className="text-xl font-medium mb-4 text-gray-700">
                Original Post
              </h2>
              <ReviewCard post={suggestion.post} />
            </div>

            {/* RIGHT: SUGGESTION */}
            <div>
              <h2 className="text-xl font-medium mb-4 text-gray-700">
                Suggested Changes
              </h2>

              <ReviewCard post={{ ...suggestion.post, ...suggestion.data }} />

              {/* ACTION BUTTONS */}
              <div className="mt-6 flex gap-4">
                <button
                  className="btn btn-success"
                  onClick={() => approveEdit.mutate(suggestion.id)}
                  disabled={approveEdit.isPending}
                >
                  {approveEdit.isPending ? "Approving…" : "Approve"}
                </button>

                <button
                  className="btn btn-error"
                  onClick={() => rejectEdit.mutate(suggestion.id)}
                  disabled={rejectEdit.isPending}
                >
                  {rejectEdit.isPending ? "Rejecting…" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
