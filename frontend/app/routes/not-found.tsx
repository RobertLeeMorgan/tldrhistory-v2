import type { Route } from "./+types/not-found";
import ErrorPage from "../../src/pages/Error";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Page Not Found | TLDR History",
    description:
      "The page you’re looking for does not exist or may have been moved.",
    path: "/404",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function NotFound() {
  return <ErrorPage  />;
}
