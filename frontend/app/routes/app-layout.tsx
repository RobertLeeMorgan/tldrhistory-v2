import { Outlet } from "react-router";
import ErrorPage from "../../src/pages/Error";

export default function AppLayout() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <ErrorPage />;
}