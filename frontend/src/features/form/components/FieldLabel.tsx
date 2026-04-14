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
      className="label flex items-center text-lg text-stone-200/86 text-shadow-sm"
    >
      <span className="label-text">{label}</span>
      {helpText ? <FieldHelp text={helpText} /> : null}
    </label>
  );
}