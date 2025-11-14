import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  root: path.resolve(__dirname, "../web"),
  base: "./",
  plugins: [solid(), tailwindcss()],
  assetsInclude: ["**/*.ttf"],
  resolve: {
    alias: {
      "@repo/tool": path.resolve(__dirname, "../../packages/tool/src"),
      "@repo/api": path.resolve(__dirname, "../../packages/api/src"),
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  optimizeDeps: {
    exclude: ["@repo/api", "@aws-sdk/credential-provider-node"],
  },
});
