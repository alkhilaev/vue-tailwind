import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
      "~": path.join(__dirname, "./node_modules"),
    },
  },
  optimizeDeps: {
    include: [
      "@/assets/swagger-ui/swagger-ui-es-bundle.js",
      "@/assets/swagger-ui/swagger-ui-standalone-preset.js",
    ],
  },
  build: {
    commonjsOptions: {
      include: [
        /assets\/swagger-ui\/swagger-ui-es-bundle.js$/,
        /assets\/swagger-ui\/swagger-ui-standalone-preset.js$/,
      ],
    },
  },
});
