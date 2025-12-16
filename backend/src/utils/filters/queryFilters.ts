export function queryFilters(filter: any = {}, overrides: any = {}) {
  const where: any = { ...overrides };

  if (filter) {
    // Type filter
    if (filter.type?.length) {
      where.type = { in: filter.type };
    }

    // Subjects filter
    if (filter.subject?.length) {
      where.subjects = {
        some: { name: { in: filter.subject } },
      };
    }

    // Continent filter
    if (filter.continent?.length) {
      where.country = {
        continent: { in: filter.continent },
      };
    }

    // Dynamic OR conditions
    const orConditions: any[] = [];

    // Year range
    if (filter.yearStart && filter.yearEnd) {
      orConditions.push(
        {
          startYear: {
            gte: filter.yearStart,
            lte: filter.yearEnd,
          },
          startSignificance: { gt: 0 },
        },
        {
          endYear: {
            gte: filter.yearStart,
            lte: filter.yearEnd,
          },
          endSignificance: { gt: 0.8 },
        }
      );
    }

    // Group
    if (
      filter.group !== undefined &&
      filter.group !== null &&
      filter.group !== 0
    ) {
      where.groupId = Number(filter.group);
    }

    // Text search
    if (filter.search?.length) {
      const search = filter.search;
      orConditions.push(
        { name: { contains: search } },
        { startDescription: { contains: search } },
        { endDescription: { contains: search } }
      );
    }

    if (orConditions.length) {
      where.OR = orConditions;
    }
  }

  return where;
}
