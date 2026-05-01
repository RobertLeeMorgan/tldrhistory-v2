export function getApiOrigin() {
  if (typeof window === "undefined") {
    return (
      process.env.API_ORIGIN ||
      process.env.VITE_API_ORIGIN ||
      "http://localhost:5000"
    );
  }

  return import.meta.env.VITE_API_ORIGIN || "";
}

export function getGraphqlUrl() {
  const origin = getApiOrigin();
  return origin ? `${origin}/graphql` : "/graphql";
}

export function getRefreshUrl() {
  const origin = getApiOrigin();
  return origin ? `${origin}/api/refresh` : "/api/refresh";
}