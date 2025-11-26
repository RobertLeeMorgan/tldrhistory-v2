import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphql/mutations";
import type {
  LoginMutation,
  LoginMutationVariables,
  RegisterMutation,
  RegisterMutationVariables,
} from "../generated/graphql";
import { useAuth } from "../context/AuthContext";

// Login
export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (variables: LoginMutationVariables) =>
      graphqlRequest<LoginMutation, LoginMutationVariables>(
        LOGIN_MUTATION,
        variables
      ),
    onSuccess: (data) => {
      login(data.login.token, {
        id: data.login.user.id,
        username: data.login.user.username,
        role: data.login.user.role,
      });
    },
  });
}

// Register
export function useRegisterMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (variables: RegisterMutationVariables) =>
      graphqlRequest<RegisterMutation, RegisterMutationVariables>(
        REGISTER_MUTATION,
        variables
      ),
    onSuccess: (data) => {
      login(data.register.token, {
        id: data.register.user.id,
        username: data.register.user.username,
        role: "USER",
      });
    },
  });
}
