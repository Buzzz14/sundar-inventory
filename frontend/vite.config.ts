import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    target: "es2019",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-slot"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          ui: ["lucide-react", "class-variance-authority"],
        },
      },
    },
  },
});
