import { AIOutput } from "../../services/ai/types";
import prisma from "../../server/client";
import type { User } from "@prisma/client";
import { Context } from "../../schema/resolvers/query/user";
import { postSchema } from "../../validators/postSchema";

export async function addPosts(
  aiPost: AIOutput[number] & {
    imageUrl?: string;
    imageCredit?: string | null;
  },
  bot: User,
  ctx: Context,
) {
  try {
    // Fetch matching subjects by name
    const subjectRecords = await prisma.subject.findMany({
      where: { name: { in: aiPost.subjects } },
    });
    const subjectIds = subjectRecords.map((s) => s.id);

    // Country validation
    const countryRecord = await prisma.country.findUnique({
      where: { name: aiPost.country }, // name is PK
    });
    if (!countryRecord) {
      console.warn(`Skipping post due to unknown country: ${aiPost.country}`);
      return null;
    }

    // Complete input for validation
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
      countryId: countryRecord.name, // use name as ID
      subjects: subjectIds,
      groupId:
        aiPost.groupId === undefined || aiPost.groupId < 1
          ? null
          : aiPost.groupId,
    };

    const validatedInput = await postSchema.parseAsync(completeInput);

    // Create the post
    return await prisma.post.create({
      data: {
        ...validatedInput,
        userId: bot.id,
        subjects: { connect: subjectIds.map((id) => ({ id })) },
      },
      select: {
        id: true,
        name: true,
        country: { select: { name: true } },
        groupId: true,
        subjects: { select: { name: true } },
      },
    });
  } catch (err) {
    console.warn("Skipping post due to error:", aiPost.name, err);
    return null;
  }
}
