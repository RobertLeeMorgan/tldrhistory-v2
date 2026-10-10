import { GraphQLError, Kind, type SelectionSetNode, type ValidationRule } from "graphql";
import type { RequestHandler } from "express";

// Browser and SSR clients send ordinary query documents. Reject APQ before the
// text-based authentication limiter; otherwise hash-only requests bypass it.
export const rejectPersistedQueries: RequestHandler = (req, res, next) => {
  if (req.body?.extensions?.persistedQuery || req.query.extensions) {
    res.status(400).json({ errors: [{ message: "Persisted queries are disabled" }] });
    return;
  }
  next();
};

// Bound work per request, including fragment expansion and aliases. No extra
// service or schema-dependent complexity framework is needed for this API.
export const boundedOperation: ValidationRule = (context) => ({
  OperationDefinition(operation) {
    let fields = 0;
    let roots = 0;
    let exceeded = false;
    const walk = (set: SelectionSetNode, depth: number, seen: Set<string>) => {
      if (exceeded) return;
      if (depth > 12) { exceeded = true; return; }
      for (const item of set.selections) {
        if (item.kind === Kind.FIELD) {
          fields++;
          if (depth === 1) roots++;
          if (fields > 300 || roots > (operation.operation === "mutation" ? 1 : 20)) {
            exceeded = true;
            return;
          }
          if (item.selectionSet) walk(item.selectionSet, depth + 1, seen);
        } else if (item.kind === Kind.INLINE_FRAGMENT) {
          walk(item.selectionSet, depth, seen);
        } else if (!seen.has(item.name.value)) {
          const fragment = context.getFragment(item.name.value);
          if (fragment) walk(fragment.selectionSet, depth, new Set([...seen, item.name.value]));
        }
      }
    };
    walk(operation.selectionSet, 1, new Set());
    if (exceeded) context.reportError(new GraphQLError("Operation exceeds request limits", {
      extensions: { code: "BAD_USER_INPUT" },
    }));
  },
});
