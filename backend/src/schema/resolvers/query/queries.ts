import { requireRole } from "../../../utils/requireRole";
import prisma from "../../../server/client";
import { Context } from "./user";

export async function pendingEdits(_: any, __: any, ctx: Context) {
  requireRole(ctx, ["MODERATOR", "ADMIN"]);

  const edits = await prisma.editSuggestion.findMany({
    where: { status: "pending" },
    include: {
      suggestedBy: true,
      post: {
        include: {
          country: true,
          subjects: true,
        },
      },
    },
  });

  const allSubjects = edits.flatMap((edit) => edit.post.subjects);
  const subjectMap = Object.fromEntries(allSubjects.map((s) => [s.id, s.name]));

  const mappedEdits = edits.map((edit) => {
    if (!edit.data || typeof edit.data !== "object") {
      return edit;
    }
    const data = { ...edit.data } as any;

    if (Array.isArray(data.subjects)) {
      data.subjects = data.subjects.map((id: number) => ({
        id: String(id),
        name: subjectMap[id] ?? "Unknown",
      }));
    }

    return {
      ...edit,
      data,
    };
  });

  return mappedEdits;
}

export async function getPost(_: any, { id }: { id: number }, ctx: Context) {
  requireRole(ctx, ["USER", "MODERATOR", "ADMIN"]);

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      country: true,
      subjects: true,
    },
  });

  if (!post) throw new Error("Post not found");

  const [allCountries, allSubjects] = await Promise.all([
    prisma.country.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    post,
    allCountries,
    allSubjects,
  };
}

export async function getHeadline(
  _: any,
  { startYear, endYear }: { startYear: number; endYear: number }
) {
  const summary = await prisma.summary.findUnique({
    where: {
      startYear_endYear: {
        startYear,
        endYear,
      },
    },
  });

  return summary ? summary.headline : null;
}
