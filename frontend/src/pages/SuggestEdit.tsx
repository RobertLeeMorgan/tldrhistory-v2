import { useParams, useNavigate } from "react-router-dom";
import { usePostQuery } from "../hooks/useQueries";
import { useFormReducer } from "../hooks/useFormReducer";
import { useSuggestEditMutation } from "../hooks/useEdit";
import { toast } from "react-toastify";

export default function SuggestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = usePostQuery({ id: Number(id) });
  const { state, dispatch } = useFormReducer(data?.getPost?.post);

  const mutation = useSuggestEditMutation();

  if (isLoading) return <p>Loading…</p>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(
      {
        postId: Number(id),
        input: {
          ...state,
          subjects: state.subjects.map(Number),
          startSignificance: data?.getPost.post.startSignificance,
          endSignificance: data?.getPost.post.endSignificance,
          imageCredit: data?.getPost.post.imageCredit,
        },
      },
      {
        onSuccess: () => {
          navigate("/");
          toast.success("Your suggestion is pending review");
        },
      }
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Suggest an Edit</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={state.name}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "name",
              value: e.target.value,
            })
          }
          className="input input-bordered w-full"
        />

        <label className="label">
          <span className="label-text">Start Description</span>
        </label>
        <textarea
          value={state.startDescription}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "startDescription",
              value: e.target.value,
            })
          }
          className="textarea textarea-bordered w-full h-40"
        />

        <label className="label">
          <span className="label-text">End Description</span>
        </label>
        <textarea
          value={state.endDescription}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "endDescription",
              value: e.target.value,
            })
          }
          className="textarea textarea-bordered w-full h-40"
        />

        <label className="label">
          <span className="label-text">Type</span>
        </label>
        <select
          value={state.type}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "type",
              value: e.target.value,
            })
          }
          className="select select-bordered w-full"
        >
          <option value="">Select Type</option>
          <option value="event">Event</option>
          <option value="person">Person</option>
          <option value="landmark">Landmark</option>
          <option value="period">Period</option>
        </select>

        <label className="label">
          <span className="label-text">Country</span>
        </label>
        <select
          value={state.countryId}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "countryId",
              value: e.target.value,
            })
          }
          className="select select-bordered w-full"
        >
          <option value="">Select Country</option>
          {data?.getPost?.allCountries.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.continent})
            </option>
          ))}
        </select>

        <label className="label">
          <span className="label-text">Subjects</span>
        </label>
        <select
          multiple
          value={state.subjects}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "subjects",
              value: Array.from(e.target.selectedOptions, (opt) => opt.value),
            })
          }
          className="select select-bordered w-full"
        >
          {data?.getPost?.allSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-4 ">
          <div>
            <label className="label">
              <span className="label-text">Start Year</span>
            </label>
            <input
              type="number"
              value={state.startYear}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "startYear",
                  value: Number(e.target.value),
                })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Start Month</span>
            </label>
            <input
              type="number"
              value={state.startMonth}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "startMonth",
                  value: Number(e.target.value),
                })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Start Day</span>
            </label>
            <input
              type="number"
              value={state.startDay}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "startDay",
                  value: Number(e.target.value),
                })
              }
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">End Year</span>
            </label>
            <input
              type="number"
              value={state.endYear}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "endYear",
                  value: Number(e.target.value),
                })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">End Month</span>
            </label>
            <input
              type="number"
              value={state.endMonth}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "endMonth",
                  value: Number(e.target.value),
                })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">End Day</span>
            </label>
            <input
              type="number"
              value={state.endDay}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "endDay",
                  value: Number(e.target.value),
                })
              }
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
        <input
          type="text"
          value={state.imageUrl}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "imageUrl",
              value: e.target.value,
            })
          }
          className="input input-bordered w-full"
        />

        <label className="label">
          <span className="label-text">Source URL</span>
        </label>
        <input
          type="text"
          value={state.sourceUrl}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "sourceUrl",
              value: e.target.value,
            })
          }
          className="input input-bordered w-full"
        />

        <button className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting…" : "Submit Suggestion"}
          Submit Suggestion
        </button>
      </form>
    </div>
  );
}
