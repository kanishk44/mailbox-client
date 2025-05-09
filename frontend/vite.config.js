import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": import.meta.env.VITE_API_URL,
    },
  },
  plugins: [react(), tailwindcss()],
});
