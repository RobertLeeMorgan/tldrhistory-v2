import FieldLabel from "./FieldLabel";

interface TextInputProps {
  label: string;
  value: string;
  field: string;
  placeHolder?: string;
  dispatch: React.Dispatch<any>;
  required?: boolean;
  input?: boolean;
  rows?: number;
  helpText?: string;
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
}: TextInputProps) {
  const commonProps = {
    name: field,
    id: field,
    value,
    "aria-label": label,
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
    className: `${
      input ? "input input-bordered" : "textarea textarea-bordered"
    } w-full bg-stone-950 border border-stone-600`,
  };

  return (
    <>
      <FieldLabel htmlFor={field} label={label} helpText={helpText} />
      {input ? (
        <input {...commonProps} type="text" />
      ) : (
        <textarea {...commonProps} rows={rows} />
      )}
    </>
  );
}