import prisma from "../server/client";
import bcrypt from "bcrypt";

export async function createBot() {
  const botPassword = process.env.BOT_PASSWORD || Math.random().toString(36);
  return prisma.user.upsert({
    where: { username: "HistOracle" },
    update: {},
    create: {
      username: "HistOracle",
      email: "historacle@tldrhistory.local",
      password: await bcrypt.hash(botPassword, 12),
      role: "BOT",
    },
  });
}