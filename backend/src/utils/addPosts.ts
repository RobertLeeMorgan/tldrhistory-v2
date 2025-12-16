import { AIOutput } from "../services/ai/types";
import prisma from "../server/client";
import type { User } from "@prisma/client";
import { Context } from "../schema/resolvers/query/user";
import { postSchema } from "../validators/postSchema";

export async function addPosts(
  aiPost: AIOutput[number] & {
    imageUrl?: string;
    imageCredit?: string | null;
  },
  bot: User,
  ctx: Context
) {
  try {
    const subjectRecords = await prisma.subject.findMany({
      where: { name: { in: aiPost.subjects } },
    });

    const subjects = subjectRecords.map((s) => s.id);

    const completeInput = {
      name: aiPost.name,
      type: aiPost.type,
      startDescription: aiPost.startDescription,
      endDescription: aiPost.endDescription ?? "",
      startYear: aiPost.startYear,
      startMonth: aiPost.startMonth,
      startDay: aiPost.startDay,
      endYear: aiPost.endYear,
      endMonth: aiPost.endMonth,
      endDay: aiPost.endDay,
      startSignificance: aiPost.startSignificance,
      endSignificance: aiPost.endSignificance,
      imageUrl: aiPost.imageUrl ?? "",
      imageCredit: aiPost.imageCredit ?? null,
      sourceUrl: aiPost.sourceUrl ?? null,
      countryId: aiPost.country,
      subjects,
      groupId:
        aiPost.groupId === undefined || aiPost.groupId < 1
          ? null
          : aiPost.groupId,
    };

    const validatedInput = await postSchema.parseAsync(completeInput);

    return await prisma.post.create({
      data: {
        ...validatedInput,
        userId: bot.id,
        subjects: { connect: subjects.map((id) => ({ id })) },
      },

      include: { user: true, country: true, subjects: true, likes: true },
    });
  } catch (err) {
    console.warn("Skipping post due to error:", aiPost.name, err);
    return null;
  }
}
