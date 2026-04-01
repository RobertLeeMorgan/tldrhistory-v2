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
    select: {
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
      imageCredit: true,
      sourceUrl: true,
      civilisation: true,
      country: { select: { name: true, continent: true } },
      subjects: { select: { id: true, name: true } },
      group: { select: { id: true, name: true, icon: true } },
    },
  });

  if (!post) throw new Error("Post not found");

  const [allCountries, allSubjects, allGroups] = await Promise.all([
    prisma.country.findMany({ select: { name: true, continent: true }, orderBy: { name: "asc" } }),
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.group.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return {
    post,
    allCountries,
    allSubjects,
    allGroups,
  };
}