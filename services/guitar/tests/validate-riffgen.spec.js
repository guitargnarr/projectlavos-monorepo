import { test, expect } from '@playwright/test';

test.describe('Riff Generator Integration Validation', () => {

  test('Riff Generator loads with all 12 scales', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/riff-generator');
    await page.waitForLoadState('networkidle');

    // Check scale dropdown exists and has all scales
    const scaleSelect = page.locator('#scale-select');
    await expect(scaleSelect).toBeVisible({ timeout: 5000 });

    const options = await scaleSelect.locator('option').allTextContents();
    console.log('Scales available:', options.length);

    // Should have at least 12 scales
    expect(options.length).toBeGreaterThanOrEqual(12);
  });

  test('Riff Generator has all 6 patterns', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/riff-generator');
    await page.waitForLoadState('networkidle');

    const patterns = ['Ascending', 'Descending', 'Pedal Tone', 'Arpeggio', 'Random', '3 Notes/String'];

    for (const pattern of patterns) {
      const btn = page.locator('button').filter({ hasText: pattern });
      await expect(btn.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('Riff Generator generates tab and plays', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending');
    await page.waitForLoadState('networkidle');

    // Wait for synth to initialize
    await page.waitForTimeout(2000);

    // Tab display area should be visible
    const tabDisplay = page.locator('.tab-display-elite');
    await expect(tabDisplay).toBeVisible({ timeout: 5000 });

    // Pre element with tab content should exist
    const tab = page.locator('pre');
    await expect(tab).toBeVisible({ timeout: 5000 });

    // Play controls should be visible
    const playArea = page.locator('.daw-controls-panel');
    await expect(playArea).toBeVisible({ timeout: 5000 });
  });

  test('Fretboard visualization shows scale notes', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&position=1');
    await page.waitForLoadState('networkidle');

    // Root and Scale legend should exist (indicates fretboard is rendered)
    await expect(page.locator('text=Root').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Scale').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Playing').first()).toBeVisible({ timeout: 5000 });
  });
});
