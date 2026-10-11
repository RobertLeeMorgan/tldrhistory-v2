import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../../../lib/graphql";
import { SAVED_FILTERS_QUERY } from "../../../graphql/queries";
import { useAuth } from "../../../context/AuthContext";
import type {
  SavedFiltersQuery,
  SavedFiltersQueryVariables,
} from "../../../generated/graphql";

export function useSavedFiltersQuery(variables?: SavedFiltersQueryVariables) {
  const { isAuth } = useAuth();
  return useQuery<SavedFiltersQuery>({
    queryKey: ["savedFilters", isAuth.id, variables ?? null],
    enabled: !!isAuth.token,
    queryFn: () =>
      graphqlRequest<SavedFiltersQuery, SavedFiltersQueryVariables>(
        SAVED_FILTERS_QUERY,
        variables ?? {},
      ),
    staleTime: 1000 * 60 * 5,
  });
}
