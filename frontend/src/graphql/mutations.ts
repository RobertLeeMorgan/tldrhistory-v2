import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(email: $email, password: $password, username: $username) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      success
      message
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId) {
      id
      likes
      liked
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

export const SUGGEST_EDIT = `
  mutation SuggestEdit($postId: Int!, $input: PostInput!) {
    suggestEdit(postId: $postId, input: $input) {
      id
      status
      data
      post { id name }
      suggestedBy { id username }
    }
  }
`;

export const APPROVE_EDIT_MUTATION = `
  mutation ApproveEdit($id: Int!) {
    approveEdit(id: $id)
  }
`;

export const REJECT_EDIT_MUTATION = `
  mutation RejectEdit($id: Int!) {
    rejectEdit(id: $id)
  }
`;

export const CREATE_POST_SUGGESTION_MUTATION = gql`
  mutation CreatePostSuggestion($input: PostInput!) {
    createPostSuggestion(input: $input) {
      id
      status
      data
      createdAt
      updatedAt
      suggestedBy {
        id
        username
      }
    }
  }
`;

export const APPROVE_CREATED_POST_MUTATION = `
  mutation ApproveCreatedPost($id: Int!) {
    approveCreatedPost(id: $id)
  }
`;

export const REJECT_CREATED_POST_MUTATION = `
  mutation RejectCreatedPost($id: Int!) {
    rejectCreatedPost(id: $id)
  }
`;

export const SAVE_FILTER_MUTATION = gql`
  mutation SaveFilter($input: SaveFilterInput!) {
    saveFilter(input: $input) {
      id
      name
      state {
        search
        sortBy
        type
        subject
        continent
        yearStart
        yearEnd
        group
        view
      }
      createdAt
      updatedAt
    }
  }
`;

export const EDIT_SAVED_FILTER_MUTATION = gql`
  mutation EditSavedFilter($input: EditSavedFilterInput!) {
    editSavedFilter(input: $input) {
      id
      name
      state {
        search
        sortBy
        type
        subject
        continent
        yearStart
        yearEnd
        group
        view
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SAVED_FILTER_MUTATION = gql`
  mutation DeleteSavedFilter($input: DeleteSavedFilterInput!) {
    deleteSavedFilter(input: $input) {
      id
      name
    }
  }
`;