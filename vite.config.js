import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { fileURLToPath, URL } from "node:url";

const __filename = fileURLToPath(import.meta.url);

// https://vite.dev/config/

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "/map-morpher/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
