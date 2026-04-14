import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import Nav from "../components/ui/Nav";
import Button from "../components/ui/Button";
import PageContainer from "../components/ui/PageContainer";

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
    <PageContainer>
      <Nav />

      <div className="text-center z-10">
        <h1 className="text-5xl font-bold text-gold mb-4 text-shadow-md">
          {title}
        </h1>
        <p className="text-2xl text-stone-300 mb-6">{message}</p>
        <Button label="Go Home" primary to="/" />
      </div>
    </PageContainer>
  );
}
