import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/graphql": {
        target: process.env.DEV_API_ORIGIN ?? "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: process.env.DEV_API_ORIGIN ?? "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
