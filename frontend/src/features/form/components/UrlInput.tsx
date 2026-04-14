import FieldLabel from "./FieldLabel";

interface UrlInputProps {
  label: string;
  value: string;
  field: string;
  placeHolder: string;
  dispatch: React.Dispatch<any>;
  helpText?: string;
}

export default function UrlInput({
  label,
  value,
  field,
  placeHolder,
  dispatch,
  helpText,
}: UrlInputProps) {
  return (
    <>
      <FieldLabel htmlFor={field} label={label} helpText={helpText} />
      <label className="input validator w-full border border-stone-600 bg-stone-950 shadow-none">
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
          className="bg-stone-950"
          name={field}
          id={field}
          aria-label={label}
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
    </>
  );
}