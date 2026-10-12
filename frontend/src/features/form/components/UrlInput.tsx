import FieldLabel from "./FieldLabel";
import type { FormAction } from "../hooks/useFormReducer";

interface UrlInputProps {
  label: string;
  value: string;
  field: string;
  placeHolder: string;
  dispatch: React.Dispatch<FormAction>;
  helpText?: string;
  error?: string;
}

export default function UrlInput({
  label,
  value,
  field,
  placeHolder,
  dispatch,
  helpText,
  error,
}: UrlInputProps) {
  const errorId = `${field}-error`;
  return (
    <>
      <FieldLabel htmlFor={field} label={label} helpText={helpText} />
      <label className={`atlas-control flex w-full items-center gap-2 px-3 shadow-none ${error ? "border-danger" : ""}`}>
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </g>
        </svg>

        <input
          type="url"
          pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\\-].*[a-zA-Z0-9])?\\.)+[a-zA-Z].*$"
          title="Must be valid URL"
          className="min-w-0 flex-1 bg-transparent text-content outline-none placeholder:text-content-muted/65"
          name={field}
          id={field}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          value={value}
          placeholder={placeHolder}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field,
              value: e.target.value,
            })
          }
        />
      </label>
      <p className="validator-hint hidden">Must be valid URL</p>
      {error && <p id={errorId} className="text-sm text-danger" role="alert">{error}</p>}
    </>
  );
}
