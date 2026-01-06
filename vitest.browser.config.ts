import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      // Disable autoCodeSplitting for now because it makes UI feel laggy
      autoCodeSplitting: false,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        contextOptions: {
          colorScheme: "dark",
        },
      }),
      // https://vitest.dev/config/browser/playwright
      instances: [{ browser: "chromium" }],
    },
    setupFiles: ["./src/test-utils/setup.tsx"],
  },
});
