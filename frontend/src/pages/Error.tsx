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
    <PageContainer variant="form" className="relative overflow-hidden bg-canvas px-4">
      <div className="atlas-surface z-10 w-full max-w-xl rounded-2xl p-8 text-center sm:p-12">
        <p className="atlas-eyebrow">The atlas has a gap</p>
        <h1 className="mt-3 text-4xl font-bold text-content sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mb-7 mt-4 max-w-md text-lg leading-8 text-content-muted">{message}</p>
        <Button label="Go Home" primary to="/" />
      </div>
    </PageContainer>
  );
}
