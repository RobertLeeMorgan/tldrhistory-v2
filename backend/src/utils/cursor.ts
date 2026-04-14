import { GraphQLError } from "graphql";

type TimelineCursor = {
  startYear: number;
  startMonth: number | null;
  startDay: number | null;
  id: number;
};

export function encodeCursor(value: TimelineCursor) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

export function decodeCursor(cursor: string): TimelineCursor {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));

    if (
      typeof parsed?.startYear !== "number" ||
      typeof parsed?.id !== "number" ||
      !("startMonth" in parsed) ||
      !("startDay" in parsed)
    ) {
      throw new Error("Invalid cursor payload");
    }

    return {
      startYear: parsed.startYear,
      startMonth: parsed.startMonth ?? null,
      startDay: parsed.startDay ?? null,
      id: parsed.id,
    };
  } catch {
    throw new GraphQLError("Invalid cursor", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
}

export function buildCursorWhere(
  cursor: TimelineCursor,
  direction: "asc" | "desc",
) {
  const op = direction === "asc" ? "gt" : "lt";

  return {
    OR: [
      { startYear: { [op]: cursor.startYear } },
      {
        startYear: cursor.startYear,
        startMonth: { [op]: cursor.startMonth },
      },
      {
        startYear: cursor.startYear,
        startMonth: cursor.startMonth,
        startDay: { [op]: cursor.startDay },
      },
      {
        startYear: cursor.startYear,
        startMonth: cursor.startMonth,
        startDay: cursor.startDay,
        id: { [op]: cursor.id },
      },
    ],
  };
}
