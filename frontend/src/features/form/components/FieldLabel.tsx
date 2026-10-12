import FieldHelp from "./FieldHelp";

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  helpText?: string;
}

export default function FieldLabel({
  htmlFor,
  label,
  helpText,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center text-sm font-bold text-content"
    >
      <span>{label}</span>
      {helpText ? <FieldHelp text={helpText} /> : null}
    </label>
  );
}
