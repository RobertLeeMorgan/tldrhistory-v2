import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar JSON
  scalar BigInt

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

  enum PeriodType {
    millennia
    century
    decade
    year
  }

  enum UserRole {
    USER
    MODERATOR
    ADMIN
    BOT
  }

  enum ImageStatus {
    pending
    approved
    fallback
    rejected
  }

  enum ReviewStatus {
    pending
    approved
    rejected
  }

  enum ReviewChangeKind {
    text
    longText
    number
    boolean
    entity
    entityList
    image
  }

  input FilterInput {
    type: [PostType!]
    subject: [String!]
    yearStart: Int
    yearEnd: Int
    continent: [Continent!]
    search: String
    sortBy: Boolean
    group: Int
  }

  input PostInput {
    type: PostType!
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
    civilisation: Boolean
    imageUrl: String
    imageCredit: String
    sourceUrl: String
    country: CountryInput!
    subjects: [SubjectInput!]!
    group: GroupInput
  }

  input SubjectInput {
    id: ID!
    name: String!
  }

  input GroupInput {
    id: ID!
    name: String!
  }

  input CountryInput {
    name: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    emailVerifiedAt: String
    suggestedPosts: [CreatedPost!]!
    moderatedPosts: [CreatedPost!]!
    suggestedEdits: [EditSuggestion!]!
    moderatedEdits: [EditSuggestion!]!
    createdAt: String!
    updatedAt: String!
  }

  type UserStats {
    mostLikedPost: Post
    favouriteGroup: GroupSummary
    favouriteEra: String
  }

  type UserStatsResponse {
    stats: UserStats!
    id: Int!
    username: String!
    createdAt: String!
    emailVerifiedAt: String
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
    createdAt: String!
    updatedAt: String!
  }

  type Group {
    id: Int!
    name: String!
    description: String!
    icon: String!
  }

  type GroupSummary {
    name: String!
    icon: String
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
    startSignificance: Float!
    endSignificance: Float!
    imageUrl: String
    imageCredit: String
    sourceUrl: String
    cdnId: String
    cdnUrl: String
    imageStatus: ImageStatus
    civilisation: Boolean
    country: CountrySummary!
    user: User!
    subjects: [Subject!]!
    likes: Int!
    liked: Boolean
    group: Group
    editSuggestions: [EditSuggestion!]!
    createdAt: String!
    updatedAt: String!
  }

  type Summary {
    id: Int!
    startYear: Int!
    endYear: Int!
    headline: String!
    createdAt: String!
    updatedAt: String!
  }

  type Population {
    yearStart: Int!
    yearEnd: Int!
    population: BigInt!
    createdAt: String!
    updatedAt: String!
  }

  type AuthResponse {
    token: String!
    user: User!
    needsEmailVerification: Boolean
  }

  type VerifyResponse {
    success: Boolean!
    message: String!
  }

  type FormLists {
    allCountries: [CountrySummary!]!
    allSubjects: [Subject!]!
    allGroups: [Group!]!
  }

  type SignificantPost {
    id: ID!
    name: String!
    imageUrl: String
    cdnId: String
  }

  type TimelineResponse {
    posts: [Post!]!
    nextCursor: ID
  }

  type ReviewEntityValue {
    id: Int
    name: String!
    icon: String
    continent: Continent
  }

  type ReviewChange {
    label: String!
    kind: ReviewChangeKind!
    from: JSON
    to: JSON
  }

  type PendingEditChanges {
    name: ReviewChange
    type: ReviewChange
    startYear: ReviewChange
    startMonth: ReviewChange
    startDay: ReviewChange
    endYear: ReviewChange
    endMonth: ReviewChange
    endDay: ReviewChange
    startDescription: ReviewChange
    endDescription: ReviewChange
    startSignificance: ReviewChange
    endSignificance: ReviewChange
    civilisation: ReviewChange
    country: ReviewChange
    group: ReviewChange
    subjects: ReviewChange
    imageUrl: ReviewChange
    imageCredit: ReviewChange
    sourceUrl: ReviewChange
  }

  type EditSuggestion {
    id: Int!
    post: Post!
    suggestedBy: User!
    moderator: User
    data: JSON!
    status: ReviewStatus!
    createdAt: String!
    updatedAt: String!
  }

  type CreatedPost {
    id: Int!
    suggestedBy: User!
    moderator: User
    post: Post
    data: JSON!
    status: ReviewStatus!
    createdAt: String!
    updatedAt: String!
  }

  type PendingCreatedPostReview {
    id: Int!
    suggestedBy: User!
    data: JSON!
    status: ReviewStatus!
    createdAt: String!
    updatedAt: String!
  }

  type PendingEditReview {
    id: Int!
    suggestedBy: User!
    post: Post!
    changes: PendingEditChanges!
    hasImageChanges: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type PendingReviewStats {
    pending: Int!
    approved: Int!
    rejected: Int!
  }

  type CreatedPostsResponse {
    createdPosts: [PendingCreatedPostReview!]!
  }

  type PendingEditsResponse {
    edits: [PendingEditReview!]!
  }

type SavedFilterState {
  search: String
  sortBy: Boolean!
  type: [PostType!]!
  subject: [String!]!
  continent: [Continent!]!
  yearStart: Int!
  yearEnd: Int!
  group: Int
  view: String
}

input SavedFilterStateInput {
  search: String
  sortBy: Boolean!
  type: [PostType!]!
  subject: [String!]!
  continent: [Continent!]!
  yearStart: Int!
  yearEnd: Int!
  group: Int
  view: String
}

type SavedFilter {
  id: Int!
  name: String!
  state: SavedFilterState!
  createdAt: String!
  updatedAt: String!
}

input SaveFilterInput {
  name: String!
  state: SavedFilterStateInput!
}

input EditSavedFilterInput {
  id: Int!
  name: String
  state: SavedFilterStateInput
}

input DeleteSavedFilterInput {
  id: Int!
}

  type Query {
    timeline(
      cursor: ID
      filter: FilterInput
      viewerId: String
    ): TimelineResponse!
    userPosts(userId: Int!): [Post!]!
    userLikes(userId: Int!): [Like!]!
    userStats(userId: Int!): UserStatsResponse
    getPost(id: Int!): Post!
    getPopulation(start: Int!): BigInt!
    getSignificant(
      startYear: Int!
      endYear: Int!
      filter: FilterInput
    ): SignificantPost
    getCivilisation(
      startYear: Int!
      endYear: Int!
      filter: FilterInput
    ): [Post!]!
    pendingEdits: PendingEditsResponse!
    pendingCreatedPosts: CreatedPostsResponse!
    pendingStats: PendingReviewStats!
    formLists: FormLists!
    savedFilters: [SavedFilter!]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): AuthResponse!
    login(email: String!, password: String!): AuthResponse!
    verifyEmail(token: String!): VerifyResponse!
    forgotPassword(email: String!): VerifyResponse!
    resendVerificationEmail: VerifyResponse!
    resetPassword(token: String!, password: String!): AuthResponse!

    postTimeline(input: PostInput!): Post!
    editTimeline(id: Int!, input: PostInput!): Post!
    deletePost(id: Int!): Boolean!
    likePost(postId: Int!): Post!

    suggestEdit(postId: Int!, input: PostInput!): EditSuggestion!
    approveEdit(id: Int!): Boolean!
    rejectEdit(id: Int!): Boolean!

    createPostSuggestion(input: PostInput!): CreatedPost!
    approveCreatedPost(id: Int!): Boolean!
    rejectCreatedPost(id: Int!): Boolean!

    saveFilter(input: SaveFilterInput!): SavedFilter!
    editSavedFilter(input: EditSavedFilterInput!): SavedFilter!
    deleteSavedFilter(input: DeleteSavedFilterInput!): SavedFilter!
  }
`;
