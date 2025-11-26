import * as QueryTimeline from "./query/timeline";
import * as QueryStats from "./query/stats";
import * as QueryUser from "./query/user";
import * as MutationAuth from "./mutation/auth";
import * as MutationPosts from "./mutation/posts";
import * as MutationEdits from "./mutation/edits";
import * as MutationDelete from "./mutation/delete";
import * as MutationLikePosts from "./mutation/likePost";
import * as OtherQueries from "./query/queries";

export const resolvers = {
  Query: {
    ...QueryTimeline,
    ...QueryStats,
    ...QueryUser,
    ...OtherQueries,
  },
  Mutation: {
    ...MutationAuth,
    ...MutationPosts,
    ...MutationEdits,
    ...MutationDelete,
    ...MutationLikePosts,
  },
};
