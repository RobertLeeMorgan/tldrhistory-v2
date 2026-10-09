import express from "express";
import compression from "compression";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequestHandler } from "@react-router/express";

const app = express();
app.set("trust proxy", 1);
app.use(compression());
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
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const root = path.dirname(fileURLToPath(import.meta.url));
const clientBuildPath = path.join(root, "build/client");
const serverBuildPath = path.join(root, "build/server/index.js");

app.get("/health/live", (_req, res) => {
  res.set("Cache-Control", "no-store").type("text/plain").send("ok\n");
});

app.use(
  "/assets",
  express.static(path.join(clientBuildPath, "assets"), {
    immutable: true,
    maxAge: "1y",
    fallthrough: true,
  }),
);
app.use(express.static(clientBuildPath, { maxAge: "1h", fallthrough: true }));

const build = await import(pathToFileURL(serverBuildPath).href);
app.all("/{*splat}", createRequestHandler({ build }));

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend running on port ${port}`);
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.once(signal, () => {
    console.log(`Received ${signal}; shutting down`);
    server.close(() => process.exit(0));
  });
}
