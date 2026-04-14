import FieldLabel from "./FieldLabel";

interface NumberInputProps {
  label: string;
  value: number;
  field: string;
  dispatch: React.Dispatch<any>;
  min?: number;
  max?: number;
  required?: boolean;
  helpText?: string;
}

export default function NumberInput({
  label,
  value,
  field,
  dispatch,
  min,
  max,
  required = true,
  helpText,
}: NumberInputProps) {
  return (
    <div>
      <FieldLabel htmlFor={field} label={label} helpText={helpText} />
      <input
        type="number"
        id={field}
        name={field}
        aria-label={label}
        className="input input-bordered w-full border border-stone-600 bg-stone-950"
        required={required}
        placeholder={
          min !== undefined && max !== undefined
            ? `Between ${min} and ${max}`
            : undefined
        }
        min={min}
        max={max}
        title={min !== undefined && max !== undefined ? `Must be between ${min} and ${max}` : undefined}
        value={value}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field,
            value: Number(e.target.value),
          })
        }
      />
      {min !== undefined && max !== undefined && (
        <p className="validator-hint hidden">{`Must be between ${min} and ${max}`}</p>
      )}
    </div>
  );
}