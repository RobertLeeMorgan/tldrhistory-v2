import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import prisma from "../../../server/client";
import { issueTokens } from "../../../utils/auth/issueTokens";
import { generateAuthToken, findMatchingAuthToken } from "../../../lib/tokens";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../../lib/mail";
import { assertEmailCooldown } from "../../../utils/throttle";

type AuthContext = {
  res: any;
  user?: {
    id: number;
    email: string;
    username: string;
    role: string;
    emailVerifiedAt?: Date | null;
  };
};


type RegisterArgs = {
  email: string;
  password: string;
  username: string;
};

type LoginArgs = {
  email: string;
  password: string;
};

type VerifyEmailArgs = {
  token: string;
};

type ForgotPasswordArgs = {
  email: string;
};

type ResetPasswordArgs = {
  token: string;
  password: string;
};

export async function register(
  _: unknown,
  { email, password, username }: RegisterArgs,
  ctx: AuthContext,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existingUser?.email === normalizedEmail) {
    throw new GraphQLError("Email already in use", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (existingUser?.username === normalizedUsername) {
    throw new GraphQLError("Username already in use", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      role: "USER",
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      emailVerifiedAt: true,
    },
  });

  const { rawToken } = await generateAuthToken(user.id, "EMAIL_VERIFICATION");
  const verificationUrl = `https://tldrhistory.xyz/verify?token=${rawToken}`;

  await sendVerificationEmail({
    to: user.email,
    username: user.username,
    verificationUrl,
  });

  const accessToken = await issueTokens(user, ctx);

  return {
    token: accessToken,
    user,
    needsEmailVerification: !user.emailVerifiedAt,
  };
}

export async function login(
  _: unknown,
  { email, password }: LoginArgs,
  ctx: AuthContext,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      password: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new GraphQLError("Incorrect credentials", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new GraphQLError("Incorrect credentials", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const { password: _password, ...safeUser } = user;

  const accessToken = await issueTokens(safeUser, ctx);

  return {
    token: accessToken,
    user: safeUser,
    needsEmailVerification: !safeUser.emailVerifiedAt,
  };
}

export async function verifyEmail(
  _: unknown,
  { token }: VerifyEmailArgs,
): Promise<{ success: boolean; message: string }> {
  const authToken = await findMatchingAuthToken(token, "EMAIL_VERIFICATION");

  if (!authToken) {
    throw new GraphQLError("Invalid or expired verification link", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: authToken.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    success: true,
    message: "Email verified successfully",
  };
}

export async function forgotPassword(
  _: unknown,
  { email }: ForgotPasswordArgs,
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    assertEmailCooldown(
      `forgot:${normalizedEmail}`,
      5 * 60 * 1000,
      "Please wait before requesting another password reset.",
    );
  } catch (error) {
    throw new GraphQLError((error as Error).message, {
      extensions: { code: "RATE_LIMITED" },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, username: true },
  });

  if (!user) {
    return {
      success: true,
      message:
        "If that email exists, we've sent a reset link. Check your inbox.",
    };
  }

  const { rawToken } = await generateAuthToken(user.id, "PASSWORD_RESET");
  const resetUrl = `https://tldrhistory.xyz/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({
    to: normalizedEmail,
    username: user.username,
    resetUrl,
  });

  return {
    success: true,
    message: "If that email exists, we've sent a reset link. Check your inbox.",
  };
}

export async function resetPassword(
  _: unknown,
  { token, password }: ResetPasswordArgs,
  ctx: AuthContext
) {
  const authToken = await findMatchingAuthToken(token, "PASSWORD_RESET");

  if (!authToken) {
    throw new GraphQLError("Invalid or expired reset link", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: authToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId: authToken.userId },
    }),
  ]);

  const safeUser = {
    id: authToken.user.id,
    email: authToken.user.email,
    username: authToken.user.username,
    role: authToken.user.role,
    emailVerifiedAt: authToken.user.emailVerifiedAt,
  };

  const accessToken = await issueTokens(safeUser, ctx);

  return {
    token: accessToken,
    user: safeUser,
    needsEmailVerification: !safeUser.emailVerifiedAt,
  };
}

export async function resendVerificationEmail(
  _: unknown,
  __: unknown,
  ctx: AuthContext,
) {
  if (!ctx.user) {
    throw new GraphQLError("You must be logged in to resend verification email.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new GraphQLError("User not found.", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  if (user.emailVerifiedAt) {
    return {
      success: true,
      message: "Your email is already verified.",
    };
  }

  try {
    assertEmailCooldown(
      `verify:${user.email}`,
      5 * 60 * 1000,
      "Please wait before requesting another verification email.",
    );
  } catch (error) {
    throw new GraphQLError((error as Error).message, {
      extensions: { code: "RATE_LIMITED" },
    });
  }

  const { rawToken } = await generateAuthToken(user.id, "EMAIL_VERIFICATION");
  const verificationUrl = `https://tldrhistory.xyz/verify?token=${rawToken}`;

  await sendVerificationEmail({
    to: user.email,
    username: user.username,
    verificationUrl,
  });

  return {
    success: true,
    message: "Verification email sent. Please check your inbox.",
  };
}