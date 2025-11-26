import prisma from "../../../server/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(_: any, { email, password, username }: any) {
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new Error("Email already in use");

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) throw new Error("Username already in use");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword, role: "USER" },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: "USER" },
    process.env.JWT_SECRET!,
    { expiresIn: "12h" }
  );

  return { token, user };
}

export async function login(_: any, { email, password }: any) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      username: true,
      role: true,
    },
  });

  if (!user) throw new Error("Incorrect credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Incorrect credentials");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "12h" }
  );

  return { token, user };
}
