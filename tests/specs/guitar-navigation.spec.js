const { test, expect } = require('@playwright/test');
const { breakpoints } = require('../helpers/test-helpers');

test.describe('Guitar Platform Navigation Tests', () => {
  const baseUrl = 'https://guitar.projectlavos.com';
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/fretvision', name: 'FretVision' },
    { path: '/tabplayer', name: 'Tab Player' },
    { path: '/catalog', name: 'Catalog' },
  ];

  test('should display navigation bar on all pages', async ({ page }) => {
    for (const pageInfo of pages) {
      await page.goto(`${baseUrl}${pageInfo.path}`);
      await page.waitForLoadState('networkidle');

      // Navigation bar should be visible
      const nav = page.locator('nav.bg-gray-800');
      await expect(nav).toBeVisible();

      // Should have sticky positioning
      const navClasses = await nav.getAttribute('class');
      expect(navClasses).toContain('sticky');

      // Should have logo/brand
      const logo = page.locator('nav a:has-text("Guitar Platform")');
      await expect(logo).toBeVisible();

      // Should have navigation links
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(5); // 4 pages + logo
    }
  });

  test('should highlight active route on Home page', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Home link should have active class (bg-green-500)
    const homeLink = page.locator('nav a:has-text("Home")');
    await expect(homeLink).toBeVisible();

    const classes = await homeLink.getAttribute('class');
    expect(classes).toContain('bg-green-500');
    expect(classes).toContain('text-gray-900');
  });

  test('should highlight active route on FretVision page', async ({ page }) => {
    await page.goto(`${baseUrl}/fretvision`);
    await page.waitForLoadState('networkidle');

    // FretVision link should have active class (bg-green-500)
    const fretVisionLink = page.locator('nav a:has-text("FretVision")');
    await expect(fretVisionLink).toBeVisible();

    const classes = await fretVisionLink.getAttribute('class');
    expect(classes).toContain('bg-green-500');
    expect(classes).toContain('text-gray-900');
  });

  test('should highlight active route on Tab Player page', async ({ page }) => {
    await page.goto(`${baseUrl}/tabplayer`);
    await page.waitForLoadState('networkidle');

    // Tab Player link should have active class (bg-blue-500)
    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
    await expect(tabPlayerLink).toBeVisible();

    const classes = await tabPlayerLink.getAttribute('class');
    expect(classes).toContain('bg-blue-500');
    expect(classes).toContain('text-gray-900');
  });

  test('should highlight active route on Catalog page', async ({ page }) => {
    await page.goto(`${baseUrl}/catalog`);
    await page.waitForLoadState('networkidle');

    // Catalog link should have active class (bg-purple-500)
    const catalogLink = page.locator('nav a:has-text("Catalog")');
    await expect(catalogLink).toBeVisible();

    const classes = await catalogLink.getAttribute('class');
    expect(classes).toContain('bg-purple-500');
    expect(classes).toContain('text-gray-900');
  });

  test('should navigate from Home to FretVision', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Click FretVision link in navbar
    await page.click('nav a:has-text("FretVision")');
    await page.waitForURL('**/fretvision');
    await page.waitForLoadState('networkidle');

    // Verify URL changed
    expect(page.url()).toContain('/fretvision');

    // FretVision link should now be active (bg-green-500)
    const fretVisionLink = page.locator('nav a:has-text("FretVision")');

    // Wait for active class to appear
    await expect(fretVisionLink).toHaveClass(/bg-green-500/);
  });

  test('should navigate from FretVision to Tab Player', async ({ page }) => {
    await page.goto(`${baseUrl}/fretvision`);
    await page.waitForLoadState('networkidle');

    // Click Tab Player link in navbar
    await page.click('nav a:has-text("Tab Player")');
    await page.waitForURL('**/tabplayer');
    await page.waitForLoadState('networkidle');

    // Verify URL changed
    expect(page.url()).toContain('/tabplayer');

    // Tab Player link should now be active (bg-blue-500)
    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');

    // Wait for active class to appear
    await expect(tabPlayerLink).toHaveClass(/bg-blue-500/);
  });

  test('should navigate from Tab Player to Catalog', async ({ page }) => {
    await page.goto(`${baseUrl}/tabplayer`);
    await page.waitForLoadState('networkidle');

    // Click Catalog link in navbar
    await page.click('nav a:has-text("Catalog")');
    await page.waitForURL('**/catalog');
    await page.waitForLoadState('networkidle');

    // Verify URL changed
    expect(page.url()).toContain('/catalog');

    // Catalog link should now be active (bg-purple-500)
    const catalogLink = page.locator('nav a:has-text("Catalog")');

    // Wait for active class to appear
    await expect(catalogLink).toHaveClass(/bg-purple-500/);
  });

  test('should navigate to Home when clicking logo', async ({ page }) => {
    // Start on a different page
    await page.goto(`${baseUrl}/catalog`);
    await page.waitForLoadState('networkidle');

    // Click logo
    await page.click('nav a:has-text("Guitar Platform")');
    await page.waitForURL(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Verify we're on home page
    expect(page.url()).toBe(`${baseUrl}/`);

    // Home link should be active
    const homeLink = page.locator('nav a:has-text("Home")');

    // Wait for active class to appear
    await expect(homeLink).toHaveClass(/bg-green-500/);
  });

  test('should load all pages successfully', async ({ page }) => {
    for (const pageInfo of pages) {
      const response = await page.goto(`${baseUrl}${pageInfo.path}`);

      // Verify successful load
      expect(response.status()).toBe(200);

      await page.waitForLoadState('networkidle');

      // Navigation should be visible
      const nav = page.locator('nav.bg-gray-800');
      await expect(nav).toBeVisible();
    }
  });

  test('should maintain sticky navbar when scrolling', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Get initial navbar position
    const nav = page.locator('nav.bg-gray-800');
    await expect(nav).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500); // Wait for scroll

    // Navbar should still be visible (sticky)
    await expect(nav).toBeVisible();

    // Verify sticky positioning
    const position = await page.evaluate(() => {
      const navbar = document.querySelector('nav.bg-gray-800');
      return window.getComputedStyle(navbar).position;
    });
    expect(position).toBe('sticky');
  });

  test('should be mobile responsive on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(breakpoints.mobile);

    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Navigation should be visible
    const nav = page.locator('nav.bg-gray-800');
    await expect(nav).toBeVisible();

    // Links should be visible (might be smaller)
    const homeLink = page.locator('nav a:has-text("Home")');
    await expect(homeLink).toBeVisible();

    const fretVisionLink = page.locator('nav a:has-text("FretVision")');
    await expect(fretVisionLink).toBeVisible();

    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
    await expect(tabPlayerLink).toBeVisible();

    const catalogLink = page.locator('nav a:has-text("Catalog")');
    await expect(catalogLink).toBeVisible();

    // Navigation should work on mobile
    await page.click('nav a:has-text("FretVision")');
    await page.waitForURL('**/fretvision');
    expect(page.url()).toContain('/fretvision');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Visit Home
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Navigate to FretVision
    await page.click('nav a:has-text("FretVision")');
    await page.waitForURL('**/fretvision');
    await page.waitForLoadState('networkidle');

    // Navigate to Tab Player
    await page.click('nav a:has-text("Tab Player")');
    await page.waitForURL('**/tabplayer');
    await page.waitForLoadState('networkidle');

    // Use browser back button
    await page.goBack();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/fretvision');

    // FretVision should be active
    const fretVisionLink = page.locator('nav a:has-text("FretVision")');
    const classes = await fretVisionLink.getAttribute('class');
    expect(classes).toContain('bg-green-500');

    // Use browser forward button
    await page.goForward();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/tabplayer');

    // Tab Player should be active
    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
    const tabPlayerClasses = await tabPlayerLink.getAttribute('class');
    expect(tabPlayerClasses).toContain('bg-blue-500');
  });

  test('should have consistent dark theme across all pages', async ({ page }) => {
    for (const pageInfo of pages) {
      await page.goto(`${baseUrl}${pageInfo.path}`);
      await page.waitForLoadState('networkidle');

      // Navigation should have dark background
      const navBgColor = await page.evaluate(() => {
        const nav = document.querySelector('nav.bg-gray-800');
        return window.getComputedStyle(nav).backgroundColor;
      });

      // Should be a dark gray color (RGB values should be low)
      expect(navBgColor).toBeTruthy();

      // Check for border
      const nav = page.locator('nav.bg-gray-800');
      const classes = await nav.getAttribute('class');
      expect(classes).toContain('border-b');
      expect(classes).toContain('border-gray-700');
    }
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    // Start at Home
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`${baseUrl}/`);

    // Navigate to FretVision
    await page.click('nav a:has-text("FretVision")');
    await page.waitForURL('**/fretvision');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/fretvision');

    // Navigate to Tab Player
    await page.click('nav a:has-text("Tab Player")');
    await page.waitForURL('**/tabplayer');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/tabplayer');

    // Navigate to Catalog
    await page.click('nav a:has-text("Catalog")');
    await page.waitForURL('**/catalog');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/catalog');

    // Navigate back to Home
    await page.click('nav a:has-text("Home")');
    await page.waitForURL(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`${baseUrl}/`);

    // Verify Home is active
    const homeLink = page.locator('nav a:has-text("Home")');

    // Wait for active class to appear
    await expect(homeLink).toHaveClass(/bg-green-500/);
  });
});
