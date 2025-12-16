import prisma from "../../../server/client";
import { interpolatePopulation } from "../../../utils/populationData";
import { queryFilters } from "../../../utils/filters/queryFilters";

export async function getPopulation(_: any, { start }: { start: number }) {
  const window = await prisma.population.findFirst({
    where: {
      OR: [
        { yearStart: { lte: start }, yearEnd: { gte: start } },

        { yearStart: { gt: start } },
      ],
    },
    orderBy: { yearStart: "asc" },
  });

  if (!window) return 0;

  return window.population;
}

export async function getSignificant(
  _: any,
  {
    startYear,
    endYear,
    filter,
  }: { startYear: number; endYear: number; filter: any }
) {
  const baseWhere = queryFilters(filter, {
    startYear: { gte: startYear, lte: endYear },
    OR: [{ startSignificance: { gt: 0 } }, { endSignificance: { gt: 0 } }],
  });

  let post = await prisma.post.findFirst({
    where: { ...baseWhere, startSignificance: 1 },
    orderBy: { endSignificance: 'desc' },
    select: { id: true, name: true, imageUrl: true },
  });

  if (!post) {
    post = await prisma.post.findFirst({
      where: baseWhere,
      orderBy: { startSignificance: 'desc' },
      select: { id: true, name: true, imageUrl: true },
    });
  }

  return post ?? null;
}

export async function getCivilisation(
  _: any,
  {
    startYear,
    endYear,
    filter,
  }: { startYear: number; endYear: number; filter: any }
) {
  const where = queryFilters(filter, {
    civilisation: true,
    subjects: {
      some: {
        name: { in: ["culture", "military"] },
      },
    },
    OR: [
      {
        startYear: { lte: endYear },
        OR: [
          { endYear: { gte: startYear } },
          { endYear: 0 },
        ],
        startSignificance: { gt: 0 },
      },
      {
        startYear: { lte: endYear },
        OR: [
          { endYear: { gte: startYear } },
          { endYear: 0 },
        ],
        endSignificance: { gt: 0 },
      },
    ],
  });

  return prisma.post.findMany({
    where,
    orderBy: { startSignificance: "desc" },
  });
}

