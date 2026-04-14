import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphql/mutations";
import type {
  LoginMutation,
  LoginMutationVariables,
  RegisterMutation,
  RegisterMutationVariables,
} from "../generated/graphql";

// Login
export function useLoginMutation() {
  return useMutation({
    mutationFn: (variables: LoginMutationVariables) =>
      graphqlRequest<LoginMutation, LoginMutationVariables>(
        LOGIN_MUTATION,
        variables,
      ),
  });
}

// Register
export function useRegisterMutation() {
  return useMutation({
    mutationFn: (variables: RegisterMutationVariables) =>
      graphqlRequest<RegisterMutation, RegisterMutationVariables>(
        REGISTER_MUTATION,
        variables,
      ),
  });
}
