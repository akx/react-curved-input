import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import dts from "vite-dts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config: UserConfig = {
    plugins: [react(), dts()],
  };
  if (mode == "lib") {
    config.build = {
      lib: {
        entry: path.resolve(__dirname, "lib/index.ts"),
        name: "ReactCurvedInput",
        fileName: (format) => `react-curved-input.${format}.js`,
      },
      rollupOptions: {
        external: ["react"],
        output: {
          globals: {
            react: "React",
          },
        },
      },
    };
  }
  return config;
});
