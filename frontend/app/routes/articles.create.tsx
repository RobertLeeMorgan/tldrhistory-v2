import RequireAuth from "../../src/lib/requireAuth";
import CreatePostPage from "../../src/pages/CreateArticle";
import type { Route } from "./+types/articles.create";
import { buildMeta } from "../../src/lib/seo";

export function meta({}: Route.MetaArgs) {
  return buildMeta({
    title: "Create Article | TLDR History",
    description:
      "Create and publish a new article on TLDR History.",
    path: "/create",
    robots: "noindex, nofollow",
    type: "website",
  });
}

export default function CreateArticleRoute() {
  return (
    <RequireAuth requireVerified>
      <CreatePostPage />
    </RequireAuth>
  );
}