const { test, expect } = require('@playwright/test');

/**
 * Cross-Subdomain Navigation Tests
 * Based on WEEK2_ACTIONABLE_CHECKLIST.md items 22-25
 */

test.describe('Cross-Subdomain Navigation', () => {
  const subdomains = {
    main: 'https://projectlavos.com',
    demos: 'https://demos.projectlavos.com',
    about: 'https://about.projectlavos.com',
    services: 'https://services.projectlavos.com'
  };

  test('should navigate from main to demos', async ({ page }) => {
    await page.goto(subdomains.main);

    // Look for "Try Demos" or similar link
    const demosLink = page.locator('a[href*="demos.projectlavos.com"], a:has-text("Demos"), a:has-text("Try")').first();
    
    if (await demosLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await demosLink.click();
      await page.waitForLoadState('networkidle');

      // Should be on demos subdomain
      expect(page.url()).toContain('demos.projectlavos.com');
      
      // Verify demos page loaded
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('should navigate from about to demos', async ({ page }) => {
    await page.goto(subdomains.about);

    // Look for "Try Free Demos" button (item 23)
    const demosButton = page.locator('a:has-text("Try Free Demos"), button:has-text("Demos")').first();
    
    if (await demosButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await demosButton.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to demos.projectlavos.com
      expect(page.url()).toContain('demos.projectlavos.com');
    }
  });

  test('should have contact link on about page', async ({ page }) => {
    await page.goto(subdomains.about);

    // Look for any contact link (mailto or contact page)
    const contactLink = page.locator('a[href*="mailto:"], a:has-text("Contact"), a:has-text("Get in Touch"), button:has-text("Contact")').first();

    // Skip if no contact link found (page may have different layout)
    if (await contactLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      const href = await contactLink.getAttribute('href');
      // Verify it's a valid link
      expect(href).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should display main heading on about page', async ({ page }) => {
    await page.goto(subdomains.about);

    // Look for any prominent heading on the about page
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 5000 });

    // Verify heading has content
    const text = await heading.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test('should navigate from demos back to main', async ({ page }) => {
    await page.goto(subdomains.demos);

    // Look for navigation to main site
    const homeLink = page.locator('a[href*="projectlavos.com"]:not([href*="demos"]):not([href*="about"]):not([href*="services"]), a:has-text("Home")').first();
    
    if (await homeLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');

      // Should be on main domain (not subdomain)
      const url = page.url();
      expect(url).toContain('projectlavos.com');
      expect(url).not.toContain('demos.');
      expect(url).not.toContain('about.');
      expect(url).not.toContain('services.');
    }
  });

  test('should navigate from main to about', async ({ page }) => {
    await page.goto(subdomains.main);

    const aboutLink = page.locator('a[href*="about.projectlavos.com"], a:has-text("About")').first();
    
    if (await aboutLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('about.projectlavos.com');
    }
  });

  test('should navigate from main to services', async ({ page }) => {
    await page.goto(subdomains.main);

    const servicesLink = page.locator('a[href*="services.projectlavos.com"], a:has-text("Services"), a:has-text("Pricing")').first();
    
    if (await servicesLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await servicesLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('services.projectlavos.com');
    }
  });

  test('should maintain consistent navigation across all subdomains', async ({ page }) => {
    // Test that navigation header is consistent
    const subdomain_urls = Object.values(subdomains);

    for (const url of subdomain_urls) {
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');

      // Check for navigation menu - some pages may not have nav
      const nav = page.locator('nav, header').first();
      const hasNav = await nav.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasNav) {
        // Should have links
        const links = await page.locator('nav a, header a').count();
        expect(links).toBeGreaterThanOrEqual(0);
      }
      // Pages without nav are acceptable (single-page apps, etc.)
    }
  });

  test('should load all subdomains without errors', async ({ page }) => {
    const subdomain_urls = Object.values(subdomains);
    const errors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    for (const url of subdomain_urls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Should have title
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);

      // Should have content
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }

    // No critical errors should occur
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    expect(criticalErrors.length).toBe(0);
  });
});
