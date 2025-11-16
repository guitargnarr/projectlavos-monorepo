const { test, expect } = require('@playwright/test');
const { waitForApiResponse, waitForLoadingToComplete } = require('../helpers/test-helpers');
const { restaurants } = require('../fixtures/test-data');

test.describe('Restaurant Analyzer - Cross-Browser Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the demos page
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the Restaurant Analyzer demo card', async ({ page }) => {
    // Check that the Restaurant Analyzer card is visible
    const restaurantCard = page.locator('text=Restaurant Analyzer').first();
    await expect(restaurantCard).toBeVisible();

    // Verify the icon and description
    await expect(page.locator('text=🍽️').first()).toBeVisible();
    await expect(page.locator('text=Analyze Louisville restaurant reviews')).toBeVisible();
  });

  test('should open Restaurant Analyzer modal on click', async ({ page }) => {
    // Click the Restaurant Analyzer card
    await page.locator('text=Restaurant Analyzer').first().click();

    // Wait for modal to appear
    await page.waitForSelector('text=Louisville Restaurant Analyzer', { timeout: 5000 });

    // Verify modal content
    await expect(page.locator('h3:has-text("Louisville Restaurant Analyzer")')).toBeVisible();
    await expect(page.locator('text=Choose a Louisville Restaurant')).toBeVisible();
  });

  test('should display all 5 Louisville restaurants', async ({ page }) => {
    // Open the modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');

    // Check all restaurants are displayed
    for (const restaurant of restaurants) {
      await expect(page.locator(`text=${restaurant.name}`)).toBeVisible();
      await expect(page.locator(`text=${restaurant.type}`)).toBeVisible();
    }
  });

  test('should select a restaurant and enable analyze button', async ({ page }) => {
    // Open the modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');

    // Initially, analyze button should be disabled
    const analyzeButton = page.locator('button:has-text("Analyze Reviews")');
    await expect(analyzeButton).toBeDisabled();

    // Select Jack Fry's
    await page.locator('button:has-text("Jack Fry\'s")').click();

    // Button should now be enabled
    await expect(analyzeButton).toBeEnabled();

    // Verify the restaurant is highlighted
    const selectedRestaurant = page.locator('button:has-text("Jack Fry\'s")');
    await expect(selectedRestaurant).toHaveClass(/bg-lavos-blue/);
  });

  test('should analyze a restaurant and display results', async ({ page, browserName }) => {
    test.setTimeout(60000); // Extend timeout for API call

    // Open the modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');

    // Select a restaurant
    await page.locator('button:has-text("Jack Fry\'s")').click();

    // Click analyze button
    const analyzeButton = page.locator('button:has-text("Analyze Reviews")');
    await analyzeButton.click();

    // Wait for loading state
    await expect(page.locator('text=Analyzing Reviews...')).toBeVisible();

    // Wait for API response (with extended timeout for server wake-up)
    await page.waitForResponse(
      response => response.url().includes('/api/analyze-restaurant') && response.status() === 200,
      { timeout: 45000 }
    );

    // Wait for loading to complete
    await waitForLoadingToComplete(page, 50000);

    // Verify results are displayed
    await expect(page.locator('text=Overall Rating')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=What Customers Talk About')).toBeVisible();
    await expect(page.locator('text=What They Love')).toBeVisible();
    await expect(page.locator('text=What Needs Work')).toBeVisible();
    await expect(page.locator('text=AI-Powered Recommendations')).toBeVisible();

    // Verify sentiment score is displayed (should be a number between 0-5)
    const sentimentScore = await page.locator('text=/[0-5]\\.[0-9]\\/5\\.0/').first();
    await expect(sentimentScore).toBeVisible();

    // Take screenshot of results for visual verification
    await page.screenshot({
      path: `test-results/screenshots/restaurant-analysis-${browserName}.png`,
      fullPage: true
    });
  });

  test('should display loading progress indicators', async ({ page }) => {
    test.setTimeout(60000);

    // Open modal and select restaurant
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');
    await page.locator('button:has-text("Proof on Main")').click();
    await page.locator('button:has-text("Analyze Reviews")').click();

    // Check for loading indicators
    await expect(page.locator('text=Analyzing sentiment...')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Identifying key themes...')).toBeVisible();
    await expect(page.locator('text=Generating recommendations...')).toBeVisible();

    // Verify progress animation is present
    const progressBars = page.locator('.animate-pulse');
    await expect(progressBars.first()).toBeVisible();
  });

  test('should close modal with ESC key', async ({ page }) => {
    // Open the modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Louisville Restaurant Analyzer');

    // Press ESC key
    await page.keyboard.press('Escape');

    // Modal should be closed
    await expect(page.locator('text=Louisville Restaurant Analyzer')).not.toBeVisible({ timeout: 2000 });
  });

  test('should close modal with close button', async ({ page }) => {
    // Open the modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Louisville Restaurant Analyzer');

    // Click close button
    const closeButton = page.locator('button[aria-label="Close demo"]');
    await closeButton.click();

    // Modal should be closed
    await expect(page.locator('text=Louisville Restaurant Analyzer')).not.toBeVisible({ timeout: 2000 });
  });

  test('should close modal by clicking outside', async ({ page }) => {
    // Open the modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Louisville Restaurant Analyzer');

    // Click outside the modal (on the backdrop)
    await page.locator('.fixed.inset-0').click({ position: { x: 10, y: 10 } });

    // Modal should be closed
    await expect(page.locator('text=Louisville Restaurant Analyzer')).not.toBeVisible({ timeout: 2000 });
  });

  test('should allow selecting different restaurants sequentially', async ({ page }) => {
    test.setTimeout(60000);

    // Open modal
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');

    // Select first restaurant
    await page.locator('button:has-text("Jack Fry\'s")').click();
    await expect(page.locator('button:has-text("Jack Fry\'s")')).toHaveClass(/bg-lavos-blue/);

    // Select different restaurant
    await page.locator('button:has-text("Hammerheads")').click();

    // Verify new selection
    await expect(page.locator('button:has-text("Hammerheads")')).toHaveClass(/bg-lavos-blue/);
    // Previous selection should not be highlighted
    await expect(page.locator('button:has-text("Jack Fry\'s")')).not.toHaveClass(/bg-lavos-blue/);
  });

  test('should display theme breakdown with sentiment indicators', async ({ page }) => {
    test.setTimeout(60000);

    // Open modal, select restaurant, and analyze
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');
    await page.locator('button:has-text("Bourbon Raw")').click();
    await page.locator('button:has-text("Analyze Reviews")').click();

    // Wait for results
    await page.waitForResponse(
      response => response.url().includes('/api/analyze-restaurant'),
      { timeout: 45000 }
    );
    await waitForLoadingToComplete(page, 50000);

    // Check for theme cards
    await expect(page.locator('text=What Customers Talk About')).toBeVisible({ timeout: 10000 });

    // Verify sentiment badges (positive/negative/mixed)
    const sentimentBadges = page.locator('.bg-lavos-green, .bg-red-500, .bg-yellow-500');
    await expect(sentimentBadges.first()).toBeVisible();
  });

  test('should display CTA for custom analysis', async ({ page }) => {
    test.setTimeout(60000);

    // Complete an analysis
    await page.locator('text=Restaurant Analyzer').first().click();
    await page.waitForSelector('text=Choose a Louisville Restaurant');
    await page.locator('button:has-text("Milkwood")').click();
    await page.locator('button:has-text("Analyze Reviews")').click();

    await page.waitForResponse(
      response => response.url().includes('/api/analyze-restaurant'),
      { timeout: 45000 }
    );
    await waitForLoadingToComplete(page, 50000);

    // Scroll to bottom to see CTA
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify CTA is present
    await expect(page.locator('text=Want this analysis for YOUR restaurant?')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Get Your Free Analysis')).toBeVisible();

    // Verify email link is correct
    const emailLink = page.locator('a:has-text("Get Your Free Analysis")');
    const href = await emailLink.getAttribute('href');
    expect(href).toContain('mailto:matthewdscott7@gmail.com');
    expect(href).toContain('Restaurant');
  });
});
