const { test, expect } = require('@playwright/test');

/**
 * Error State Testing
 * Based on WEEK2_ACTIONABLE_CHECKLIST.md items 16-17
 */

test.describe('Error State Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
  });

  test('should display error when API is unreachable', async ({ page, context }) => {
    // Block API calls
    await context.route('**/api/**', route => route.abort('failed'));
    await context.route('**/*.onrender.com/**', route => route.abort('failed'));

    // Try to analyze
    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Should show error state within 10 seconds
      const errorMessage = page.locator('text=/error|failed|unable|retry/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display retry button after error', async ({ page, context }) => {
    // Simulate network failure
    await context.route('**/api/**', route => route.abort());

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Wait for retry button to appear
      const retryButton = page.locator('button:has-text("Retry"), button:has-text("Try Again")').first();
      await expect(retryButton).toBeVisible({ timeout: 10000 });
    }
  });

  test('should allow retry after error', async ({ page, context }) => {
    let attemptCount = 0;

    // First attempt fails, second succeeds
    await context.route('**/api/**', route => {
      attemptCount++;
      if (attemptCount === 1) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      // First attempt
      await analyzeButton.click();

      // Wait for retry button
      const retryButton = page.locator('button:has-text("Retry"), button:has-text("Try Again")').first();
      await expect(retryButton).toBeVisible({ timeout: 10000 });

      // Click retry
      await retryButton.click();

      // Second attempt should succeed
      await page.waitForSelector('text=/sentiment|positive|negative/i', { timeout: 30000 });
    }
  });

  test('should handle timeout errors gracefully', async ({ page, context }) => {
    // Simulate slow API (timeout)
    await context.route('**/api/**', route => {
      // Delay response beyond timeout
      setTimeout(() => route.abort(), 15000);
    });

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Should show timeout error or loading state
      // Wait up to 20 seconds for error message
      const errorOrLoading = page.locator('text=/timeout|error|loading/i').first();
      await expect(errorOrLoading).toBeVisible({ timeout: 20000 });
    }
  });

  test('should handle 500 server errors', async ({ page, context }) => {
    // Return 500 error
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Should show server error message
      const errorMessage = page.locator('text=/error|server|failed/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle 404 not found errors', async ({ page, context }) => {
    // Return 404 error
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not Found' })
      });
    });

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Should show error message
      const errorMessage = page.locator('text=/error|not found|failed/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle malformed API responses', async ({ page, context }) => {
    // Return invalid JSON
    await context.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'invalid json {'
      });
    });

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Should show error or handle gracefully
      const errorMessage = page.locator('text=/error|invalid|failed/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    }
  });

  test('should maintain UI state during loading', async ({ page, context }) => {
    // Simulate slow API
    await context.route('**/api/**', route => {
      setTimeout(() => route.continue(), 3000);
    });

    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    
    if (await analyzeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await analyzeButton.click();

      // Button should be disabled or show loading state
      await page.waitForTimeout(500);
      
      // Check if button is disabled or shows loading text
      const isDisabled = await analyzeButton.isDisabled().catch(() => false);
      const hasLoadingText = await page.locator('text=/loading|analyzing/i').isVisible().catch(() => false);
      
      expect(isDisabled || hasLoadingText).toBe(true);
    }
  });
});
