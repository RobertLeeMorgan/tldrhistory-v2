import FieldLabel from "./FieldLabel";

interface SelectInputOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string | number;
  options: SelectInputOption[];
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string;
  error?: string;
}

export default function SelectInput({
  id,
  label,
  value,
  options,
  placeholder,
  helpText,
  onChange,
  required = false,
  error,
}: SelectInputProps) {
  const errorId = `${id}-error`;
  return (
    <>
      <FieldLabel htmlFor={id} label={label} helpText={helpText}/>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`atlas-control w-full px-3 ${error ? "border-danger" : ""}`}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={`${id}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>}
    </>
  );
}
