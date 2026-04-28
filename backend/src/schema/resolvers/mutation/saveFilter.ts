import { Prisma } from "@prisma/client";
import prisma from "../../../server/client";
import { requireAuth } from "../../../utils/auth/requireAuth";
import { Context } from "../query/user";

type SavedFilterState = {
  search?: string | null;
  sortBy?: boolean | null;
  type: string[];
  subject: string[];
  continent: string[];
  yearStart?: number | null;
  yearEnd?: number | null;
  group: number;
  view?: string | null;
};

type SaveFilterArgs = {
  input: {
    name: string;
    state: SavedFilterState;
  };
};

type EditSavedFilterArgs = {
  input: {
    id: number;
    name?: string | null;
    state?: SavedFilterState | null;
  };
};

type DeleteSavedFilterArgs = {
  input: {
    id: number;
  };
};

function normalizeFilterName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("Filter name is required");
  }

  return trimmed;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeOptionalNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function normalizeOptionalBoolean(value: unknown): boolean | null {
  if (typeof value !== "boolean") {
    return null;
  }

  return value;
}

function normalizeRequiredNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${field} is required`);
  }

  return value;
}

function normalizeSavedFilterState(input: SavedFilterState): Prisma.InputJsonValue {
  return {
    search: normalizeOptionalString(input.search),
    sortBy: normalizeOptionalBoolean(input.sortBy),
    type: normalizeStringArray(input.type),
    subject: normalizeStringArray(input.subject),
    continent: normalizeStringArray(input.continent),
    yearStart: normalizeOptionalNumber(input.yearStart),
    yearEnd: normalizeOptionalNumber(input.yearEnd),
    group: normalizeRequiredNumber(input.group, "group"),
    view: normalizeOptionalString(input.view),
  };
}

function isPrismaKnownError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export async function saveFilter(
  _: unknown,
  { input }: SaveFilterArgs,
  ctx: Context,
) {
  const authUser = requireAuth(ctx);
  const userId = authUser.id;

  const name = normalizeFilterName(input.name);
  const state = normalizeSavedFilterState(input.state);

  try {
    return await prisma.$transaction(async (tx) => {
      const count = await tx.savedFilter.count({
        where: { userId },
      });

      if (count >= 3) {
        throw new Error("You can only save up to 3 filters");
      }

      return tx.savedFilter.create({
        data: {
          userId,
          name,
          state,
        },
      });
    });
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2002") {
      throw new Error("You already have a saved filter with that name");
    }

    throw error;
  }
}

export async function editSavedFilter(
  _: unknown,
  { input }: EditSavedFilterArgs,
  ctx: Context,
) {
  const authUser = requireAuth(ctx);
  const userId = authUser.id;

  const existing = await prisma.savedFilter.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!existing) {
    throw new Error("Saved filter not found");
  }

  const data: Prisma.SavedFilterUpdateInput = {};

  if (typeof input.name === "string") {
    data.name = normalizeFilterName(input.name);
  }

  if (input.state) {
    data.state = normalizeSavedFilterState(input.state);
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No changes provided");
  }

  try {
    return await prisma.savedFilter.update({
      where: { id: input.id },
      data,
    });
  } catch (error) {
    if (isPrismaKnownError(error) && error.code === "P2002") {
      throw new Error("You already have a saved filter with that name");
    }

    throw error;
  }
}

export async function deleteSavedFilter(
  _: unknown,
  { input }: DeleteSavedFilterArgs,
  ctx: Context,
) {
  const authUser = requireAuth(ctx);
  const userId = authUser.id;

  const existing = await prisma.savedFilter.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!existing) {
    throw new Error("Saved filter not found");
  }

  return prisma.savedFilter.delete({
    where: { id: input.id },
  });
}