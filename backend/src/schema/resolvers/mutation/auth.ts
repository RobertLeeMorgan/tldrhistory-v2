import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import prisma from "../../../server/client";
import { issueTokens } from "../../../utils/auth/issueTokens";

type AuthContext = {
  res: any;
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

export async function register(
  _: unknown,
  { email, password, username }: RegisterArgs,
  ctx: AuthContext
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
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
    },
  });

  const accessToken = await issueTokens(user, ctx);

  return {
    token: accessToken,
    user,
  };
}

export async function login(
  _: unknown,
  { email, password }: LoginArgs,
  ctx: AuthContext
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
      createdAt: true,
      updatedAt: true,
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
  };
}