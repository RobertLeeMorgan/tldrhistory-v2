import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../server/client";

const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;
const ACCESS_EXPIRES = "15m";

type TokenUser = {
  id: number;
  email?: string;
  role: string;
};

type TokenContext = {
  res: {
    cookie: (
      name: string,
      value: string,
      options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "lax" | "strict" | "none";
        path: string;
        maxAge: number;
      }
    ) => void;
  };
};

export async function issueTokens(user: TokenUser, ctx: TokenContext) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_EXPIRES }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: Math.floor(REFRESH_EXPIRES_MS / 1000),
      jwtid: crypto.randomUUID(),
    }
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  ctx.res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_EXPIRES_MS,
  });

  return accessToken;
}