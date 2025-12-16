import { Context } from "../query/user";
import prisma from "../../../server/client";
import { requireRole } from "../../../utils/requireRole";
import { postSchema } from "../../../validators/postSchema";

export async function postTimeline(_: any, { input }: any, ctx: Context) {
  const user = requireRole(ctx, ["BOT"]);
  const validatedInput = await postSchema.parseAsync(input);
  const { subjects } = validatedInput;

  return prisma.post.create({
    data: {
      ...validatedInput,
      userId: user.id,
      subjects: {
        connect: subjects.map((id: number) => ({ id })),
      },
    },
    include: {
      user: true,
      country: true,
      subjects: true,
      likes: true,
      group: true
    },
  });
}
