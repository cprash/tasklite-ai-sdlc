import { defineConfig, devices } from "@playwright/test";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "api",
      testDir: "./e2e/api",
      use: {
        // Trailing slash matters: request paths are resolved relative to this via the WHATWG URL algorithm.
        baseURL: `${BACKEND_URL}/api/`,
      },
    },
    {
      name: "ui",
      testDir: "./e2e/ui",
      use: {
        ...devices["Desktop Chrome"],
        // Uses the system-installed Chrome instead of Playwright's bundled Chromium download.
        channel: "chrome",
        baseURL: FRONTEND_URL,
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev",
      cwd: "../backend",
      url: `${BACKEND_URL}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm run dev",
      cwd: "../frontend",
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
