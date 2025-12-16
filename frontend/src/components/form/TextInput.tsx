interface TextInputProps {
  label: string;
  value: string;
  field: string;
  dispatch: React.Dispatch<any>;
  required?: boolean;
  rows?: number;
}

export default function TextInput({
  label,
  value,
  field,
  dispatch,
  required,
  rows = 5,
}: TextInputProps) {
  return (
    <>
      <label className="label" htmlFor={label}>
        <span className="label-text">{label}</span>
      </label>
      <textarea
        name={label}
        id={label}
        value={value}
        aria-label={label}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field,
            value: e.target.value,
          })
        }
        minLength={required ? 10 : 0}
        className="textarea textarea-bordered w-full"
        required={required}
        rows={rows}
      />
    </>
  );
}
