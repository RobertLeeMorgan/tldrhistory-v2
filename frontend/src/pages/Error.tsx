import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function Error() {
  const error = useRouteError();

  let title = "Oops!";
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = (error.data as { message?: string })?.message || message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    message = (error as { message: string }).message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-error mb-4">{title}</h1>
        <p className="text-lg text-neutral-content mb-6">{message}</p>
        <Link to="/" className="btn btn-primary" aria-label="home">
          Go Home
        </Link>
      </div>
    </div>
  );
}
