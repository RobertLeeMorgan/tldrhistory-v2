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
}: SelectInputProps) {
  return (
    <>
      <FieldLabel htmlFor={id} label={label} helpText={helpText}/>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered w-full border border-stone-600 bg-stone-950"
        aria-label={label}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={`${id}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}