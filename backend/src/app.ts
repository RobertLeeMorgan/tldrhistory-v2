import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from "@as-integrations/express5";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers/index";
import GraphQLJSON from "graphql-type-json";
import { GraphQLBigInt } from "graphql-scalars";
import { AuthUser } from "./schema/resolvers/query/user";
import { pathToFileURL } from "url";
import { timeoutMiddleware } from "./server/timeoutMiddleware";
import { createRequestHandler } from "@react-router/express";
import {
  authApiLimiter,
  graphqlAuthLimiter,
  graphqlGeneralLimiter,
  graphqlSsrLimiter,
} from "./server/rateLimit";
import { rejectPersistedQueries, boundedOperation } from "./server/graphqlPolicy";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import prisma from "./server/client";

import dotenv from "dotenv";
dotenv.config();

const app = express();
let applicationReady = false;

// Caddy is the single trusted proxy hop in the VPS deployment. Render keeps
// its existing default unless this is explicitly enabled there.
if (process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
}

app.get("/health/live", (_req, res) => {
  res.set("Cache-Control", "no-store").type("text/plain").send("ok\n");
});

app.get("/health/ready", async (_req, res) => {
  if (!applicationReady) {
    res
      .status(503)
      .set("Cache-Control", "no-store")
      .type("text/plain")
      .send("not ready\n");
    return;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    res
      .set("Cache-Control", "no-store")
      .type("text/plain")
      .send("tldr-history-ready\n");
  } catch {
    res.status(503).set("Cache-Control", "no-store").type("text/plain").send("not ready\n");
  }
});

app.use(compression());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.tldrhistory.xyz",
      "https://tldrhistory-v2.onrender.com",
      ...(process.env.FRONTEND_ORIGINS?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? []),
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  (res as any).locals = (res as any).locals || {};
  (res as any).locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://tldrhistory-v2.onrender.com",
          "https://www.tldrhistory.xyz",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://cdn.tldrhistory.xyz",
          "https://upload.wikimedia.org",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(timeoutMiddleware(15000));

app.use("/graphql", rejectPersistedQueries);
app.use("/graphql", graphqlGeneralLimiter);
app.use("/graphql", graphqlSsrLimiter);
app.use("/graphql", graphqlAuthLimiter);
if (process.env.TRUST_PROXY === "1") {
  app.use("/api", authApiLimiter);
}
app.use("/api", authRoutes);

const apolloServer = new ApolloServer({
  persistedQueries: false,
  validationRules: [boundedOperation],
  typeDefs,
  resolvers: {
    JSON: GraphQLJSON,
    BigInt: GraphQLBigInt,
    ...resolvers,
  },
  formatError: (err) => {
    console.error("GraphQL ERROR:", err);
    return {
      message: err.message,
      extensions: { code: err.extensions?.code || "INTERNAL_SERVER_ERROR" },
    };
  },
});

const initialization = (async () => {
  await apolloServer.start();

  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req, res }: ExpressContextFunctionArgument) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7)
          : null;

        let user = null;
        if (token) {
          try {
            user = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
          } catch {
            user = null;
          }
        }

        return { req, res, user };
      },
    }),
  );

  const clientBuildPath = path.resolve(process.cwd(), "public/build/client");
  const serverBuildPath = path.resolve(
    process.cwd(),
    "public/build/server/index.js",
  );
  const serveFrontend = process.env.SERVE_FRONTEND !== "false";

  // The existing Render deployment remains combined by default. The VPS API
  // image explicitly disables this and does not need a frontend build at all.
  if (serveFrontend && fs.existsSync(serverBuildPath)) {
    const serverBuild = await import(pathToFileURL(serverBuildPath).href);

    app.use(
      "/assets",
      express.static(path.join(clientBuildPath, "assets"), {
        immutable: true,
        maxAge: "1y",
      }),
    );

    app.use(express.static(clientBuildPath, { maxAge: "1h" }));

    app.all("/{*splat}", createRequestHandler({ build: serverBuild }));
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message, data: err.data });
  });

  applicationReady = true;
})();

export async function shutdownApplication() {
  await initialization;
  await apolloServer.stop();
  await prisma.$disconnect();
}

export default app;
