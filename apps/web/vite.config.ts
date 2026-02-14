import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.REPO_NAME ? `/${process.env.REPO_NAME}/` : "/",
  build: {
    outDir: "../../docs",
    emptyOutDir: true
  }
});
