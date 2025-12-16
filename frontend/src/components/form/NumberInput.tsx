interface NumberInputProps {
  label: string;
  value: number;
  field: string;
  dispatch: React.Dispatch<any>;
  min?: number;
  max?: number;
  required?: boolean;
}

export default function NumberInput({
  label,
  value,
  field,
  dispatch,
  min,
  max,
  required = true,
}: NumberInputProps) {
  return (
    <div>
      <label className="label w-full" htmlFor={label}>
        <span className="label-text">{label}</span>
      </label>
      <input
        type="number"
        id={label}
        name={label}
        aria-label={label}
        className="input input-bordered w-full"
        required={required}
        placeholder={
          min && max ? `Type a number between ${min} and ${max}` : undefined
        }
        min={min}
        max={max}
        title={min && max ? `Must be between ${min} and ${max}` : undefined}
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
