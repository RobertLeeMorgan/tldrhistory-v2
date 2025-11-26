import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(email: $email, password: $password, username: $username) {
      token
      user {
        id
        username
        email
        role
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
    approveEdit(id: $id) {
      id
    }
  }
`;

export const REJECT_EDIT_MUTATION = `
  mutation RejectEdit($id: Int!) {
    rejectEdit(id: $id)
  }
`;
