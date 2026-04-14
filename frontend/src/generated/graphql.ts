export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Continent =
  | 'Africa'
  | 'Antarctica'
  | 'Asia'
  | 'Europe'
  | 'Global'
  | 'MiddleEast'
  | 'NorthAmerica'
  | 'Oceania'
  | 'SouthAmerica';

export type Country = {
  __typename?: 'Country';
  continent: Continent;
  name: Scalars['String']['output'];
  posts: Array<Post>;
};

export type CountryInput = {
  name: Scalars['String']['input'];
};

export type CountrySummary = {
  __typename?: 'CountrySummary';
  continent: Continent;
  name: Scalars['String']['output'];
};

export type CreatedPost = {
  __typename?: 'CreatedPost';
  createdAt: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  moderator?: Maybe<User>;
  post?: Maybe<Post>;
  status: ReviewStatus;
  suggestedBy: User;
  updatedAt: Scalars['String']['output'];
};

export type CreatedPostsResponse = {
  __typename?: 'CreatedPostsResponse';
  createdPosts: Array<PendingCreatedPostReview>;
};

export type EditSuggestion = {
  __typename?: 'EditSuggestion';
  createdAt: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  moderator?: Maybe<User>;
  post: Post;
  status: ReviewStatus;
  suggestedBy: User;
  updatedAt: Scalars['String']['output'];
};

export type FilterInput = {
  continent?: InputMaybe<Array<Continent>>;
  group?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['Boolean']['input']>;
  subject?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<PostType>>;
  yearEnd?: InputMaybe<Scalars['Int']['input']>;
  yearStart?: InputMaybe<Scalars['Int']['input']>;
};

export type FormLists = {
  __typename?: 'FormLists';
  allCountries: Array<CountrySummary>;
  allGroups: Array<Group>;
  allSubjects: Array<Subject>;
};

