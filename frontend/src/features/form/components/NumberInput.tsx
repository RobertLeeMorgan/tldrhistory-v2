import FieldLabel from "./FieldLabel";
import type { FormAction } from "../hooks/useFormReducer";

interface NumberInputProps {
  label: string;
  value: number;
  field: string;
  dispatch: React.Dispatch<FormAction>;
  min?: number;
  max?: number;
  required?: boolean;
  helpText?: string;
  error?: string;
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
  error,
}: NumberInputProps) {
  const errorId = `${field}-error`;
  return (
    <div>
      <FieldLabel htmlFor={field} label={label} helpText={helpText} />
      <input
        type="number"
        id={field}
        name={field}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={`atlas-control w-full px-3 ${error ? "border-danger" : ""}`}
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
      {error && <p id={errorId} className="mt-1 text-sm text-danger" role="alert">{error}</p>}
    </div>
  );
}
