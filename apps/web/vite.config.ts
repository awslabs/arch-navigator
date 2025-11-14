import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { sharedAliases } from "../../vite.config.base";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  base: "./",
  assetsInclude: ["**/*.ttf"],
  resolve: {
    alias: sharedAliases,
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    exclude: ["@repo/api", "@aws-sdk/credential-provider-node"],
  },
});
