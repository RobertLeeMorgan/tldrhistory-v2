import { computeEffectiveDate } from "../utils/effectiveDate";
import { AIOutput } from "../services/ai/types";
import { PrismaClient, User } from "@prisma/client";
import { Context } from "../schema/resolvers/query/user";

const prisma = new PrismaClient();

export async function generatePosts(
  aiPost: AIOutput[number] & {
    imageUrl?: string;
    imageCredit?: string | null;
  },
  bot: User,
  ctx: Context
) {
  const subjectRecords = await prisma.subject.findMany({
    where: { name: { in: aiPost.subjects } },
  });

  const subjects = subjectRecords.map((s) => s.id);

  const validatedInput = {
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
  };

  const effectiveDate = computeEffectiveDate(validatedInput);

  return prisma.post.create({
    data: {
      ...validatedInput,
      effectiveDate,
      userId: bot.id,
      subjects: { connect: subjects.map((id) => ({ id })) },
    },
    include: { user: true, country: true, subjects: true, likes: true },
  });
}
