import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [
        vue(),
        dts({
          rollupTypes: true,
          insertTypesEntry: true,
          include: ["src/components/timetable/*", "src/index.ts"],
          exclude: ["**/*.spec.*"],
        }),
        cssInjectedByJsPlugin(),
      ],
      server: {
        port: 1337,
      },
      build: {
        outDir: "package/dist",
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "vue-ftr-timetable",
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          // input: path.resolve(__dirname, "src/index.ts"),
          external: ["vue"],
          output: {
            globals: {
              vue: "Vue",
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          "@": resolve(__dirname, "src"),
        },
      },
    };
  }

  return {
    plugins: [vue()],
  };
});
