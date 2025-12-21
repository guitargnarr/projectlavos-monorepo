import { test, expect, devices } from '@playwright/test';

test.describe('Demos Platform - Core Functionality', () => {
  test('Page loads successfully', async ({ page }) => {
    const response = await page.goto('https://demos.projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('Title is present', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Main heading visible', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('Navigation or header is present', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });
});

test.describe('Demos Platform - Content', () => {
  test('Demo cards or projects visible', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for demo cards, projects, or grid items
    const demoContent = page.locator('text=/Demo|Project|Showcase|Try|Explore/i');
    const count = await demoContent.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Interactive elements present', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Should have buttons or links to demos
    const interactiveElements = page.locator('a, button');
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Demos Platform - SEO & Meta Tags', () => {
  test('Meta description present', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toBeAttached();
  });

  test('OG image present', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeAttached();
  });

  test('Viewport meta present', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();
  });
});

test.describe('Demos Platform - Mobile Responsiveness', () => {
  test('No horizontal overflow on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
    await context.close();
  });

  test('Touch targets meet 44px minimum', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    const smallTargets = await page.evaluate(() => {
      const elements = [...document.querySelectorAll('a, button')];
      // Use 43.5 threshold to account for subpixel rounding - 44px is the target
      return elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 43.5 || rect.height < 43.5);
      }).map(el => ({
        text: el.textContent?.slice(0, 30),
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height)
      }));
    });

    console.log('Small touch targets found:', JSON.stringify(smallTargets, null, 2));
    expect(smallTargets).toHaveLength(0);
    await context.close();
  });

  test('Navigation accessible on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Mobile menu button or navigation should be visible
    const mobileNav = page.locator('button[aria-label*="menu"], nav, header, [role="navigation"]');
    await expect(mobileNav.first()).toBeVisible();
    await context.close();
  });
});

test.describe('Demos Platform - Accessibility', () => {
  test('Interactive elements are focusable', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('Links have accessible names', async ({ page }) => {
    await page.goto('https://demos.projectlavos.com');
    await page.waitForLoadState('networkidle');

    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      expect(text || ariaLabel || title).toBeTruthy();
    }
  });
});
