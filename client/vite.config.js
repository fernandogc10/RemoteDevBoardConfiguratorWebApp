import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/users": {
        target: "http://backend:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/users/, "/users"),
      },
      "/boards": {
        target: "http://backend:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/boards/, "/boards"),
      },
    },
  },
});
