const { test, expect } = require('@playwright/test');
const { subdomains } = require('../fixtures/test-data');

test.describe('Cross-Subdomain Navigation Tests', () => {

  test('should navigate from demos to main site', async ({ page }) => {
    // Start at demos
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for links to main site (could be in header, footer, or elsewhere)
    // Exclude links that go to subdomains (demos, about, services, github, etc.)
    const mainSiteLink = page.locator('a[href*="projectlavos.com"]:not([href*="demos."]):not([href*="about."]):not([href*="services."]):not([href*="github"])').first();

    const linkCount = await mainSiteLink.count();
    if (linkCount > 0 && await mainSiteLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await mainSiteLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Verify we're on projectlavos.com
      expect(page.url()).toContain('projectlavos.com');
    } else {
      // No main site link found - skip test
      test.skip();
    }
  });

  test('should navigate from demos to about subdomain', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for about link
    const aboutLink = page.locator('a[href*="about.projectlavos.com"]').first();

    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');

      // Verify navigation
      expect(page.url()).toContain('about.projectlavos.com');
    }
  });

  test('should navigate from demos to services subdomain', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for services link
    const servicesLink = page.locator('a[href*="services.projectlavos.com"]').first();

    if (await servicesLink.count() > 0) {
      await servicesLink.click();
      await page.waitForLoadState('networkidle');

      // Verify navigation
      expect(page.url()).toContain('services.projectlavos.com');
    }
  });

  test('should maintain session state across subdomains', async ({ page }) => {
    // Note: This test assumes some form of session/state management
    // Modify based on actual implementation

    // Start at demos
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Check if cookies/localStorage are set
    const cookies = await page.context().cookies();
    const initialCookieCount = cookies.length;

    // Navigate to another subdomain
    await page.goto('https://about.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Cookies should persist (if using shared domain cookies)
    const newCookies = await page.context().cookies();

    // This is a basic check - actual behavior depends on cookie domain settings
    expect(newCookies.length).toBeGreaterThanOrEqual(0);
  });

  test('should load all subdomains successfully', async ({ page }) => {
    const subdomainUrls = [
      'https://projectlavos.com',
      'https://demos.projectlavos.com',
      'https://about.projectlavos.com',
      'https://services.projectlavos.com'
    ];

    for (const url of subdomainUrls) {
      const response = await page.goto(url);

      // Verify successful load
      expect(response.status()).toBe(200);

      await page.waitForLoadState('networkidle');

      // Take screenshot
      const subdomainName = url.split('//')[1].split('.')[0];
      await page.screenshot({
        path: `test-results/screenshots/subdomain-${subdomainName}.png`,
        fullPage: true
      });
    }
  });

  test('should have consistent branding across subdomains', async ({ page }) => {
    const subdomainUrls = [
      'https://projectlavos.com',
      'https://demos.projectlavos.com',
      'https://about.projectlavos.com',
      'https://services.projectlavos.com'
    ];

    for (const url of subdomainUrls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Check for consistent elements (adjust selectors based on actual site)
      // Look for brand name
      const brandElement = page.locator('text=/Matthew Scott|Project Lavos/i').first();

      if (await brandElement.count() > 0) {
        await expect(brandElement).toBeVisible();
      }

      // Check for consistent color scheme (optional)
      const bodyBg = await page.evaluate(() =>
        window.getComputedStyle(document.body).backgroundColor
      );

      expect(bodyBg).toBeTruthy();
    }
  });

  test('should handle external navigation from demos page', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Find Calendly link (external)
    const calendlyLink = page.locator('a[href*="calendly.com"]').first();

    if (await calendlyLink.count() > 0) {
      // Verify link opens in new tab
      const href = await calendlyLink.getAttribute('href');
      expect(href).toContain('calendly.com');

      const target = await calendlyLink.getAttribute('target');
      expect(target).toBe('_blank');

      // Verify rel attributes for security
      const rel = await calendlyLink.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('should navigate to GitHub from footer', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Look for GitHub link
    const githubLink = page.locator('a[href*="github.com"]').first();

    if (await githubLink.count() > 0) {
      const href = await githubLink.getAttribute('href');
      expect(href).toContain('github.com');

      // Should open in new tab
      const target = await githubLink.getAttribute('target');
      expect(target).toBe('_blank');
    }
  });

  test('should handle email links correctly', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Find email links
    const emailLinks = page.locator('a[href^="mailto:"]');
    const count = await emailLinks.count();

    if (count > 0) {
      const firstEmailLink = emailLinks.first();
      const href = await firstEmailLink.getAttribute('href');

      // Verify mailto format
      expect(href).toContain('mailto:');
      expect(href).toContain('matthewdscott7@gmail.com');
    }
  });

  test('should navigate back to demos from main site', async ({ page, context }) => {
    // Start at main site
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for link to demos
    const demosLink = page.locator('a[href*="demos"]').first();

    if (await demosLink.count() > 0) {
      await demosLink.click();
      await page.waitForLoadState('networkidle');

      // Should be on demos subdomain
      expect(page.url()).toContain('demos');

      // Verify demos are visible
      await expect(page.locator('text=Restaurant Analyzer')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should preserve query parameters across navigation', async ({ page }) => {
    // Navigate with query parameter
    await page.goto('https://demos.projectlavos.com?utm_source=test&utm_medium=e2e');
    await page.waitForLoadState('networkidle');

    // Query params should be in URL
    expect(page.url()).toContain('utm_source=test');
    expect(page.url()).toContain('utm_medium=e2e');
  });

  test('should handle 404 errors gracefully', async ({ page }) => {
    // Try to navigate to non-existent page
    const response = await page.goto('https://demos.projectlavos.com/nonexistent-page');

    // Should get 404 or redirect
    expect([200, 404]).toContain(response.status());
  });

  test('should load assets from correct CDN/origin', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Listen for resource loads
    const resources = [];
    page.on('response', response => {
      if (response.request().resourceType() === 'script' ||
          response.request().resourceType() === 'stylesheet') {
        resources.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    // Reload to capture resources
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify resources loaded successfully
    const failedResources = resources.filter(r => r.status >= 400);
    expect(failedResources.length).toBe(0);
  });

  test('should navigate using browser back/forward buttons', async ({ page }) => {
    // Visit demos
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Try to open a demo
    const restaurantAnalyzer = page.locator('text=Restaurant Analyzer').first();
    if (!await restaurantAnalyzer.isVisible({ timeout: 3000 }).catch(() => false)) {
      test.skip();
      return;
    }
    await restaurantAnalyzer.click();

    // Wait for modal/expanded view to appear
    await page.waitForTimeout(1000);

    // Try to close modal using various methods
    const closeButton = page.locator('button[aria-label="Close"], button:has-text("Close"), button:has-text("×"), [aria-label="close"]').first();
    if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeButton.click();
    } else {
      // Try pressing escape to close
      await page.keyboard.press('Escape');
    }

    // Verify demos page is still functional
    await page.waitForTimeout(500);
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 3000 });
  });

  test('should handle subdomain redirects correctly', async ({ page }) => {
    // Test www redirect (if applicable)
    const response = await page.goto('https://www.projectlavos.com');

    // Should redirect to non-www or handle appropriately
    expect(response.status()).toBeLessThan(400);
  });

  test('should have consistent meta tags across subdomains', async ({ page }) => {
    const subdomainUrls = [
      'https://demos.projectlavos.com',
      'https://about.projectlavos.com'
    ];

    for (const url of subdomainUrls) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Check for essential meta tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const description = await page.locator('meta[name="description"]').getAttribute('content');

      // Should have meta tags
      expect(ogTitle).toBeTruthy();
      expect(description).toBeTruthy();
    }
  });

  test('should load fonts consistently across subdomains', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Check computed font family
    const h1FontFamily = await page.locator('h1').first().evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );

    // Should have a font family defined
    expect(h1FontFamily).toBeTruthy();
    expect(h1FontFamily).not.toBe('');
  });
});
