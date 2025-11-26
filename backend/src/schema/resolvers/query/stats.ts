import prisma from "../../../server/client";
import { interpolatePopulation } from "../../../utils/populationData";

export async function getPopulation(_: any, { start }: { start: number }) {
  const windows = await prisma.population.findMany({
    where: {
      OR: [
        { yearStart: { lte: start }, yearEnd: { gte: start } },
        { yearStart: { gt: start } },
      ],
    },
    orderBy: { yearStart: "asc" },
    take: 2,
  });

  if (windows.length === 0) return 0;
  const current = windows[0];
  const next = windows[1];
  return interpolatePopulation(current, next, start);
}

export async function getSignificant(
  _: any,
  { startYear, endYear }: { startYear: number; endYear: number }
) {
  const post = await prisma.post.findFirst({
    where: {
      startYear: { gte: startYear, lte: endYear },
      OR: [
        { startSignificance: { gt: 0 } },
        { endSignificance: { gt: 0 } },
      ],
    },
    orderBy: [
      { startSignificance: "desc" },
      { endSignificance: "desc" },
    ],
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });

  return post ?? null;
}

export async function getCivilisation(
  _: any,
  { startYear, endYear }: { startYear: number; endYear: number }
) {
  return prisma.post.findMany({
    where: {
      type: "period",
      subjects: {
        some: {
          name: { in: ["culture", "art", "military", "intellectual"] },
        },
      },
      OR: [
        {
          startYear: { lte: endYear },
          endYear: { gte: startYear },
          startSignificance: { gt: 0 },
        },
        {
          startYear: { lte: endYear },
          endYear: { gte: startYear },
          endSignificance: { gt: 0 },
        },
      ],
    },
    orderBy: { country: { continent: "asc" } },
  });
}
