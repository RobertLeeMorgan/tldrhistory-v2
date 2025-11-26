import app from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}
