const { test, expect } = require('@playwright/test');

/**
 * Restaurant Analyzer E2E Tests
 * Based on WEEK2_ACTIONABLE_CHECKLIST.md items 14-25
 */

test.describe('Restaurant Analyzer - Desktop Chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
  });

  test('should load demos page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Project Lavos/i);
    await expect(page.locator('h1')).toContainText(/demo/i);
  });

  test('should display Restaurant Analyzer demo', async ({ page }) => {
    // Find Restaurant Analyzer section
    const restaurantSection = page.locator('text=Restaurant Analyzer').first();
    await expect(restaurantSection).toBeVisible();
  });

  test('should analyze Jack Fry\'s restaurant', async ({ page }) => {
    // Look for Jack Fry's dropdown or button
    const jackFrysButton = page.locator('text=Jack Fry').first();
    
    // If dropdown exists, select it
    const dropdown = page.locator('select').first();
    if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dropdown.selectOption({ label: /Jack.*Fry/i });
    } else if (await jackFrysButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await jackFrysButton.click();
    }

    // Click Analyze button
    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    await analyzeButton.click();

    // Wait for results (max 30 seconds for API call)
    await page.waitForSelector('text=/sentiment|positive|negative/i', { timeout: 30000 });

    // Verify results display
    const results = page.locator('[class*="result"]').first();
    await expect(results).toBeVisible();
  });

  test('should handle offline error state', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true);

    // Try to analyze
    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    if (await analyzeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await analyzeButton.click();

      // Look for error message or retry button
      const errorIndicator = page.locator('text=/error|failed|retry/i').first();
      await expect(errorIndicator).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display retry button on error', async ({ page, context }) => {
    // Simulate network error
    await context.route('**/api/**', route => route.abort());

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    if (await analyzeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await analyzeButton.click();

      // Wait for retry button
      const retryButton = page.locator('button:has-text("Retry")').first();
      await expect(retryButton).toBeVisible({ timeout: 10000 });
    }
  });
});

// Safari tests run automatically via webkit project in playwright.config.js
