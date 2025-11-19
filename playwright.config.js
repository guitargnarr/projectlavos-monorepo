const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright E2E Test Configuration
 * Tests Project Lavos multi-site architecture
 */
module.exports = defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined, // Increased from 1 to 2 for faster CI

  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    // GitHub Actions integration
    process.env.CI ? ['github'] : ['list'],
    // JUnit XML for CI/CD integration
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ].filter(Boolean),

  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: 'https://demos.projectlavos.com',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Timeout for each action
    actionTimeout: 10000,
  },

  // Configure projects for major browsers
  // In CI: Only test chromium for speed (scheduled runs)
  // Locally: Test all browsers for comprehensive coverage
  projects: process.env.CI ? [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ] : [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Webserver configuration for local testing
  webServer: process.env.CI ? undefined : {
    command: 'echo "Using production URLs"',
    timeout: 1000,
    reuseExistingServer: true,
  },
});
