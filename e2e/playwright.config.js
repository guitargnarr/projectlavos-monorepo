import { defineConfig, devices } from '@playwright/test';

/**
 * Consolidated E2E Test Configuration
 *
 * Tests all portfolio sites against production URLs.
 * No local webserver needed - tests live deployments directly.
 *
 * Run all: npx playwright test --config=e2e/playwright.config.js
 * Run portfolio: npx playwright test --config=e2e/playwright.config.js e2e/portfolio/
 */

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../playwright-report' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // No webServer - testing production URLs directly
});
