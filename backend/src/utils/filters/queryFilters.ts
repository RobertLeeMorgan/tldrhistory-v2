export function queryFilters(filter: any = {}, overrides: any = {}) {
  const where: any = { ...overrides };
  const andConditions: any[] = [];

  if (filter.type?.length) {
    andConditions.push({
      type: { in: filter.type },
    });
  }

  if (filter.subject?.length) {
    andConditions.push({
      subjects: {
        some: { name: { in: filter.subject } },
      },
    });
  }

  if (filter.continent?.length) {
    andConditions.push({
      country: {
        continent: { in: filter.continent },
      },
    });
  }

  if (
    filter.group !== undefined &&
    filter.group !== null &&
    filter.group !== 0
  ) {
    andConditions.push({
      groupId: Number(filter.group),
    });
  }

if (filter.yearStart != null && filter.yearEnd != null) {
  andConditions.push({
    OR: [
      {
        startYear: {
          gte: filter.yearStart,
          lte: filter.yearEnd,
        },
      },
      {
        endYear: {
          not: 0,
          gte: filter.yearStart,
          lte: filter.yearEnd,
        },
         endSignificance: {
          gt: 0.5,
        },
      },
    ],
  });
}
  if (filter.search?.trim()) {
    const search = filter.search.trim();

    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { startDescription: { contains: search, mode: "insensitive" } },
        { endDescription: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (andConditions.length) {
    where.AND = andConditions;
  }

  return where;
}