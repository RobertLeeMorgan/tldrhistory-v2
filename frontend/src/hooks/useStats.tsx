import { useQuery } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import {
  SIGNIFICANT_QUERY,
  POPULATION_QUERY,
  CIVILISATION_QUERY,
} from "../graphql/queries";
import type {
  GetSignificantQuery,
  GetSignificantQueryVariables,
  GetPopulationQuery,
  GetPopulationQueryVariables,
  GetCivilisationQuery,
  GetCivilisationQueryVariables,
} from "../generated/graphql";

// Civilisation
export function useCivilisationQuery(variables: GetCivilisationQueryVariables) {
  return useQuery<GetCivilisationQuery>({
    queryKey: ["civilisation", variables],
    queryFn: () =>
      graphqlRequest<GetCivilisationQuery, GetCivilisationQueryVariables>(
        CIVILISATION_QUERY,
        variables
      ),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

// Population
export function usePopulationQuery(variables: GetPopulationQueryVariables) {
  return useQuery<GetPopulationQuery>({
    queryKey: ["population", variables],
    queryFn: () =>
      graphqlRequest<GetPopulationQuery, GetPopulationQueryVariables>(
        POPULATION_QUERY,
        variables
      ),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

// Significant
export function useSignificantQuery(variables: GetSignificantQueryVariables) {
  return useQuery<GetSignificantQuery>({
    queryKey: ["significant", variables],
    queryFn: () =>
      graphqlRequest<GetSignificantQuery, GetSignificantQueryVariables>(
        SIGNIFICANT_QUERY,
        variables
      ),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
