import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "../lib/graphql";
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  VERIFY_EMAIL_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  RESET_PASSWORD_MUTATION,
  RESEND_VERIFICATION_EMAIL_MUTATION,
} from "../graphql/mutations";
import type {
  LoginMutation,
  LoginMutationVariables,
  RegisterMutation,
  RegisterMutationVariables,
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
  ResendVerificationEmailMutation,
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

// Verify email
export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (variables: VerifyEmailMutationVariables) =>
      graphqlRequest<VerifyEmailMutation, VerifyEmailMutationVariables>(
        VERIFY_EMAIL_MUTATION,
        variables,
      ),
  });
}

// Forgot password
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (variables: ForgotPasswordMutationVariables) =>
      graphqlRequest<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
        FORGOT_PASSWORD_MUTATION,
        variables,
      ),
  });
}

// Reset password
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (variables: ResetPasswordMutationVariables) =>
      graphqlRequest<ResetPasswordMutation, ResetPasswordMutationVariables>(
        RESET_PASSWORD_MUTATION,
        variables,
      ),
  });
}

// Resend verification
export function useResendVerificationEmailMutation() {
  return useMutation({
    mutationFn: () =>
      graphqlRequest<ResendVerificationEmailMutation>(
        RESEND_VERIFICATION_EMAIL_MUTATION,
      ),
  });
}
