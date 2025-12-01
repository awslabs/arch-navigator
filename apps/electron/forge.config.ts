import path from "node:path";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";

const config: ForgeConfig = {
  packagerConfig: {
    name: "arch-navigator",
    executableName: "arch-navigator",
    appBundleId: "com.github.awslabs.arch-navigator",
    icon: "./resources/arch-navigator",
    extraResource: [path.resolve(__dirname, "../web/dist")],
    asar: true,
  },
  buildIdentifier: "arch-navigator",
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "arch-navigator",
    }),
    new MakerZIP({}, ["darwin"]),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: "src/main.ts",
          config: "vite.main.config.ts",
        },
        {
          entry: "src/preload.ts",
          config: "vite.preload.config.ts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.ts",
        },
      ],
    }),
  ],
};

export default config;
