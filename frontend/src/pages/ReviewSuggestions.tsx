import { usePendingEdits } from "../hooks/useQueries";
import { useApproveEdit, useRejectEdit } from "../hooks/useEdit";
import ReviewCard from "../components/cards/ReviewCard";

export default function ReviewSuggestions() {
  const { data, isLoading, error } = usePendingEdits();
  const approveEdit = useApproveEdit();
  const rejectEdit = useRejectEdit();

  if (isLoading)
    return (
      <div className="min-h-screen bg-stone-200/90 w-full flex">
        <span className="loading loading-spinner mx-auto text-stone-900 loading-xl"></span>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-stone-200/90 w-full">
        <span className="text-shadow-sm text-stone-900 pt-30 text-2xl items-center flex justify-center">
          Failed to load content
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-200/90 w-full">
      <h1 className="text-3xl font-semibold mb-8 text-center pt-20 text-stone-800/86 text-shadow-sm">
        Review Edit Suggestions
      </h1>

      <div className="space-y-12">
        {data?.map((suggestion) => (
          <div
            key={suggestion.id}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 shadow-sm"
          >
            {/* LEFT: ORIGINAL POST */}
            <div>
              <h2 className="text-xl font-medium mb-4 text-stone-800/86 text-shadow-sm">
                Original Post
              </h2>
              <ReviewCard post={suggestion.post} />
            </div>

            {/* RIGHT: SUGGESTION */}
            <div>
              <h2 className="text-xl font-medium mb-4 text-stone-800/86 text-shadow-sm">
                Suggested Changes
              </h2>

              <ReviewCard post={{ ...suggestion.post, ...suggestion.data }} />

              {/* ACTION BUTTONS */}
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  className="btn shadow-lg shadow-black/40 bg-green-500 border border-green-600 hover:bg-green-600 w-28"
                  onClick={() => approveEdit.mutate(suggestion.id)}
                  disabled={approveEdit.isPending}
                  aria-label="approve suggestion"
                >
                  {approveEdit.isPending ? "Approving…" : "Approve"}
                </button>

                <button
                  className="btn shadow-lg shadow-black/40 bg-rose-600 border border-rose-700 hover:bg-rose-700 w-28"
                  onClick={() => rejectEdit.mutate(suggestion.id)}
                  disabled={rejectEdit.isPending}
                  aria-label="reject suggestion"
                >
                  {rejectEdit.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-md"></span>
                      Rejecting...
                    </>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
