import { GraphQLError } from "graphql";
import prisma from "../server/client";
import type { z } from "zod";
import type { inputSchema } from "./inputSchema";

export async function validatePostReferences(input: z.infer<typeof inputSchema>) {
  const ids = [...new Set(input.subjects.map((subject) => subject.id))];
  const [country, group, subjects] = await Promise.all([
    prisma.country.findUnique({ where: { name: input.country.name }, select: { name: true } }),
    input.group ? prisma.group.findUnique({ where: { id: input.group.id }, select: { id: true } }) : null,
    prisma.subject.count({ where: { id: { in: ids } } }),
  ]);
  if (!country || (input.group && !group) || subjects !== ids.length) {
    throw new GraphQLError("Select an existing country, theme and subjects", { extensions: { code: "BAD_USER_INPUT" } });
  }
}
