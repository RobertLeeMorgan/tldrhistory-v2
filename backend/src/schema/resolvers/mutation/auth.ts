import prisma from "../../../server/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(_: any, { email, password, username }: any, ctx: any) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });

  if (existingUser) {
    if (existingUser.email === email) throw new Error("Email already in use");
    if (existingUser.username === username) throw new Error("Username already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword, role: "USER" },
    select: { id: true, email: true, username: true, role: true },
  });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

ctx.res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/", // send on all paths
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

  return { token: accessToken, user };
}

export async function login(_: any, { email, password }: any, ctx: any) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, role: true, password: true },
  });

  if (!user) throw new Error("Incorrect credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Incorrect credentials");

  const { password: _pw, ...safeUser } = user;

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

ctx.res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

  return { token: accessToken, user: safeUser };
}