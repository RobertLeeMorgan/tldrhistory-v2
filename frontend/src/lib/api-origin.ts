export function getApiOrigin() {
  if (typeof window === "undefined") {
    return process.env.VITE_API_ORIGIN || "http://localhost:5000";
  }

  return import.meta.env.VITE_API_ORIGIN || "";
}

export function getGraphqlUrl() {
  return `${getApiOrigin()}/graphql`;
}

export function getRefreshUrl() {
  const origin = getApiOrigin();
  return origin ? `${origin}/api/refresh` : "/api/refresh";
}