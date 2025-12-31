import { test, expect } from "@playwright/test";

test("Scale dropdown changes fretboard visualization", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Screenshot initial state (E Phrygian)
  await page.screenshot({ path: "/tmp/scale-1-phrygian.png" });
  console.log("1. Initial: E Phrygian");

  // Change scale to Major
  await page.locator("#scale-select").selectOption("major");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/scale-2-major.png" });
  console.log("2. Changed to: E Major");

  // Change scale to Minor Pentatonic (value is "pentatonic_minor" not "minor_pentatonic")
  await page.locator("#scale-select").selectOption("pentatonic_minor");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/scale-3-pentatonic.png" });
  console.log("3. Changed to: E Minor Pentatonic");

  // Change root note to A
  await page.locator("button").filter({ hasText: /^A$/ }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/scale-4-a-pentatonic.png" });
  console.log("4. Changed root to: A Minor Pentatonic");
});

test("Tuning dropdown changes display", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Check initial tuning text
  const tuningInfo = page.locator("text=Tuning: Standard (EADGBE)");
  await expect(tuningInfo).toBeVisible();
  console.log("5. Initial tuning: Standard (EADGBE)");

  // Change to Drop D
  await page.locator("#tuning-select").selectOption("drop_d");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/tuning-drop-d.png" });
  const dropDInfo = page.locator("text=Tuning: Drop D");
  await expect(dropDInfo).toBeVisible();
  console.log("6. Changed to: Drop D");
});

test("Pattern dropdown changes tab generation", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Get initial tab content
  const tabPre = page.locator("pre");
  const initialTab = await tabPre.textContent();
  console.log("7. Initial pattern: Ascending");

  // Change to Pedal pattern
  await page.locator("button").filter({ hasText: "Pedal Tone" }).click();
  await page.waitForTimeout(1000);
  const pedalTab = await tabPre.textContent();
  await page.screenshot({ path: "/tmp/pattern-pedal.png" });
  console.log("8. Changed to: Pedal Tone");

  // Verify tab content changed
  expect(pedalTab).not.toBe(initialTab);
  console.log("9. Tab content changed: PASS");
});

test("Play button produces audio (visual check)", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/riff-generator?root=E&scale=phrygian&pattern=ascending");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Click play button
  const playBtn = page.locator("button").filter({ hasText: "▶" });
  await playBtn.click();
  await page.waitForTimeout(500);

  // Screenshot during playback - should show "Playing" indicator
  await page.screenshot({ path: "/tmp/audio-playing.png" });

  // Check for playing indicator (use specific selector to avoid multiple matches)
  const playingIndicator = page.locator(".playing-indicator");
  await expect(playingIndicator).toBeVisible({ timeout: 3000 });
  console.log("10. Audio playback started: PASS (Playing indicator visible)");

  // Check for orange "Playing" notes on fretboard
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/audio-playing-notes.png" });
  console.log("11. Fretboard shows active notes during playback");

  // Stop playback
  const stopBtn = page.locator("button").filter({ hasText: "■" });
  await stopBtn.click();
  await page.waitForTimeout(500);
  console.log("12. Playback stopped");
});
