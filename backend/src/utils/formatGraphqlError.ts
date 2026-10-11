import { unwrapResolverError } from "@apollo/server/errors";
import type { GraphQLFormattedError } from "graphql";

export function formatGraphqlError(formatted: GraphQLFormattedError, error: unknown) {
  const cause = unwrapResolverError(error);
  const isDatabaseError = cause instanceof Error && cause.name.startsWith("PrismaClient");
  return {
    message: isDatabaseError ? "The request could not be completed. Please refresh and try again." : formatted.message,
    extensions: { code: isDatabaseError ? "INTERNAL_SERVER_ERROR" : formatted.extensions?.code || "INTERNAL_SERVER_ERROR" },
  };
}
