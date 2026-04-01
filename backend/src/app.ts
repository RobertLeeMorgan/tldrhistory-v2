import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
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
import { timeoutMiddleware } from "./utils/timeoutMiddleware";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
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
});
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
  }),
);
app.use(express.json());
app.use(timeoutMiddleware(15000));
app.use(express.static(path.join(__dirname, "public/dist")));
app.use(cookieParser());

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "public/dist", "index.html"));
});

app.use("/api", authRoutes);

// Apollo GraphQL
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

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message, data: err.data });
  });
})();

export default app;
