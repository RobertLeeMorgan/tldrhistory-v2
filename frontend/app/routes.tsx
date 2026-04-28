import {
  type RouteConfig,
  layout,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  layout("./routes/app-layout.tsx", [
    index("./routes/home.tsx"),
    route("timeline", "./routes/timeline.tsx", [
      index("./routes/timeline.index.tsx"),
      route(":groupSlug", "./routes/timeline.$groupSlug.tsx"),
    ]),
    route("register", "./routes/register.tsx"),
    route("login", "./routes/login.tsx"),
    route("forgot-password", "./routes/forgot-password.tsx"),
    route("reset-password", "./routes/reset-password.tsx"),
    route("verify", "./routes/verify.tsx"),
    route("user/:id", "./routes/user.$id.tsx"),
    route("articles", "./routes/articles.tsx", [
      route("create", "./routes/articles.create.tsx"),
      route("edit/:id", "./routes/articles.edit.$id.tsx"),
    ]),
    route("review-suggestions", "./routes/review-suggestions.tsx"),
    route("terms", "./routes/terms.tsx"),
    route("privacy", "./routes/privacy.tsx"),
    route("cookies", "./routes/cookies.tsx"),
    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;