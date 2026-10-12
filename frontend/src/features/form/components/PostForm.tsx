import { useState } from "react";
import { useFormReducer } from "../hooks/useFormReducer";
import { postSchemaClient } from "../../../schemas/postSchema.client";
import { useToast } from "../../../context/ToastContext";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import UrlInput from "./UrlInput";
import Button from "../../../components/ui/Button";
import SelectInput from "./SelectInput";
import type { GetFormListsQuery, GetPostWithFormListsQuery } from "../../../generated/graphql";
import type { PostFormData } from "../../../schemas/postSchema.client";
import FieldLabel from "./FieldLabel";
import type { ReactNode } from "react";

type FormListsData = NonNullable<GetFormListsQuery["formLists"]>;

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: GetPostWithFormListsQuery["getPost"];
  formLists: FormListsData;
  onSubmit: (data: PostFormData) => void;
  isSubmitting: boolean;
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-xl border border-divider bg-canvas/35 p-4 sm:p-6">
      <legend className="px-2 text-xl font-bold text-content">{title}</legend>
      <p className="-mt-2 text-sm leading-6 text-content-muted">{description}</p>
      {children}
    </fieldset>
  );
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { allCountries, allSubjects, allGroups } = formLists;

  const showSubjectsError = submitted && state.subjects.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFieldErrors({});

    const parsed = postSchemaClient.safeParse(state);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const field = String(err.path[0] ?? "form");
        if (!nextErrors[field]) nextErrors[field] = err.message;
        addToast({ message: err.message, type: "error" });
      });
      setFieldErrors(nextErrors);
      return;
    }

    onSubmit(parsed.data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="atlas-surface mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl p-4 sm:p-6 lg:p-8"
      noValidate
    >
      <FormSection title="Article summary" description="Give readers a clear title and concise account of what happened.">
      <TextInput
        label="Title"
        value={state.name}
        field="name"
        dispatch={dispatch}
        required
        placeHolder="e.g. Fall of Constantinople"
        input
        error={fieldErrors.name}
      />

      <TextInput
        label="Description"
        value={state.startDescription}
        field="startDescription"
        dispatch={dispatch}
        rows={4}
        required
        placeHolder="What happened, and why does it matter?"
        error={fieldErrors.startDescription}
      />

      <TextInput
        label="How it ended"
        value={state.endDescription}
        field="endDescription"
        dispatch={dispatch}
        rows={4}
        placeHolder="How did this event, period, or life conclude?"
        error={fieldErrors.endDescription}
      />
      </FormSection>

      <FormSection title="Classification" description="Place the article in the atlas so it appears in the right searches and filters.">
      <SelectInput
        id="type"
        label="Type"
        value={state.type}
        placeholder="Select type"
        helpText="Events are short (<100 years). Periods are long (>100 years)."
        required
        error={fieldErrors.type}
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
        error={fieldErrors.country}
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
        error={fieldErrors.group}
      />

      <div>
      <FieldLabel htmlFor="subjects" label="Subjects" />

      <div id="subjects" className="flex flex-wrap gap-2" role="group" aria-label="Subjects" aria-describedby={showSubjectsError ? "subjects-error" : undefined}>
        {allSubjects.map((s) => {
          const selected = state.subjects.some((subj) => subj.id === s.id);

          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={selected}
              className={`min-h-10 rounded-full border px-3 text-sm font-bold transition-colors ${
                selected
                  ? "border-accent bg-accent/12 text-accent"
                  : "border-divider bg-surface text-content-muted hover:border-control hover:text-content"
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

      <p id="subjects-error" className={`mt-2 text-sm text-danger ${showSubjectsError ? "" : "hidden"}`} role={showSubjectsError ? "alert" : undefined}>
        Select at least one subject
      </p>
      </div>

      <label htmlFor="civilisation" className="flex cursor-pointer items-start gap-3 rounded-lg border border-divider bg-surface p-4">
        <input
          id="civilisation"
          type="checkbox"
          checked={state.civilisation}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: "civilisation", value: e.target.checked })}
          className="checkbox mt-0.5 rounded border-control [--chkbg:var(--color-accent)] [--chkfg:var(--color-on-accent)]"
        />
        <span><span className="block text-sm font-bold text-content">Civilisation</span><span className="mt-1 block text-sm leading-5 text-content-muted">For empires, dynasties, tribes, or cultures rather than single events.</span></span>
      </label>
      </FormSection>

      <FormSection title="Dates" description="Use the most widely accepted academic dates. Enter negative years for BCE and 0 for an unknown month or day.">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberInput
          label="Start Year"
          helpText="Use most widely accepted academic date. Use negative for BCE (e.g. -476)."
          value={state.startYear}
          field="startYear"
          dispatch={dispatch}
          min={-300000}
          max={2025}
          error={fieldErrors.startYear}
        />
        <NumberInput
          label="Start Month"
          value={state.startMonth}
          field="startMonth"
          dispatch={dispatch}
          min={0}
          max={12}
          error={fieldErrors.startMonth}
        />
        <NumberInput
          label="Start Day"
          value={state.startDay}
          field="startDay"
          dispatch={dispatch}
          min={0}
          max={31}
          error={fieldErrors.startDay}
        />
        <NumberInput
          label="End Year"
          value={state.endYear}
          field="endYear"
          dispatch={dispatch}
          min={-300000}
          max={2025}
          error={fieldErrors.endYear}
        />
        <NumberInput
          label="End Month"
          value={state.endMonth}
          field="endMonth"
          dispatch={dispatch}
          min={0}
          max={12}
          error={fieldErrors.endMonth}
        />
        <NumberInput
          label="End Day"
          value={state.endDay}
          field="endDay"
          dispatch={dispatch}
          min={0}
          max={31}
          error={fieldErrors.endDay}
        />
      </div>
      </FormSection>

      <FormSection title="Sources and image" description="Add a reliable source and optional image details so reviewers can verify the submission.">
      <UrlInput
        label="Source URL"
        placeHolder="e.g. https://en.wikipedia.org/wiki/Example"
        value={state.sourceUrl}
        field="sourceUrl"
        dispatch={dispatch}
        error={fieldErrors.sourceUrl}
      />

      <UrlInput
        label="Image URL"
        placeHolder="https://commons.wikimedia.org/wiki/File:Example.jpg"
        helpText="Direct image link only (Wikimedia Commons). Check copyright first."
        value={state.imageUrl}
        field="imageUrl"
        dispatch={dispatch}
        error={fieldErrors.imageUrl}
      />

      <TextInput
        label="Image Credit"
        value={state.imageCredit}
        field="imageCredit"
        dispatch={dispatch}
        placeHolder="e.g. Rijksmuseum / Wikimedia Commons / CC BY-SA 4.0"
        input
        error={fieldErrors.imageCredit}
      />
      </FormSection>

      <div className="sticky bottom-0 -mx-4 -mb-4 flex justify-end border-t border-divider bg-surface/95 p-4 backdrop-blur sm:-mx-6 sm:-mb-6 sm:px-6 lg:-mx-8 lg:-mb-8 lg:px-8">
        <Button isLoading={isSubmitting} primary label={mode === "create" ? "Submit Article" : "Submit Suggestion"} type="submit" loading="Submitting..." className="w-full sm:w-auto" />
      </div>
    </form>
  );
}
