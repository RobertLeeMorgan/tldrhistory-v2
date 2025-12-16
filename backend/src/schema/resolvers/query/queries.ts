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
          group: true,
        },
      },
    },
  });

  const mappedEdits = await Promise.all(
    edits.map(async (edit) => {
      if (!edit.data || typeof edit.data !== "object") {
        return edit;
      }

      const data = { ...edit.data } as any;

      if (Array.isArray(data.subjects)) {
        data.subjects = await Promise.all(
          data.subjects.map(async (id: number | string) => {
            const subject = await prisma.subject.findUnique({
              where: { id: Number(id) },
            });
            return {
              id: String(id),
              name: subject?.name ?? "Unknown",
            };
          })
        );
      }

      if (data.groupId) {
        const group = await prisma.group.findUnique({
          where: { id: data.groupId },
        });

        data.group = {
          id: data.groupId,
          name: group?.name ?? "Unknown",
        };
      }

      return {
        ...edit,
        data,
      };
    })
  );

  return mappedEdits;
}


export async function getPost(_: any, { id }: { id: number }, ctx: Context) {
  requireRole(ctx, ["USER", "MODERATOR", "ADMIN"]);

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      country: true,
      subjects: true,
      group: true,
    },
  });

  if (!post) throw new Error("Post not found");

  const [allCountries, allSubjects, allGroups] = await Promise.all([
    prisma.country.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.group.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    post,
    allCountries,
    allSubjects,
    allGroups
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
