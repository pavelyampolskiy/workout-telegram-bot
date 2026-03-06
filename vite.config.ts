import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: (() => {
    // GitHub Pages serves the site under "/<repo>/"
    if (!process.env.GITHUB_ACTIONS) return "/";

    const repo = process.env.GITHUB_REPOSITORY?.split("/")?.[1];
    return repo ? `/${repo}/` : "/";
  })(),
  plugins: [react()],
  server: {
    port: 5173
  }
});
