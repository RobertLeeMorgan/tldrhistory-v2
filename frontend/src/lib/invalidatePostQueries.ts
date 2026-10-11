import type { QueryClient } from "@tanstack/react-query";

// Publishing, editing and deleting a post affect all these read models.
export function invalidatePostQueries(client: QueryClient) {
  return Promise.all([
    "timeline", "post", "userPosts", "userLikes", "userStats",
    "significant", "civilisation", "pendingEdits", "pendingCreatedPosts", "pendingStats",
  ].map((key) => client.invalidateQueries({ queryKey: [key] })));
}
