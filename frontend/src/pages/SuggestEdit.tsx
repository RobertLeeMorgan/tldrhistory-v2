import { useParams, useNavigate } from "react-router-dom";
import { usePostQuery } from "../hooks/useQueries";
import { useFormReducer } from "../hooks/useFormReducer";
import { useSuggestEditMutation } from "../hooks/useEdit";
import TextInput from "../components/form/TextInput";
import NumberInput from "../components/form/NumberInput";
import UrlInput from "../components/form/UrlInput";
import { useToast } from "../context/ToastContext";
import { postSchemaClient } from "../schemas/postSchema.client";

export default function SuggestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data, isLoading } = usePostQuery({ id: Number(id) });
  const { state, dispatch } = useFormReducer(data?.getPost?.post);

  const mutation = useSuggestEditMutation();

  if (isLoading)
    return (
      <div className="min-h-screen bg-stone-200/90 w-full flex">
        <span className="loading loading-spinner mx-auto text-stone-900 loading-xl"></span>
      </div>
    );

  const subjectsError = state.subjects.length === 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = postSchemaClient.safeParse({
      ...state,
      subjects: state.subjects.map(Number),
      groupId: state.groupId || undefined,
    });

    if (!parsed.success) {
      parsed.error.issues.forEach((err) => {
        addToast({ message: err.message, type: "error" });
      });
      return;
    }

    mutation.mutate(
      {
        postId: Number(id),
        input: {
          ...parsed.data,
          startSignificance: data?.getPost.post.startSignificance,
          endSignificance: data?.getPost.post.endSignificance,
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
      },
    );
  };

  return (
    <div className="p-4 py-20 bg-stone-200/90 w-full min-h-screen m-auto">
      <div className="max-w-2xl mx-auto card border border-neutral-700 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 shadow-xl shadow-black/40 p-4">
        <h1 className="text-4xl font-bold text-neutral-200/86 text-shadow-sm mb-4 text-center">
          Suggest an Edit
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label
            className="label text-neutral-200/86 text-shadow-sm text-lg"
            htmlFor="name"
          >
            <span className="label-text">Title</span>
          </label>
          <input
            id="name"
            type="text"
            aria-label="title"
            value={state.name}
            autoComplete="off"
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "name",
                value: e.target.value,
              })
            }
            className="input bg-neutral-950 input-bordered border border-neutral-600 w-full"
            minLength={5}
            required
          />

          <TextInput
            label="Start Description"
            value={state.startDescription}
            field="startDescription"
            dispatch={dispatch}
            rows={4}
            required
          />

          <TextInput
            label="How it ended"
            value={state.endDescription}
            field="endDescription"
            dispatch={dispatch}
            rows={4}
          />

          <label
            htmlFor="type"
            className="label text-neutral-200/86 text-shadow-sm text-lg"
          >
            <span className="label-text">Type</span>
          </label>
          <select
            value={state.type}
            id="type"
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "type",
                value: e.target.value,
              })
            }
            className="select select-bordered w-full bg-neutral-950 border border-neutral-600"
            aria-label="type"
            required
          >
            <option value="">Select Type</option>
            <option value="event">Event</option>
            <option value="person">Person</option>
            <option value="landmark">Landmark</option>
            <option value="period">Period</option>
          </select>

          <label
            className="label text-neutral-200/86 text-shadow-sm text-lg"
            htmlFor="country"
          >
            <span className="label-text">Country</span>
          </label>
          <select
            value={state.countryId}
            id="country"
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "countryId",
                value: e.target.value,
              })
            }
            aria-label="country"
            className="select select-bordered w-full bg-neutral-950 border border-neutral-600"
            autoComplete="off"
            required
          >
            <option value="">Select Country</option>
            {data?.getPost?.allCountries.map((c) => (
              <option key={c.name} value={c.name} aria-label={c.name}>
                {c.name} ({c.continent})
              </option>
            ))}
          </select>

          <label
            className="label text-neutral-200/86 text-shadow-sm text-lg"
            htmlFor="group"
          >
            <span className="label-text">Theme</span>
          </label>
          <select
            value={state.groupId}
            id="group"
            aria-label="group"
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "groupId",
                value: Number(e.target.value),
              })
            }
            className="select select-bordered w-full bg-neutral-950 border border-neutral-600"
          >
            <option value={0}>Select Theme</option>
            {data?.getPost?.allGroups.map((c) => (
              <option key={c.id} value={c.id} aria-label={c.name}>
                {c.name}
              </option>
            ))}
          </select>
         <div className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    checked={state.civilisation}
    onChange={(e) =>
      dispatch({ type: "SET_FIELD", field: "civilisation", value: e.target.checked })
    }
    className="w-4 h-4"
  />
  <label className="text-sm text-neutral-200">Civilisation</label>
