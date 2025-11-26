import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar JSON

  enum Continent {
    Africa
    Antarctica
    Asia
    Europe
    MiddleEast
    NorthAmerica
    Oceania
    SouthAmerica
    Global
  }

  enum PostType {
    person
    landmark
    event
    period
  }

  enum UserRole {
    USER
    MODERATOR
    ADMIN
    BOT
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    posts: [Post!]!
    likes: [Like!]!
    suggestedEdits: [EditSuggestion!]!
    moderatedEdits: [EditSuggestion!]!
  }

  type Like {
    post: Post!
  }

  type Country {
    name: String!
    continent: Continent!
    posts: [Post!]!
  }

  type CountrySummary {
    name: String!
    continent: Continent!
  }

  type Subject {
    id: ID!
    name: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    type: PostType!
    name: String!
    startDescription: String!
    endDescription: String
    startYear: Int!
    startMonth: Int!
    startDay: Int!
    endYear: Int!
    endMonth: Int!
    endDay: Int!
    effectiveDate: Int!
    startSignificance: Float!
    endSignificance: Float!
    imageUrl: String
    imageCredit: String
    sourceUrl: String
    country: CountrySummary!
    user: User!
    subjects: [Subject!]!
    likes: Int!
    liked: Boolean
    editSuggestions: [EditSuggestion!]!
  }

  type PostWithLists {
    post: Post!
    allCountries: [CountrySummary!]!
    allSubjects: [Subject!]!
  }

  type EditSuggestion {
    id: Int!
    post: Post!
    suggestedBy: User!
    moderator: User
    data: JSON!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Summary {
    id: ID!
    startYear: Int!
    endYear: Int!
    headline: String!
    createdAt: String!
    updatedAt: String!
  }

  type Population {
    yearStart: Int!
    yearEnd: Int!
    population: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input FilterInput {
    type: [String!]
    subject: [String!]
    yearStart: Int
    yearEnd: Int
    continent: [String!]
    search: String
    sortBy: String
  }

  input PostInput {
    type: String!
    name: String!
    startDescription: String!
    endDescription: String
    startYear: Int!
    startMonth: Int
    startDay: Int
    endYear: Int
    endMonth: Int
    endDay: Int
    startSignificance: Float
    endSignificance: Float
    imageUrl: String
    imageCredit: String
    sourceUrl: String
    countryId: String!
    subjects: [ID!]!
  }

  type SignificantPost {
    id: ID!
    name: String!
    imageUrl: String
  }

  type TimelineResponse {
    posts: [Post!]!
  }

  type Query {
    timeline(page: Int, filter: FilterInput): TimelineResponse!
    getUser(id: Int!): User
    getPopulation(start: Int!): Int!
    getSignificant(startYear: Int!, endYear: Int!): SignificantPost
    getCivilisation(startYear: Int!, endYear: Int!): [Post!]!
    pendingEdits: [EditSuggestion!]!
    getPost(id: Int!): PostWithLists!
    getHeadline(startYear: Int!, endYear: Int!): String
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    postTimeline(input: PostInput!): Post!
    editTimeline(id: Int!, input: PostInput!): Post!
    deletePost(id: Int!): Boolean!
    likePost(postId: Int!): Post!
    suggestEdit(postId: Int!, input: PostInput!): EditSuggestion!
    approveEdit(id: Int!): Post!
    rejectEdit(id: Int!): Boolean!
  }
`;
