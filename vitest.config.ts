import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "agentsite/payload",
        replacement: path.resolve(root, "src/payload-entry.ts"),
      },
      {
        find: "agentsite",
        replacement: path.resolve(root, "src/index.ts"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 20_000,
  },
});
