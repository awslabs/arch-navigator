import tailwindcss from "@tailwindcss/vite";
import { defineConfig, mergeConfig } from "vite";
import solid from "vite-plugin-solid";
import baseConfig from "../../vite.config.base";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [solid(), tailwindcss()],
  }),
);
