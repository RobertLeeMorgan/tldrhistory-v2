import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
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
import { graphqlGeneralLimiter, graphqlAuthLimiter } from "./server/rateLimit";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(compression());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.tldrhistory.xyz",
      "https://tldrhistory-v2.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
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
        imgSrc: ["'self'", "data:", "https://upload.wikimedia.org"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(timeoutMiddleware(15000));

app.use("/graphql", graphqlGeneralLimiter);
app.use("/graphql", graphqlAuthLimiter);
app.use("/api", authRoutes);

const server = new ApolloServer({
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

(async () => {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
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

  const serverBuild = await import(pathToFileURL(serverBuildPath).href);

  app.use(
    "/assets",
    express.static(path.join(clientBuildPath, "assets"), {
      immutable: true,
      maxAge: "1y",
    }),
  );

  app.use(express.static(clientBuildPath, { maxAge: "1h" }));

app.all(
  "/{*splat}",
  createRequestHandler({
    build: serverBuild,
  }),
);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message, data: err.data });
  });
})();

export default app;
