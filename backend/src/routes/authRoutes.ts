import crypto from "crypto";
import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../server/client";

const router = Router();

const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;
const ACCESS_EXPIRES = "15m";

type RefreshPayload = {
  id: number;
  iat?: number;
  exp?: number;
  jti?: string;
};

router.post("/refresh", async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(
      incomingToken,
      process.env.JWT_REFRESH_SECRET!
    ) as RefreshPayload;

    const result = await prisma.$transaction(async (tx) => {
      const existingToken = await tx.refreshToken.findFirst({
        where: {
          token: incomingToken,
          expiresAt: { gt: new Date() },
        },
      });

      if (!existingToken) {
        return null;
      }

      const user = await tx.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, username: true, role: true, emailVerifiedAt: true, },
      });

      if (!user) {
        return null;
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_EXPIRES }
      );

      const newRefreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET!,
        {
          expiresIn: Math.floor(REFRESH_EXPIRES_MS / 1000),
          jwtid: crypto.randomUUID(),
        }
      );

      await tx.refreshToken.deleteMany({
        where: { token: incomingToken },
      });

      await tx.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
        },
      });

      return { accessToken, refreshToken: newRefreshToken, user };
    });

    if (!result) {
      return res.sendStatus(403);
    }

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_EXPIRES_MS,
    });

    return res.json({
      token: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.sendStatus(403);
  }
});

router.post("/logout", async (req, res) => {
  const token = req.cookies?.refreshToken;

  try {
    if (token) {
      await prisma.refreshToken.deleteMany({
        where: { token },
      });
    }
  } catch (err) {
    console.error("Logout token deletion error:", err);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.sendStatus(200);

  prisma.refreshToken
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch((err) => console.error("Failed to cleanup expired tokens:", err));
});

export default router;