import { useId, type InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export default function FormField({ label, error, id: suppliedId, ...inputProps }: FormFieldProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="block space-y-2 text-left">
      <span className="text-sm font-bold text-content">{label}</span>
      <input
        {...inputProps}
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={`atlas-control w-full px-3.5 placeholder:text-content-muted/65 ${error ? "border-danger" : ""}`}
      />
      {error && <span id={errorId} className="block text-sm text-danger" role="alert">{error}</span>}
    </label>
  );
}
