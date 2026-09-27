import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Provision the test database schema once before the whole suite runs.
// Uses a dedicated SQLite file (test.db) that is deleted and recreated from
// scratch each run, so no destructive Prisma reset is required.
const TEST_DATABASE_URL = "file:./test.db";

export default function setup(): void {
  const backendDir = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
  const dbPath = path.join(backendDir, "prisma", "test.db");

  // Start from a clean slate. Removing the file makes `prisma db push` a purely
  // additive (non-destructive) operation, so no --force-reset is needed.
  for (const file of [dbPath, `${dbPath}-journal`]) {
    rmSync(file, { force: true });
  }

  // Run via the `db:push:test` npm script rather than `npx` so it always uses
  // the repo's pinned Prisma version (npm puts node_modules/.bin on PATH),
  // keeping provisioning deterministic and offline.
  execSync("npm run db:push:test", {
    cwd: backendDir,
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}
