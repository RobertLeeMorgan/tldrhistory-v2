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
import { AuthUser } from "./schema/resolvers/query/user";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.tldrhistory.xyz",
      "https://www.tldrhistory.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Static files
app.use(
  "/images",
  express.static(path.join(__dirname, "..", "images"), {
    maxAge: "1d",
  })
);

// Apollo GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    JSON: GraphQLJSON,
    ...resolvers,
  },
  formatError: (err) => {
    console.error("GraphQL ERROR:", err);
    return err;
  },
});

(async () => {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: ExpressContextFunctionArgument) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7)
          : null;

        if (!token) return { user: null };

        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
          ) as AuthUser;

          return { user: decoded };
        } catch (e) {
          return { user: null };
        }
      },
    })
  );

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message, data: err.data });
  });
})();

export default app;
