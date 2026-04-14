
export const timelinePostSelect = {
  id: true,
  name: true,
  type: true,
  startDescription: true,
  endDescription: true,
  startYear: true,
  startMonth: true,
  startDay: true,
  endYear: true,
  endMonth: true,
  endDay: true,
  startSignificance: true,
  endSignificance: true,
  imageUrl: true,
  cdnId: true,
  civilisation: true,
  imageCredit: true,
  sourceUrl: true,
  country: {
    select: {
      name: true,
      continent: true,
    },
  },
  subjects: {
    select: {
      id: true,
      name: true,
    },
  },
  group: {
    select: {
      id: true,
      name: true,
      icon: true,
    },
  },
  user: {
    select: {
      id: true,
      username: true,
    },
  },
  _count: {
    select: {
      likes: true,
    },
  },
} as const;