export type Group = {
  __typename?: 'Group';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type GroupInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type GroupSummary = {
  __typename?: 'GroupSummary';
  icon?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type ImageStatus =
  | 'approved'
  | 'fallback'
  | 'pending'
  | 'rejected';

export type Like = {
  __typename?: 'Like';
  post: Post;
};

export type Mutation = {
  __typename?: 'Mutation';
  approveCreatedPost: Scalars['Boolean']['output'];
  approveEdit: Scalars['Boolean']['output'];
  createPostSuggestion: CreatedPost;
  deletePost: Scalars['Boolean']['output'];
  editTimeline: Post;
  likePost: Post;
  login: AuthPayload;
  postTimeline: Post;
  register: AuthPayload;
  rejectCreatedPost: Scalars['Boolean']['output'];
  rejectEdit: Scalars['Boolean']['output'];
  suggestEdit: EditSuggestion;
};


export type MutationApproveCreatedPostArgs = {
  id: Scalars['Int']['input'];
};


export type MutationApproveEditArgs = {
  id: Scalars['Int']['input'];
};


export type MutationCreatePostSuggestionArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int']['input'];
};


export type MutationEditTimelineArgs = {
  id: Scalars['Int']['input'];
  input: PostInput;
};


export type MutationLikePostArgs = {
  postId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationPostTimelineArgs = {
  input: PostInput;
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRejectCreatedPostArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRejectEditArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSuggestEditArgs = {
  input: PostInput;
  postId: Scalars['Int']['input'];
};

export type PendingCreatedPostReview = {
  __typename?: 'PendingCreatedPostReview';
  createdAt: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  status: ReviewStatus;
  suggestedBy: User;
  updatedAt: Scalars['String']['output'];
};

export type PendingEditChanges = {
  __typename?: 'PendingEditChanges';
  civilisation?: Maybe<ReviewChange>;
  country?: Maybe<ReviewChange>;
  endDay?: Maybe<ReviewChange>;
  endDescription?: Maybe<ReviewChange>;
  endMonth?: Maybe<ReviewChange>;
  endSignificance?: Maybe<ReviewChange>;
  endYear?: Maybe<ReviewChange>;
  group?: Maybe<ReviewChange>;
  imageCredit?: Maybe<ReviewChange>;
  imageUrl?: Maybe<ReviewChange>;
  name?: Maybe<ReviewChange>;
  sourceUrl?: Maybe<ReviewChange>;
  startDay?: Maybe<ReviewChange>;
  startDescription?: Maybe<ReviewChange>;
  startMonth?: Maybe<ReviewChange>;
  startSignificance?: Maybe<ReviewChange>;
  startYear?: Maybe<ReviewChange>;
  subjects?: Maybe<ReviewChange>;
  type?: Maybe<ReviewChange>;
};

export type PendingEditReview = {
  __typename?: 'PendingEditReview';
  changes: PendingEditChanges;
  createdAt: Scalars['String']['output'];
  hasImageChanges: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  post: Post;
  suggestedBy: User;
  updatedAt: Scalars['String']['output'];
};

export type PendingEditsResponse = {
  __typename?: 'PendingEditsResponse';
  edits: Array<PendingEditReview>;
};

export type PendingReviewStats = {
  __typename?: 'PendingReviewStats';
  approved: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
};

export type PeriodType =
  | 'century'
  | 'decade'
  | 'millennia'
  | 'year';

export type Population = {
  __typename?: 'Population';
  createdAt: Scalars['String']['output'];
  population: Scalars['BigInt']['output'];
  updatedAt: Scalars['String']['output'];
  yearEnd: Scalars['Int']['output'];
  yearStart: Scalars['Int']['output'];
};

export type Post = {
  __typename?: 'Post';
  cdnId?: Maybe<Scalars['String']['output']>;
  cdnUrl?: Maybe<Scalars['String']['output']>;
  civilisation?: Maybe<Scalars['Boolean']['output']>;
  country: CountrySummary;
  createdAt: Scalars['String']['output'];
  editSuggestions: Array<EditSuggestion>;
  endDay: Scalars['Int']['output'];
  endDescription?: Maybe<Scalars['String']['output']>;
  endMonth: Scalars['Int']['output'];
  endSignificance: Scalars['Float']['output'];
  endYear: Scalars['Int']['output'];
  group?: Maybe<Group>;
  id: Scalars['ID']['output'];
  imageCredit?: Maybe<Scalars['String']['output']>;
  imageStatus?: Maybe<ImageStatus>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  liked?: Maybe<Scalars['Boolean']['output']>;
  likes: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  sourceUrl?: Maybe<Scalars['String']['output']>;
  startDay: Scalars['Int']['output'];
  startDescription: Scalars['String']['output'];
  startMonth: Scalars['Int']['output'];
  startSignificance: Scalars['Float']['output'];
  startYear: Scalars['Int']['output'];
  subjects: Array<Subject>;
  type: PostType;
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type PostInput = {
  civilisation?: InputMaybe<Scalars['Boolean']['input']>;
  country: CountryInput;
  endDay?: InputMaybe<Scalars['Int']['input']>;
  endDescription?: InputMaybe<Scalars['String']['input']>;
  endMonth?: InputMaybe<Scalars['Int']['input']>;
  endSignificance?: InputMaybe<Scalars['Float']['input']>;
  endYear?: InputMaybe<Scalars['Int']['input']>;
  group?: InputMaybe<GroupInput>;
  imageCredit?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sourceUrl?: InputMaybe<Scalars['String']['input']>;
  startDay?: InputMaybe<Scalars['Int']['input']>;
  startDescription: Scalars['String']['input'];
  startMonth?: InputMaybe<Scalars['Int']['input']>;
  startSignificance?: InputMaybe<Scalars['Float']['input']>;
  startYear: Scalars['Int']['input'];
  subjects: Array<SubjectInput>;
  type: PostType;
};

export type PostType =
  | 'event'
  | 'landmark'
  | 'period'
  | 'person';

export type Query = {
  __typename?: 'Query';
  formLists: FormLists;
  getCivilisation: Array<Post>;
  getPopulation: Scalars['BigInt']['output'];
  getPost: Post;
  getSignificant?: Maybe<SignificantPost>;
  pendingCreatedPosts: CreatedPostsResponse;
  pendingEdits: PendingEditsResponse;
  pendingStats: PendingReviewStats;
  timeline: TimelineResponse;
  userLikes: Array<Like>;
  userPosts: Array<Post>;
  userStats: UserStatsResponse;
};


export type QueryGetCivilisationArgs = {
  endYear: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
  startYear: Scalars['Int']['input'];
};


export type QueryGetPopulationArgs = {
  start: Scalars['Int']['input'];
};


export type QueryGetPostArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSignificantArgs = {
  endYear: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
  startYear: Scalars['Int']['input'];
};


export type QueryTimelineArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<FilterInput>;
};


export type QueryUserLikesArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryUserPostsArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryUserStatsArgs = {
  userId: Scalars['Int']['input'];
};

export type ReviewChange = {
  __typename?: 'ReviewChange';
  from?: Maybe<Scalars['JSON']['output']>;
  kind: ReviewChangeKind;
  label: Scalars['String']['output'];
  to?: Maybe<Scalars['JSON']['output']>;
};

export type ReviewChangeKind =
  | 'boolean'
  | 'entity'
  | 'entityList'
  | 'image'
  | 'longText'
  | 'number'
  | 'text';

export type ReviewEntityValue = {
  __typename?: 'ReviewEntityValue';
  continent?: Maybe<Continent>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type ReviewStatus =
  | 'approved'
  | 'pending'
  | 'rejected';

export type SignificantPost = {
  __typename?: 'SignificantPost';
  cdnId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type Subject = {
  __typename?: 'Subject';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Post>;
  updatedAt: Scalars['String']['output'];
};

export type SubjectInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Summary = {
  __typename?: 'Summary';
  createdAt: Scalars['String']['output'];
  endYear: Scalars['Int']['output'];
  headline: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  startYear: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TimelineResponse = {
  __typename?: 'TimelineResponse';
  nextCursor?: Maybe<Scalars['ID']['output']>;
  posts: Array<Post>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  moderatedEdits: Array<EditSuggestion>;
  moderatedPosts: Array<CreatedPost>;
  role: UserRole;
  suggestedEdits: Array<EditSuggestion>;
  suggestedPosts: Array<CreatedPost>;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserRole =
  | 'ADMIN'
  | 'BOT'
  | 'MODERATOR'
  | 'USER';

export type UserStats = {
  __typename?: 'UserStats';
  favouriteEra?: Maybe<Scalars['String']['output']>;
  favouriteGroup?: Maybe<GroupSummary>;
  mostLikedPost?: Maybe<Post>;
};

export type UserStatsResponse = {
  __typename?: 'UserStatsResponse';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  stats: UserStats;
  username: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, username: string, email: string, role: UserRole } } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: string, username: string, email: string, role: UserRole } } };

export type LikePostMutationVariables = Exact<{
  postId: Scalars['Int']['input'];
}>;


export type LikePostMutation = { __typename?: 'Mutation', likePost: { __typename?: 'Post', id: string, likes: number, liked?: boolean | null } };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type CreatePostSuggestionMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostSuggestionMutation = { __typename?: 'Mutation', createPostSuggestion: { __typename?: 'CreatedPost', id: number, status: ReviewStatus, data: any, createdAt: string, updatedAt: string, suggestedBy: { __typename?: 'User', id: string, username: string } } };

export type TimelineQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<FilterInput>;
}>;


export type TimelineQuery = { __typename?: 'Query', timeline: { __typename?: 'TimelineResponse', nextCursor?: string | null, posts: Array<{ __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, cdnId?: string | null, likes: number, liked?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', name: string, icon: string } | null, user: { __typename?: 'User', id: string, username: string } }> } };

export type GetPopulationQueryVariables = Exact<{
  start: Scalars['Int']['input'];
}>;


export type GetPopulationQuery = { __typename?: 'Query', getPopulation: any };

export type GetSignificantQueryVariables = Exact<{
  startYear: Scalars['Int']['input'];
  endYear: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
}>;


export type GetSignificantQuery = { __typename?: 'Query', getSignificant?: { __typename?: 'SignificantPost', id: string, name: string, imageUrl?: string | null, cdnId?: string | null } | null };

export type GetCivilisationQueryVariables = Exact<{
  startYear: Scalars['Int']['input'];
  endYear: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
}>;


export type GetCivilisationQuery = { __typename?: 'Query', getCivilisation: Array<{ __typename?: 'Post', id: string, name: string, startYear: number, endYear: number, startSignificance: number, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, group?: { __typename?: 'Group', id: number } | null }> };

export type GetPostWithFormListsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPostWithFormListsQuery = { __typename?: 'Query', getPost: { __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, civilisation?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', id: number, name: string, icon: string } | null }, formLists: { __typename?: 'FormLists', allCountries: Array<{ __typename?: 'CountrySummary', name: string, continent: Continent }>, allSubjects: Array<{ __typename?: 'Subject', id: string, name: string }>, allGroups: Array<{ __typename?: 'Group', id: number, name: string }> } };

export type GetFormListsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFormListsQuery = { __typename?: 'Query', formLists: { __typename?: 'FormLists', allCountries: Array<{ __typename?: 'CountrySummary', name: string, continent: Continent }>, allSubjects: Array<{ __typename?: 'Subject', id: string, name: string }>, allGroups: Array<{ __typename?: 'Group', id: number, name: string }> } };

export type UserPostsQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type UserPostsQuery = { __typename?: 'Query', userPosts: Array<{ __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, cdnId?: string | null, civilisation?: boolean | null, likes: number, liked?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', icon: string } | null, user: { __typename?: 'User', id: string, username: string, createdAt: string, role: UserRole } }> };

export type UserLikesQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type UserLikesQuery = { __typename?: 'Query', userLikes: Array<{ __typename?: 'Like', post: { __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, cdnId?: string | null, civilisation?: boolean | null, likes: number, liked?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', icon: string } | null, user: { __typename?: 'User', id: string, username: string, createdAt: string, role: UserRole } } }> };

export type UserStatsQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type UserStatsQuery = { __typename?: 'Query', userStats: { __typename?: 'UserStatsResponse', id: number, username: string, createdAt: string, stats: { __typename?: 'UserStats', favouriteEra?: string | null, mostLikedPost?: { __typename?: 'Post', id: string, name: string, likes: number, cdnId?: string | null, imageUrl?: string | null, liked?: boolean | null } | null, favouriteGroup?: { __typename?: 'GroupSummary', name: string, icon?: string | null } | null } } };

export type PendingCreatedPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingCreatedPostsQuery = { __typename?: 'Query', pendingCreatedPosts: { __typename?: 'CreatedPostsResponse', createdPosts: Array<{ __typename?: 'PendingCreatedPostReview', id: number, data: any, createdAt: string, updatedAt: string, suggestedBy: { __typename?: 'User', id: string, username: string } }> } };

export type PendingStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingStatsQuery = { __typename?: 'Query', pendingStats: { __typename?: 'PendingReviewStats', pending: number, approved: number, rejected: number } };

export type PendingEditsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingEditsQuery = { __typename?: 'Query', pendingEdits: { __typename?: 'PendingEditsResponse', edits: Array<{ __typename?: 'PendingEditReview', id: number, hasImageChanges: boolean, suggestedBy: { __typename?: 'User', id: string, username: string }, post: { __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, cdnId?: string | null, civilisation?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', id: number, name: string, icon: string } | null }, changes: { __typename?: 'PendingEditChanges', name?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, type?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, startYear?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, startMonth?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, startDay?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, endYear?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, endMonth?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, endDay?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, startDescription?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, endDescription?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, startSignificance?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, endSignificance?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, civilisation?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, country?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, group?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, subjects?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, imageUrl?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, imageCredit?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null, sourceUrl?: { __typename?: 'ReviewChange', label: string, kind: ReviewChangeKind, from?: any | null, to?: any | null } | null } }> } };
