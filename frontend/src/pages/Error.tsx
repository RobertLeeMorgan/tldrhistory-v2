import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import Nav from "../components/Nav";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-200/90 p-6">
      <Nav/>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-4 text-shadow-md">{title}</h1>
        <p className="text-2xl text-neutral-800 mb-6">{message}</p>
        <Link to="/" className="btn btn-lg bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors duration-400 mt-4 rounded-lg shadow-md shadow-black/40" aria-label="home">
          Go Home
        </Link>
      </div>
    </div>
  );
}
