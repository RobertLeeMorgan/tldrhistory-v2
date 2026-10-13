import { GraphQLError } from "graphql";
import prisma from "../../../server/client";
import { queryFilters } from "../../../utils/filters/queryFilters";
import { timelinePostSelect } from "../../../utils/timelineSelect";
import { Context } from "./user";

type PopulationArgs = {
  start: number;
};

type SignificantArgs = {
  startYear: number;
  endYear: number;
  filter?: any;
};

type CivilisationArgs = {
  startYear: number;
  endYear: number;
  filter?: any;
};

function buildRangeWhere(startYear: number, endYear: number, filter?: any) {
  return queryFilters(filter, {
    startYear: { gte: startYear, lte: endYear },
    OR: [{ startSignificance: { gt: 0 } }, { endSignificance: { gt: 0 } }],
  });
}

const SIGNIFICANT_POST_TYPES = ["person", "event", "landmark"] as const;

async function findMostSignificantPost(
  type: (typeof SIGNIFICANT_POST_TYPES)[number],
  baseWhere: ReturnType<typeof buildRangeWhere>,
) {
  const typedWhere = { AND: [baseWhere, { type }] };

  const endingPost = await prisma.post.findFirst({
    where: {
      AND: [typedWhere, { startSignificance: 1 }],
    },
    orderBy: { endSignificance: "desc" },
    select: timelinePostSelect,
  });

  return endingPost ?? prisma.post.findFirst({
    where: typedWhere,
    orderBy: { startSignificance: "desc" },
    select: timelinePostSelect,
  });
}

export async function getPopulation(_: unknown, { start }: PopulationArgs) {
  const year = Number(start);
  if (!Number.isInteger(year)) {
    throw new GraphQLError("Invalid year", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const window = await prisma.population.findFirst({
    where: {
      OR: [
        { yearStart: { lte: year }, yearEnd: { gte: year } },
        { yearStart: { gt: year } },
      ],
    },
    orderBy: { yearStart: "asc" },
    select: { population: true },
  });

  return window?.population ?? BigInt(0);
}

export async function getSignificant(
  _: unknown,
  { startYear, endYear, filter }: SignificantArgs,
  ctx: Context,
) {
  const parsedStart = Number(startYear);
  const parsedEnd = Number(endYear);

  if (!Number.isInteger(parsedStart) || !Number.isInteger(parsedEnd)) {
    throw new GraphQLError("Invalid year range", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const baseWhere = buildRangeWhere(parsedStart, parsedEnd, filter);
  const posts = await Promise.all(
    SIGNIFICANT_POST_TYPES.map((type) => findMostSignificantPost(type, baseWhere)),
  );
  const postIds = posts.flatMap((post) => post ? [post.id] : []);
  const likedPosts = ctx.user?.id && postIds.length > 0
    ? await prisma.like.findMany({
        where: { userId: ctx.user.id, postId: { in: postIds } },
        select: { postId: true },
      })
    : [];
  const likedIds = new Set(likedPosts.map(({ postId }) => postId));
  const normalizedPosts = posts.map((post) => {
    if (!post) return null;
    const { _count, ...article } = post;
    return {
      ...article,
      likes: _count.likes,
      liked: likedIds.has(post.id),
    };
  });

  return Object.fromEntries(
    SIGNIFICANT_POST_TYPES.map((type, index) => [type, normalizedPosts[index]]),
  );
}

export async function getCivilisation(
  _: unknown,
  { startYear, endYear, filter }: CivilisationArgs
) {
  const parsedStart = Number(startYear);
  const parsedEnd = Number(endYear);

  if (!Number.isInteger(parsedStart) || !Number.isInteger(parsedEnd)) {
    throw new GraphQLError("Invalid year range", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const filterWhere = queryFilters(filter);

  const where = {
    AND: [
      {
        civilisation: true,
      },
      {
        subjects: {
          some: {
            name: { in: ["culture", "military"] },
          },
        },
      },
      {
        OR: [
          {
            startYear: { lte: parsedEnd },
            endYear: { gte: parsedStart },
          },
          {
            startYear: { lte: parsedEnd },
            endYear: 0,
          },
        ],
      },
      {
        OR: [
          { startSignificance: { gt: 0 } },
          { endSignificance: { gt: 0 } },
        ],
      },
      filterWhere,
    ],
  };

  return prisma.post.findMany({
    where,
    orderBy: { startSignificance: "desc" },
    select: {
      id: true,
      name: true,
      startYear: true,
      endYear: true,
      startSignificance: true,
      group: { select: { id: true } },
      country: { select: { name: true, continent: true } },
    },
  });
}
