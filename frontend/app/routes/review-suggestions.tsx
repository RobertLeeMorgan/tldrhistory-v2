import type { Route } from "./+types/review-suggestions";
import RequireAuth from "../../src/lib/requireAuth";
import Review from "../../src/pages/Review";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Review Suggestions | TLDR History",
    description:
      "Moderation interface for reviewing timeline and content suggestions on TLDR History.",
    path: "/review-suggestions",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function ReviewRoute() {
  return (
    <RequireAuth requireRole={["ADMIN", "MODERATOR"]}>
      <Review />
    </RequireAuth>
  );
}