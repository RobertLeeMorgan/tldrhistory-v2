import crypto from "crypto";
import bcrypt from "bcrypt";
import { AuthTokenType } from "@prisma/client";
import prisma from "../server/client";

export type TokenData = {
  rawToken: string;
  hashedToken: string;
};

export async function generateAuthToken(
  userId: number,
  type: AuthTokenType
): Promise<TokenData> {
  const rawToken = `v2.${crypto.randomBytes(32).toString("base64url")}`;
  const hashedToken = `sha256:${crypto.createHash("sha256").update(rawToken).digest("hex")}`;

  const expiresAt =
    type === "EMAIL_VERIFICATION"
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 60 * 60 * 1000);

  await prisma.authToken.deleteMany({
    where: {
      userId,
      type,
    },
  });

  await prisma.authToken.create({
    data: {
      userId,
      type,
      tokenHash: hashedToken,
      expiresAt,
    },
  });

  return { rawToken, hashedToken };
}

export async function findMatchingAuthToken(rawToken: string, type: AuthTokenType) {
  if (/^v2\.[A-Za-z0-9_-]{43}$/.test(rawToken)) {
    const tokenHash = `sha256:${crypto.createHash("sha256").update(rawToken).digest("hex")}`;
    return prisma.authToken.findFirst({
      where: { tokenHash, type, usedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
  }
  // Keep already-issued links valid until their existing 1h/24h expiry.
  if (!/^[A-Za-z0-9_-]{43}$/.test(rawToken)) return null;
  const candidates = await prisma.authToken.findMany({
    where: {
      type,
      tokenHash: { startsWith: "$2" },
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });

  for (const authToken of candidates) {
    const isMatch = await bcrypt.compare(rawToken, authToken.tokenHash);
    if (isMatch) return authToken;
  }

  return null;
}

export async function getUserVerificationStatus(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerifiedAt: true },
  });

  return !!user?.emailVerifiedAt;
}