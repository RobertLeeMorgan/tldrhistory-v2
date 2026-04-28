import type { Route } from "./+types/articles.edit.$id";
import { buildMeta } from "../../src/lib/seo";
import RequireAuth from "../../src/lib/requireAuth";
import Edit from "../../src/pages/Edit";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Edit | TLDR History",
    description: "Edit content on TLDR History.",
    path: "/edit",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function EditRoute() {
  return (
    <RequireAuth requireVerified>
      <Edit />
    </RequireAuth>
  );
}