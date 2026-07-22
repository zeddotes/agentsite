import { defineConfig } from "tsup";

const reactExternal = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "agentsite",
  "agentsite/payload",
];

const nextExternal = [
  ...reactExternal,
  "next",
  "next/server",
];

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "react/jsx-runtime"],
    treeshake: true,
  },
  {
    entry: { payload: "src/payload-entry.ts" },
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: [],
    treeshake: true,
  },
  {
    entry: { next: "src/next/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: nextExternal,
    treeshake: true,
  },
  {
    entry: { "next-server": "src/next/server.ts" },
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: nextExternal,
    treeshake: true,
  },
]);
