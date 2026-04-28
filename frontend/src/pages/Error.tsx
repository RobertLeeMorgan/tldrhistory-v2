import { isRouteErrorResponse, useRouteError } from "react-router";
import Button from "../components/ui/Button";
import PageContainer from "../components/ui/PageContainer";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Oops!";
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    if (typeof error.data === "string") {
      message = error.data;
    } else if (
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data &&
      typeof error.data.message === "string"
    ) {
      message = error.data.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <PageContainer>
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