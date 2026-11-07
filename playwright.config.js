import { defineConfig } from "@playwright/test";

/**
 * Playwright config — keep this small while learning.
 *
 * - testDir: where test files live
 * - baseURL: so tests can use page.goto("/") instead of full URLs
 * - webServer: optional auto-start of frontend (backend must already be running)
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  // Start Vite for you when you run tests.
  // Make sure the Express backend is already running on :4000.
  webServer: {
    command: "npm run dev --prefix frontend",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
