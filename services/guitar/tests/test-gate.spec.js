import { test, expect } from "@playwright/test";

test("MIDI button shows upgrade modal for free users", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Click MIDI export button
  const midiBtn = page.locator("button").filter({ hasText: "MIDI" });
  await midiBtn.click();
  await page.waitForTimeout(500);

  // Screenshot after clicking
  await page.screenshot({ path: "/tmp/midi-modal.png", fullPage: false });

  // Check for upgrade modal
  const modal = page.locator("text=Upgrade Required");
  await expect(modal).toBeVisible({ timeout: 3000 });
});

test("GP5 button shows upgrade modal for free users", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Click GP5 export button
  const gp5Btn = page.locator("button").filter({ hasText: "GP5" });
  await gp5Btn.click();
  await page.waitForTimeout(500);

  // Screenshot after clicking
  await page.screenshot({ path: "/tmp/gp5-modal.png", fullPage: false });

  // Check for upgrade modal
  const modal = page.locator("text=Upgrade Required");
  await expect(modal).toBeVisible({ timeout: 3000 });
});
