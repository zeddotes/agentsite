import { readFileSync, writeFileSync } from "node:fs";

const USE_CLIENT = '"use client";\n';

for (const file of process.argv.slice(2)) {
  const src = readFileSync(file, "utf8");
  if (src.startsWith('"use client"') || src.startsWith("'use client'")) {
    continue;
  }
  writeFileSync(file, USE_CLIENT + src);
  console.log(`injected use client → ${file}`);
}
