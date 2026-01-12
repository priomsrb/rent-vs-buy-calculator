import path from "path";
import { defineConfig } from "vitest/config";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

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
