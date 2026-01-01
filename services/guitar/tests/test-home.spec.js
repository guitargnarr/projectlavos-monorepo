import { test, expect } from "@playwright/test";

test("Home page loads content", async ({ page }) => {
  await page.goto("https://guitar.projectlavos.com/");

  // Wait for React to render
  await page.waitForSelector("body", { timeout: 10000 });
  await page.waitForTimeout(5000);

  // Check for any visible text
  const bodyText = await page.locator("body").textContent();
  console.log("Body text length:", bodyText.length);
  console.log("First 500 chars:", bodyText.substring(0, 500));

  // Screenshot
  await page.screenshot({ path: "/tmp/home-verified.png", fullPage: true });

  // Should have content
  expect(bodyText.length).toBeGreaterThan(100);
});
