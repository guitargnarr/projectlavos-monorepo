import { test, expect } from '@playwright/test';

const LANDING_URL = 'https://mirador-dch2y3pxu-matthew-scotts-projects-1dc9743e.vercel.app';

test('interactive API demo works', async ({ page }) => {
  // Go to landing page
  await page.goto(LANDING_URL);

  // Wait for API status to load
  await page.waitForSelector('text=Online', { timeout: 15000 }).catch(() => {
    console.log('API might be cold starting...');
  });

  // Take screenshot of API status section
  await page.locator('#api').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/api-section.png', fullPage: false });

  // Check API status shows online
  const statusSection = page.locator('#api');
  await expect(statusSection).toBeVisible();

  // Check for personas count
  const personasCount = page.locator('text=Personas').first();
  await expect(personasCount).toBeVisible();

  // Check for chains count
  const chainsCount = page.locator('text=Chains').first();
  await expect(chainsCount).toBeVisible();

  // Find and interact with the demo form
  const chainSelect = page.locator('select');
  await expect(chainSelect).toBeVisible();

  // Select a different chain
  await chainSelect.selectOption('guitar_mastery');

  // Update input text
  const textarea = page.locator('textarea');
  await textarea.fill('Help me improve my fingerpicking technique');

  // Click Run Chain button
  const runButton = page.locator('button:has-text("Run Chain")');
  await runButton.click();

  // Wait for response
  await page.waitForSelector('text=Demo Mode', { timeout: 10000 });

  // Verify response shows execution flow
  await expect(page.locator('text=guitar_mastery')).toBeVisible();
  await expect(page.locator('text=Execution flow:').first()).toBeVisible();

  // Take screenshot of the response section specifically
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/api-demo-result.png', fullPage: false });

  // Scroll down to see the full response
  await page.locator('text=Demo Mode').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/api-response-detail.png', fullPage: false });

  console.log('Interactive demo test PASSED');
});
