import path from "node:path";
import { defineConfig } from "vite";

export const sharedAliases = {
  "@repo/ui": path.resolve(__dirname, "./packages/ui/src"),
  "@repo/api": path.resolve(__dirname, "./packages/api/src"),
  "@repo/tool": path.resolve(__dirname, "./packages/tool/src"),
};

export default defineConfig({
  resolve: {
    alias: sharedAliases,
  },
});
