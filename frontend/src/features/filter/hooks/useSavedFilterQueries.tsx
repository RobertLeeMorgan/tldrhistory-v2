import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { SAVED_FILTERS_QUERY } from "../../../graphql/queries";
import type {
  SavedFiltersQuery,
  SavedFiltersQueryVariables,
} from "../../../generated/graphql";

export function useSavedFiltersQuery(variables?: SavedFiltersQueryVariables) {
  return useQuery<SavedFiltersQuery>({
    queryKey: ["savedFilters", variables ?? null],
    queryFn: () =>
      graphqlRequest<SavedFiltersQuery, SavedFiltersQueryVariables>(
        SAVED_FILTERS_QUERY,
        variables ?? {},
      ),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
