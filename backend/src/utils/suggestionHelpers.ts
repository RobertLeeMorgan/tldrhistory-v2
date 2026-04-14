
export const SUGGESTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export function hasImageChanged(data: any, existingPost: any) {
  return (
    (data.imageUrl !== undefined && data.imageUrl !== existingPost.imageUrl) ||
    (data.imageCredit !== undefined &&
      data.imageCredit !== existingPost.imageCredit) ||
    (data.sourceUrl !== undefined && data.sourceUrl !== existingPost.sourceUrl)
  );
}

export function shouldTransferOwnership(existingPost: any) {
  return (
    existingPost.user?.role === "BOT" ||
    existingPost.user?.username === "HistOracle"
  );
}
export function normalizePostName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/^(the|a|an)\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


type ChangeKind =
  | "text"
  | "longText"
  | "number"
  | "boolean"
  | "entity"
  | "entityList"
  | "image";

type ReviewChange = {
  label: string;
  kind: ChangeKind;
  from: any;
  to: any;
};

const POST_FIELDS: Record<string, { label: string; kind: ChangeKind }> = {
  name: { label: "Name", kind: "text" },
  type: { label: "Type", kind: "text" },
  startYear: { label: "Start year", kind: "number" },
  startMonth: { label: "Start month", kind: "number" },
  startDay: { label: "Start day", kind: "number" },
  endYear: { label: "End year", kind: "number" },
  endMonth: { label: "End month", kind: "number" },
  endDay: { label: "End day", kind: "number" },
  startDescription: { label: "Start description", kind: "longText" },
  endDescription: { label: "End description", kind: "longText" },
  startSignificance: { label: "Start significance", kind: "number" },
  endSignificance: { label: "End significance", kind: "number" },
  civilisation: { label: "Civilisation", kind: "boolean" },
  imageUrl: { label: "Image URL", kind: "image" },
  imageCredit: { label: "Image credit", kind: "image" },
  sourceUrl: { label: "Source URL", kind: "image" },
};

export function buildChanges(post: any, data: any): Record<string, ReviewChange> {
  const changes: Record<string, ReviewChange> = {};

  // Scalar fields
  for (const [field, { label, kind }] of Object.entries(POST_FIELDS)) {
    const from = post[field];
    const to = data[field] ?? post[field];
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      changes[field] = { label, kind, from, to };
    }
  }

  // Country
  const nextCountry = data.country !== undefined ? data.country : post.country;

  if (JSON.stringify(post.country) !== JSON.stringify(nextCountry)) {
    changes.country = {
      label: "Country",
      kind: "entity",
      from: post.country,
      to: nextCountry,
    };
  }

  // Group
  const nextGroup = data.group !== undefined ? data.group : post.group;

  if (JSON.stringify(post.group) !== JSON.stringify(nextGroup)) {
    changes.group = {
      label: "Group",
      kind: "entity",
      from: post.group,
      to: nextGroup,
    };
  }

  // Subjects
  const nextSubjects =
    data.subjects !== undefined ? data.subjects : post.subjects;

  if (JSON.stringify(post.subjects) !== JSON.stringify(nextSubjects)) {
    changes.subjects = {
      label: "Subjects",
      kind: "entityList",
      from: post.subjects,
      to: nextSubjects,
    };
  }

  return changes;
}

export function buildReviewStats(
  editRows: Array<{ status: string; _count: { _all: number } }>,
  createdRows: Array<{ status: string; _count: { _all: number } }>,
) {
  const map = new Map<string, number>();

  for (const row of editRows) {
    map.set(row.status, (map.get(row.status) ?? 0) + row._count._all);
  }
  for (const row of createdRows) {
    map.set(row.status, (map.get(row.status) ?? 0) + row._count._all);
  }

  return {
    pending: map.get("pending") ?? 0,
    approved: map.get("approved") ?? 0,
    rejected: map.get("rejected") ?? 0,
  };
}
