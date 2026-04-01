import { Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../server/client";

const router = Router();

router.post("/refresh", async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, username: true, role: true },
    });

    if (!user) return res.sendStatus(401);

    const accessToken = jwt.sign(user, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    return res.json({ token: accessToken, user });
  } catch {
    return res.sendStatus(403);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.sendStatus(200);
});

export default router;