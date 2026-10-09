import app, { shutdownApplication } from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

if (process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}; shutting down`);
    server.close(() => {
      void shutdownApplication().catch((error) => {
        console.error("Application shutdown failed", error);
        process.exitCode = 1;
      });
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}
