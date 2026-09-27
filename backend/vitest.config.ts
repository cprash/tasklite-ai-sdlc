import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Point the runtime Prisma client at a throwaway SQLite database so tests
    // never touch the local dev database.
    env: {
      DATABASE_URL: "file:./test.db",
    },
    globalSetup: ["./src/test/global-setup.ts"],
    // Tests share a single SQLite file, so run the files serially to avoid
    // write contention.
    fileParallelism: false,
    include: ["src/**/*.test.ts"],
  },
});
