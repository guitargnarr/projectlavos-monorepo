const { test, expect } = require('@playwright/test');
const { breakpoints } = require('../helpers/test-helpers');

test.describe('Guitar Platform Navigation Tests', () => {
  const baseUrl = 'https://guitar.projectlavos.com';

  // Updated pages to match current navigation structure
  const mainNavPages = [
    { path: '/', name: 'Home', linkText: 'Home' },
    { path: '/fretvision', name: 'Fretboard', linkText: 'Fretboard' },
    { path: '/tabplayer', name: 'Tab Player', linkText: 'Tab Player' },
    { path: '/riff-generator', name: 'Riff Gen', linkText: 'Riff Gen' },
    { path: '/chords', name: 'Chords', linkText: 'Chords' },
  ];

  // Pages in "More" dropdown
  const moreDropdownPages = [
    { path: '/catalog', name: 'Catalog', linkText: 'Catalog' },
    { path: '/scales', name: 'Scales', linkText: 'Scales' },
    { path: '/tuner', name: 'Tuner', linkText: 'Tuner' },
  ];

  test('should display navigation bar on all pages', async ({ page }) => {
    for (const pageInfo of mainNavPages) {
      await page.goto(`${baseUrl}${pageInfo.path}`);
      await page.waitForLoadState('networkidle');

      // Navigation bar should be visible (updated selector)
      const nav = page.locator('nav.navbar-elite');
      await expect(nav).toBeVisible();

      // Should have sticky positioning
      const navClasses = await nav.getAttribute('class');
      expect(navClasses).toContain('sticky');

      // Should have logo/brand (updated to FretVision)
      const logo = page.locator('nav a:has-text("FretVision")');
      await expect(logo).toBeVisible();

      // Should have navigation links
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(5);
    }
  });

  test('should highlight active route on Home page', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Home link should have active class (teal brand color)
    const homeLink = page.locator('nav a:has-text("Home")');
    await expect(homeLink).toBeVisible();

    const classes = await homeLink.getAttribute('class');
    expect(classes).toContain('nav-link-active-teal');
  });

  test('should highlight active route on Fretboard page', async ({ page }) => {
    await page.goto(`${baseUrl}/fretvision`);
    await page.waitForLoadState('networkidle');

    // Fretboard link should have active class
    const fretboardLink = page.locator('nav a:has-text("Fretboard")');
    await expect(fretboardLink).toBeVisible();

    const classes = await fretboardLink.getAttribute('class');
    expect(classes).toContain('nav-link-active-teal');
  });

  test('should highlight active route on Tab Player page', async ({ page }) => {
    await page.goto(`${baseUrl}/tabplayer`);
    await page.waitForLoadState('networkidle');

    // Tab Player link should have active class (orange for this route)
    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
    await expect(tabPlayerLink).toBeVisible();

    const classes = await tabPlayerLink.getAttribute('class');
    expect(classes).toContain('nav-link-active-orange');
  });

  test('should access Catalog from More dropdown', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Click More dropdown button
    const moreButton = page.locator('nav button:has-text("More")');
    await expect(moreButton).toBeVisible();
    await moreButton.click();

    // Catalog link should be visible in dropdown
    const catalogLink = page.locator('.more-dropdown a:has-text("Catalog")');
    await expect(catalogLink).toBeVisible();

    // Click Catalog
    await catalogLink.click();
    await page.waitForURL('**/catalog');
    expect(page.url()).toContain('/catalog');
  });

  test('should navigate from Home to Fretboard', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Click Fretboard link in navbar
    await page.click('nav a:has-text("Fretboard")');
    await page.waitForURL('**/fretvision');
    await page.waitForLoadState('networkidle');

    // Verify URL changed
    expect(page.url()).toContain('/fretvision');

    // Fretboard link should now be active
    const fretboardLink = page.locator('nav a:has-text("Fretboard")');
    await expect(fretboardLink).toHaveClass(/nav-link-active-teal/);
  });

  test('should navigate from Fretboard to Tab Player', async ({ page }) => {
    await page.goto(`${baseUrl}/fretvision`);
    await page.waitForLoadState('networkidle');

    // Click Tab Player link in navbar
    await page.click('nav a:has-text("Tab Player")');
    await page.waitForURL('**/tabplayer');
    await page.waitForLoadState('networkidle');

    // Verify URL changed
    expect(page.url()).toContain('/tabplayer');

    // Tab Player link should now be active
    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
    await expect(tabPlayerLink).toHaveClass(/nav-link-active-orange/);
  });

  test('should navigate to Tab Player then to Catalog via dropdown', async ({ page }) => {
    await page.goto(`${baseUrl}/tabplayer`);
    await page.waitForLoadState('networkidle');

    // Click More dropdown
    const moreButton = page.locator('nav button:has-text("More")');
    await moreButton.click();

    // Click Catalog link in dropdown
    const catalogLink = page.locator('.more-dropdown a:has-text("Catalog")');
    await catalogLink.click();
    await page.waitForURL('**/catalog');
    await page.waitForLoadState('networkidle');

    // Verify URL changed
    expect(page.url()).toContain('/catalog');
  });

  test('should navigate to Home when clicking logo', async ({ page }) => {
    // Start on a different page
    await page.goto(`${baseUrl}/fretvision`);
    await page.waitForLoadState('networkidle');

    // Click logo (FretVision text)
    await page.click('nav a:has-text("FretVision")');
    await page.waitForURL(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Verify we're on home page
    expect(page.url()).toBe(`${baseUrl}/`);

    // Home link should be active
    const homeLink = page.locator('nav a:has-text("Home")');
    await expect(homeLink).toHaveClass(/nav-link-active-teal/);
  });

  test('should load all main nav pages successfully', async ({ page }) => {
    for (const pageInfo of mainNavPages) {
      const response = await page.goto(`${baseUrl}${pageInfo.path}`);

      // Verify successful load
      expect(response.status()).toBe(200);

      await page.waitForLoadState('networkidle');

      // Navigation should be visible
      const nav = page.locator('nav.navbar-elite');
      await expect(nav).toBeVisible();
    }
  });

  test('should maintain sticky navbar when scrolling', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Get initial navbar position
    const nav = page.locator('nav.navbar-elite');
    await expect(nav).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Navbar should still be visible (sticky)
    await expect(nav).toBeVisible();

    // Verify sticky positioning
    const position = await page.evaluate(() => {
      const navbar = document.querySelector('nav.navbar-elite');
      return window.getComputedStyle(navbar).position;
    });
    expect(position).toBe('sticky');
  });

  test('should show mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize(breakpoints.mobile);

    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Navigation should be visible
    const nav = page.locator('nav.navbar-elite');
    await expect(nav).toBeVisible();

    // Mobile menu button should be visible
    const mobileMenuBtn = page.locator('button.mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();

    // Click to open mobile menu
    await mobileMenuBtn.click();

    // Mobile menu should show navigation links
    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toBeVisible();

    // Home link should be visible in mobile menu
    const homeLink = page.locator('.mobile-menu a:has-text("Home")');
    await expect(homeLink).toBeVisible();
  });

  test('should navigate via mobile menu', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const mobileMenuBtn = page.locator('button.mobile-menu-btn');
    await mobileMenuBtn.click();

    // Click Fretboard in mobile menu
    const fretboardLink = page.locator('.mobile-menu a:has-text("Fretboard")');
    await fretboardLink.click();
    await page.waitForURL('**/fretvision');

    expect(page.url()).toContain('/fretvision');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Visit Home
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Navigate to Fretboard
    await page.click('nav a:has-text("Fretboard")');
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

    // Fretboard should be active
    const fretboardLink = page.locator('nav a:has-text("Fretboard")');
    const classes = await fretboardLink.getAttribute('class');
    expect(classes).toContain('nav-link-active-teal');

    // Use browser forward button
    await page.goForward();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/tabplayer');

    // Tab Player should be active
    const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
    const tabPlayerClasses = await tabPlayerLink.getAttribute('class');
    expect(tabPlayerClasses).toContain('nav-link-active-orange');
  });

  test('should have dark theme navbar', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Navigation should have dark background via navbar-elite class
    const nav = page.locator('nav.navbar-elite');
    await expect(nav).toBeVisible();

    // Verify it has the elite navbar styling
    const navClasses = await nav.getAttribute('class');
    expect(navClasses).toContain('navbar-elite');
  });

  test('should navigate through main pages in sequence', async ({ page }) => {
    // Start at Home
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`${baseUrl}/`);

    // Navigate to Fretboard
    await page.click('nav a:has-text("Fretboard")');
    await page.waitForURL('**/fretvision');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/fretvision');

    // Navigate to Tab Player
    await page.click('nav a:has-text("Tab Player")');
    await page.waitForURL('**/tabplayer');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/tabplayer');

    // Navigate to Riff Gen
    await page.click('nav a:has-text("Riff Gen")');
    await page.waitForURL('**/riff-generator');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/riff-generator');

    // Navigate back to Home
    await page.click('nav a:has-text("Home")');
    await page.waitForURL(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`${baseUrl}/`);

    // Verify Home is active
    const homeLink = page.locator('nav a:has-text("Home")');
    await expect(homeLink).toHaveClass(/nav-link-active-teal/);
  });

  test('should show More dropdown items when clicked', async ({ page }) => {
    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');

    // Click More dropdown
    const moreButton = page.locator('nav button:has-text("More")');
    await moreButton.click();

    // Dropdown should be visible
    const dropdown = page.locator('.more-dropdown');
    await expect(dropdown).toBeVisible();

    // Check for expected dropdown items
    await expect(page.locator('.more-dropdown a:has-text("Tuner")')).toBeVisible();
    await expect(page.locator('.more-dropdown a:has-text("Catalog")')).toBeVisible();
    await expect(page.locator('.more-dropdown a:has-text("Scales")')).toBeVisible();
  });
});
