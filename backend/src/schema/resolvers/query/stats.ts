import { GraphQLError } from "graphql";
import prisma from "../../../server/client";
import { queryFilters } from "../../../utils/filters/queryFilters";

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

function buildRangeWhere(
  startYear: number,
  endYear: number,
  filter?: any
) {
  return queryFilters(filter, {
    startYear: { gte: startYear, lte: endYear },
    OR: [
      { startSignificance: { gt: 0 } },
      { endSignificance: { gt: 0 } },
    ],
  });
}

export async function getPopulation(
  _: unknown,
  { start }: PopulationArgs
) {
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
  { startYear, endYear, filter }: SignificantArgs
) {
  const parsedStart = Number(startYear);
  const parsedEnd = Number(endYear);
  
  if (!Number.isInteger(parsedStart) || !Number.isInteger(parsedEnd)) {
    throw new GraphQLError("Invalid year range", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const baseWhere = buildRangeWhere(parsedStart, parsedEnd, filter);

  // Try highest endSignificance first
  let post = await prisma.post.findFirst({
    where: {
      ...baseWhere,
      startSignificance: 1,
    },
    orderBy: { endSignificance: "desc" },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      cdnId: true,
    },
  });

  // Fallback to highest startSignificance
  if (!post) {
    post = await prisma.post.findFirst({
      where: baseWhere,
      orderBy: { startSignificance: "desc" },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        cdnId: true,
        civilisation: true,
        imageStatus: true,
      },
    });
  }

  return post ?? null;
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

  const where = {
    civilisation: true,
    subjects: {
      some: {
        name: { in: ["culture", "military"] },
      },
    },
    OR: [
      {
        startYear: { lte: parsedEnd },
        AND: [
          { endYear: { gte: parsedStart } },
          { OR: [{ endYear: { gte: parsedStart } }, { endYear: 0 }] },
        ],
        startSignificance: { gt: 0 },
      },
      {
        startYear: { lte: parsedEnd },
        AND: [
          { endYear: { gte: parsedStart } },
          { OR: [{ endYear: { gte: parsedStart } }, { endYear: 0 }] },
        ],
        endSignificance: { gt: 0 },
      },
    ],
    ...queryFilters(filter, {
      startYear: { gte: parsedStart, lte: parsedEnd },
    }),
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