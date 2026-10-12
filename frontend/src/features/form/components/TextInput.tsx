import FieldLabel from "./FieldLabel";
import type { FormAction } from "../hooks/useFormReducer";

interface TextInputProps {
  label: string;
  value: string;
  field: string;
  placeHolder?: string;
  dispatch: React.Dispatch<FormAction>;
  required?: boolean;
  input?: boolean;
  rows?: number;
  helpText?: string;
  error?: string;
}

export default function TextInput({
  label,
  value,
  input = false,
  field,
  placeHolder = "",
  dispatch,
  required = false,
  rows = 5,
  helpText,
  error,
}: TextInputProps) {
  const errorId = `${field}-error`;
  const commonProps = {
    name: field,
    id: field,
    value,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": error ? errorId : undefined,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) =>
      dispatch({
        type: "SET_FIELD",
        field,
        value: e.target.value,
      }),
    minLength: required ? 5 : 0,
    required,
    placeholder: placeHolder,
    className: `atlas-control w-full px-3.5 py-2.5 ${input ? "" : "min-h-28 resize-y"} ${error ? "border-danger" : ""}`,
  };

  return (
    <>
      <FieldLabel htmlFor={field} label={label} helpText={helpText} />
      {input ? (
        <input {...commonProps} type="text" />
      ) : (
        <textarea {...commonProps} rows={rows} />
      )}
      {error && <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>}
    </>
  );
}