</div>
          <label
            className="label text-neutral-200/86 text-shadow-sm text-lg"
            htmlFor="subjects"
          >
            <span className="label-text">Subjects</span>
          </label>

          <div className="validator w-full">
            <div className="flex flex-wrap gap-2">
              {data?.getPost?.allSubjects.map((s) => {
                const selected = state.subjects.includes(s.id);

                return (
                  <button
                    id="subjects"
                    type="button"
                    aria-label="subject button"
                    key={s.id}
                    className={`btn btn-sm border border-neutral-600 hover:text-neutral-300 hover:bg-neutral-900 hover:border-neutral-300 ${
                      selected
                        ? "bg-stone-900/40 border-zinc-300 text-neutral-200 shadow-lg shadow-black-40"
                        : "bg-neutral-950 border-neutral-400 text-neutral-400"
                    }`}
                    onClick={() =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "subjects",
                        value: selected
                          ? state.subjects.filter((v) => v !== s.id)
                          : [...state.subjects, s.id],
                      })
                    }
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          <p
            className={`z-20  text-xs text-error ${
              subjectsError ? "" : "hidden"
            }`}
          >
            You must select at least one subject
          </p>

          <div className="grid grid-cols-3 gap-4 ">
            <NumberInput
              label="Start Year"
              value={state.startYear}
              field="startYear"
              dispatch={dispatch}
              min={-300000}
              max={2025}
            />
            <NumberInput
              label="Start Month"
              value={state.startMonth}
              field="startMonth"
              dispatch={dispatch}
              min={0}
              max={12}
            />
            <NumberInput
              label="Start Day"
              value={state.startDay}
              field="startDay"
              dispatch={dispatch}
              min={0}
              max={31}
            />
            <NumberInput
              label="End Year"
              value={state.endYear}
              field="endYear"
              dispatch={dispatch}
              min={-300000}
              max={2025}
            />
            <NumberInput
              label="End Month"
              value={state.endMonth}
              field="endMonth"
              dispatch={dispatch}
              min={0}
              max={12}
            />
            <NumberInput
              label="End Day"
              value={state.endDay}
              field="endDay"
              dispatch={dispatch}
              min={0}
              max={31}
            />
          </div>

          <UrlInput
            label="Source URL"
            value={state.sourceUrl}
            field="sourceUrl"
            dispatch={dispatch}
          />

          <UrlInput
            label="Image URL"
            value={state.imageUrl}
            field="imageUrl"
            dispatch={dispatch}
          />

          <label
            className="label text-neutral-200/86 text-shadow-sm text-lg"
            htmlFor="imageCredit"
          >
            <span className="label-text">Image Credit</span>
          </label>
          <input
            type="text"
            id="imageCredit"
            placeholder="Image Credit"
            aria-label="image credit"
            className="input w-full mb-4 bg-neutral-950 border border-neutral-600"
            value={state.imageCredit}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "imageCredit",
                value: e.target.value,
              })
            }
          />

          <button
            className="btn bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors duration-400 mt-4 rounded-lg "
            disabled={mutation.isPending}
            aria-label="submit suggestion"
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
                Submitting...
              </>
            ) : (
              "Submit Suggestion"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
