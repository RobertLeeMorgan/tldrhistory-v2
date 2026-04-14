import { useState } from "react";
import { useFormReducer } from "../hooks/useFormReducer";
import { postSchemaClient } from "../../../schemas/postSchema.client";
import { useToast } from "../../../context/ToastContext";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import UrlInput from "./UrlInput";
import Button from "../../../components/ui/Button";
import SelectInput from "./SelectInput";
import type { GetFormListsQuery } from "../../../generated/graphql";
import FieldLabel from "./FieldLabel";

type FormListsData = NonNullable<GetFormListsQuery["formLists"]>;

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: any;
  formLists: FormListsData;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function PostForm({
  mode,
  initialData,
  formLists,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const { addToast } = useToast();
  const { state, dispatch } = useFormReducer(initialData);
  const [submitted, setSubmitted] = useState(false);

  const { allCountries, allSubjects, allGroups } = formLists;

  const showSubjectsError = submitted && state.subjects.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const parsed = postSchemaClient.safeParse(state);

    if (!parsed.success) {
      parsed.error.issues.forEach((err) => {
        addToast({ message: err.message, type: "error" });
      });
      return;
    }

    onSubmit(parsed.data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-2xl flex-col gap-4 rounded-xl border border-stone-900 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-4 shadow-xl shadow-stone-950/40 sm:gap-5 sm:p-6"
    >
      <TextInput
        label="Title"
        value={state.name}
        field="name"
        dispatch={dispatch}
        required
        placeHolder="e.g. Fall of Constantinople"
        input
      />

      <TextInput
        label="Description"
        value={state.startDescription}
        field="startDescription"
        dispatch={dispatch}
        rows={4}
        required
        placeHolder="What happened, and why does it matter?"
      />

      <TextInput
        label="How it ended"
        value={state.endDescription}
        field="endDescription"
        dispatch={dispatch}
        rows={4}
        placeHolder="How did this event, period, or life conclude?"
      />

      <SelectInput
        id="type"
        label="Type"
        value={state.type}
        placeholder="Select type"
        helpText="Events are short (<100 years). Periods are long (>100 years)."
        required
        options={[
          { value: "event", label: "Event" },
          { value: "person", label: "Person" },
          { value: "landmark", label: "Landmark" },
          { value: "period", label: "Period" },
        ]}
        onChange={(value) =>
          dispatch({
            type: "SET_FIELD",
            field: "type",
            value,
          })
        }
      />

      <SelectInput
        id="country"
        label="Country"
        value={state.country.name}
        placeholder="Select country"
        helpText="Use the modern equivalent country, even for ancient events."
        required
        options={allCountries.map((c) => ({
          value: c.name,
          label: `${c.name} (${c.continent})`,
        }))}
        onChange={(value) =>
          dispatch({
            type: "SET_FIELD",
            field: "country",
            value: { name: value },
          })
        }
      />

      <SelectInput
        id="group"
        label="Theme"
        helpText="Choose the theme this post best fits. Some posts fit multiple themes."
        value={state.group?.id?.toString() ?? ""}
        placeholder="Select theme"
        options={allGroups.map((g) => ({
          value: g.id.toString(),
          label: g.name,
        }))}
        onChange={(value) => {
          const selectedGroup =
            allGroups.find((g) => g.id.toString() === value) ?? null;

          dispatch({
            type: "SET_FIELD",
            field: "group",
            value: selectedGroup
              ? { id: selectedGroup.id, name: selectedGroup.name }
              : { id: 0, name: "" },
          });
        }}
      />

      <FieldLabel htmlFor="subjects" label="Subjects" />

      <div className="flex flex-wrap gap-2">
        {allSubjects.map((s) => {
          const selected = state.subjects.some((subj) => subj.id === s.id);

          return (
            <button
              key={s.id}
              type="button"
              className={`btn btn-sm border bg-stone-950 hover:bg-stone-950/70 ${
                selected
                  ? "border-[#daa754] text-[#daa754] shadow-lg shadow-stone-950/40 hover:border-gold hover:text-gold"
                  : "border-stone-600 text-stone-400/80 hover:border-stone-300 hover:text-stone-300"
              }`}
              onClick={() =>
                dispatch({
                  type: "SET_FIELD",
                  field: "subjects",
                  value: selected
                    ? state.subjects.filter((v) => v.id !== s.id)
                    : [...state.subjects, { id: s.id, name: s.name }],
                })
              }
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <p className={`text-xs text-error ${showSubjectsError ? "" : "hidden"}`}>
        Select at least one subject
      </p>

      <FieldLabel
        htmlFor="civilisation"
        label="Civilisation"
        helpText="For empires, dynasties, tribes, or cultures (not single events)."
      />

      <input
        id="civilisation"
        type="checkbox"
        checked={state.civilisation}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "civilisation",
            value: e.target.checked,
          })
        }
        className="checkbox rounded border-stone-600 inset-shadow-none bg-stone-950 checked:border-gold checked:bg-stone-950 checked:text-gold"
      />

      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          label="Start Year"
          helpText="Use most widely accepted academic date. Use negative for BCE (e.g. -476)."
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
        placeHolder="e.g. https://en.wikipedia.org/wiki/Example"
        value={state.sourceUrl}
        field="sourceUrl"
        dispatch={dispatch}
      />

      <UrlInput
        label="Image URL"
        placeHolder="https://commons.wikimedia.org/wiki/File:Example.jpg"
        helpText="Direct image link only (Wikimedia Commons). Check copyright first."
        value={state.imageUrl}
        field="imageUrl"
        dispatch={dispatch}
      />

      <TextInput
        label="Image Credit"
        value={state.imageCredit}
        field="imageCredit"
        dispatch={dispatch}
        placeHolder="e.g. Rijksmuseum / Wikimedia Commons / CC BY-SA 4.0"
        input
      />

      <Button
        isLoading={isSubmitting}
        primary
        label={mode === "create" ? "Submit Article" : "Submit Suggestion"}
        type="submit"
        loading="Submitting..."
      />
    </form>
  );
}
