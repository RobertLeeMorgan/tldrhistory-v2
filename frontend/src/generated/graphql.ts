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

export type CountrySummary = {
  __typename?: 'CountrySummary';
  continent: Continent;
  name: Scalars['String']['output'];
};

export type EditSuggestion = {
  __typename?: 'EditSuggestion';
  createdAt: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  id: Scalars['Int']['output'];
  moderator?: Maybe<User>;
  post: Post;
  status: Scalars['String']['output'];
  suggestedBy: User;
  updatedAt: Scalars['String']['output'];
};

export type FilterInput = {
  continent?: InputMaybe<Array<Scalars['String']['input']>>;
  group?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['Boolean']['input']>;
  subject?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Array<Scalars['String']['input']>>;
  yearEnd?: InputMaybe<Scalars['Int']['input']>;
  yearStart?: InputMaybe<Scalars['Int']['input']>;
};

export type Group = {
  __typename?: 'Group';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Like = {
  __typename?: 'Like';
  post: Post;
};

export type Mutation = {
  __typename?: 'Mutation';
  approveEdit: Post;
  deletePost: Scalars['Boolean']['output'];
  editTimeline: Post;
  likePost: Post;
  login: AuthPayload;
  postTimeline: Post;
  register: AuthPayload;
  rejectEdit: Scalars['Boolean']['output'];
  suggestEdit: EditSuggestion;
};


export type MutationApproveEditArgs = {
  id: Scalars['Int']['input'];
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


export type MutationRejectEditArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSuggestEditArgs = {
  input: PostInput;
  postId: Scalars['Int']['input'];
};

export type Population = {
  __typename?: 'Population';
  population: Scalars['BigInt']['output'];
  yearEnd: Scalars['Int']['output'];
  yearStart: Scalars['Int']['output'];
};

export type Post = {
  __typename?: 'Post';
  civilisation?: Maybe<Scalars['Boolean']['output']>;
  country: CountrySummary;
  editSuggestions: Array<EditSuggestion>;
  endDay: Scalars['Int']['output'];
  endDescription?: Maybe<Scalars['String']['output']>;
  endMonth: Scalars['Int']['output'];
  endSignificance: Scalars['Float']['output'];
  endYear: Scalars['Int']['output'];
  group?: Maybe<Group>;
  id: Scalars['ID']['output'];
  imageCredit?: Maybe<Scalars['String']['output']>;
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
  user: User;
};

export type PostInput = {
  countryId: Scalars['String']['input'];
  endDay?: InputMaybe<Scalars['Int']['input']>;
  endDescription?: InputMaybe<Scalars['String']['input']>;
  endMonth?: InputMaybe<Scalars['Int']['input']>;
  endSignificance?: InputMaybe<Scalars['Float']['input']>;
  endYear?: InputMaybe<Scalars['Int']['input']>;
  groupId?: InputMaybe<Scalars['Int']['input']>;
  imageCredit?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sourceUrl?: InputMaybe<Scalars['String']['input']>;
  startDay?: InputMaybe<Scalars['Int']['input']>;
  startDescription: Scalars['String']['input'];
  startMonth?: InputMaybe<Scalars['Int']['input']>;
  startSignificance?: InputMaybe<Scalars['Float']['input']>;
  startYear: Scalars['Int']['input'];
  subjects: Array<Scalars['ID']['input']>;
  type: Scalars['String']['input'];
};

export type PostType =
  | 'event'
  | 'landmark'
  | 'period'
  | 'person';

export type PostWithLists = {
  __typename?: 'PostWithLists';
  allCountries: Array<CountrySummary>;
  allGroups: Array<Group>;
  allSubjects: Array<Subject>;
  post: Post;
};

export type Query = {
  __typename?: 'Query';
  getCivilisation: Array<Post>;
  getHeadline?: Maybe<Scalars['String']['output']>;
  getPopulation: Scalars['BigInt']['output'];
  getPost: PostWithLists;
  getSignificant?: Maybe<SignificantPost>;
  getUser?: Maybe<User>;
  pendingEdits: Array<EditSuggestion>;
  timeline: TimelineResponse;
};


export type QueryGetCivilisationArgs = {
  endYear: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
  startYear: Scalars['Int']['input'];
};


export type QueryGetHeadlineArgs = {
  endYear: Scalars['Int']['input'];
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


export type QueryGetUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTimelineArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<FilterInput>;
};

export type SignificantPost = {
  __typename?: 'SignificantPost';
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Post>;
};

export type Summary = {
  __typename?: 'Summary';
  createdAt: Scalars['String']['output'];
  endYear: Scalars['Int']['output'];
  headline: Scalars['String']['output'];
  id: Scalars['ID']['output'];
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
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likes: Array<Like>;
  moderatedEdits: Array<EditSuggestion>;
  posts: Array<Post>;
  role: UserRole;
  suggestedEdits: Array<EditSuggestion>;
  username: Scalars['String']['output'];
};

export type UserRole =
  | 'ADMIN'
  | 'BOT'
  | 'MODERATOR'
  | 'USER';

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

export type TimelineQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filter?: InputMaybe<FilterInput>;
}>;


export type TimelineQuery = { __typename?: 'Query', timeline: { __typename?: 'TimelineResponse', nextCursor?: string | null, posts: Array<{ __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, likes: number, liked?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', name: string, icon: string } | null, user: { __typename?: 'User', username: string, id: string } }> } };

export type GetPopulationQueryVariables = Exact<{
  start: Scalars['Int']['input'];
}>;


export type GetPopulationQuery = { __typename?: 'Query', getPopulation: any };

export type GetSignificantQueryVariables = Exact<{
  start: Scalars['Int']['input'];
  end: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
}>;


export type GetSignificantQuery = { __typename?: 'Query', getSignificant?: { __typename?: 'SignificantPost', id: string, name: string, imageUrl?: string | null } | null };

export type GetCivilisationQueryVariables = Exact<{
  start: Scalars['Int']['input'];
  end: Scalars['Int']['input'];
  filter?: InputMaybe<FilterInput>;
}>;


export type GetCivilisationQuery = { __typename?: 'Query', getCivilisation: Array<{ __typename?: 'Post', id: string, name: string }> };

export type GetPostQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPostQuery = { __typename?: 'Query', getPost: { __typename?: 'PostWithLists', post: { __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, startSignificance: number, endSignificance: number, imageUrl?: string | null, imageCredit?: string | null, sourceUrl?: string | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', name: string, icon: string, id: number } | null }, allCountries: Array<{ __typename?: 'CountrySummary', name: string, continent: Continent }>, allSubjects: Array<{ __typename?: 'Subject', id: string, name: string }>, allGroups: Array<{ __typename?: 'Group', id: number, name: string }> } };

export type GetHeadlineQueryVariables = Exact<{
  startYear: Scalars['Int']['input'];
  endYear: Scalars['Int']['input'];
}>;


export type GetHeadlineQuery = { __typename?: 'Query', getHeadline?: string | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: string, username: string, posts: Array<{ __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, imageUrl?: string | null, likes: number, liked?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', icon: string } | null }>, likes: Array<{ __typename?: 'Like', post: { __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, imageUrl?: string | null, likes: number, liked?: boolean | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', icon: string } | null } }> } | null };

export type PendingEditsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingEditsQuery = { __typename?: 'Query', pendingEdits: Array<{ __typename?: 'EditSuggestion', id: number, status: string, data: any, createdAt: string, suggestedBy: { __typename?: 'User', id: string, username: string }, post: { __typename?: 'Post', id: string, name: string, type: PostType, startDescription: string, endDescription?: string | null, startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number, sourceUrl?: string | null, imageCredit?: string | null, imageUrl?: string | null, country: { __typename?: 'CountrySummary', name: string, continent: Continent }, subjects: Array<{ __typename?: 'Subject', id: string, name: string }>, group?: { __typename?: 'Group', name: string, icon: string, id: number } | null } }> };
