import { test, expect, devices } from '@playwright/test';

test.describe('Guitar Platform - Core Functionality', () => {
  test('Page loads successfully', async ({ page }) => {
    const response = await page.goto('https://guitar.projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('Title contains FretVision or Guitar', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/guitar|fretvision|fretboard/);
  });

  test('Main heading visible', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('Navigation is present', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });
});

test.describe('Guitar Platform - Features', () => {
  test('Catalog/Lessons section visible', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for catalog, lessons, or browse section
    const catalog = page.locator('text=/Catalog|Lessons|Browse|Library/i');
    await expect(catalog.first()).toBeVisible();
  });

  test('FretVision or fretboard visualization available', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for fretboard-related content - check multiple locators
    const fretboardText = page.locator('text=/Fretboard|FretVision|Visualiz/i');
    const canvas = page.locator('canvas');
    const svg = page.locator('svg');

    const textCount = await fretboardText.count();
    const canvasCount = await canvas.count();
    const svgCount = await svg.count();

    expect(textCount + canvasCount + svgCount).toBeGreaterThan(0);
  });

  test('Riff generator accessible', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/riff-generator');
    await page.waitForLoadState('networkidle');

    // Should have riff generator content
    const riffContent = page.locator('text=/Riff|Generate|Scale|Pattern/i');
    await expect(riffContent.first()).toBeVisible();
  });
});

test.describe('Guitar Platform - SEO & Meta Tags', () => {
  test('Meta description present', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toBeAttached();
  });

  test('OG image present', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeAttached();
  });

  test('Viewport meta present', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();
  });
});

test.describe('Guitar Platform - Mobile Responsiveness', () => {
  test('No horizontal overflow on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    await page.goto('https://guitar.projectlavos.com');
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
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');

    const smallTargets = await page.evaluate(() => {
      const elements = [...document.querySelectorAll('a, button')];
      return elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
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
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Mobile menu button or navigation should be visible
    const mobileNav = page.locator('button[aria-label*="menu"], nav, [role="navigation"]');
    await expect(mobileNav.first()).toBeVisible();
    await context.close();
  });
});

test.describe('Guitar Platform - Accessibility', () => {
  test('Interactive elements are focusable', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('Links have accessible names', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com');
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

test.describe('Guitar Platform - Pricing Page', () => {
  test('Pricing page loads', async ({ page }) => {
    const response = await page.goto('https://guitar.projectlavos.com/pricing');
    expect(response.status()).toBe(200);
  });

  test('Pricing tiers visible', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/pricing');
    await page.waitForLoadState('networkidle');

    // Look for pricing tiers
    const pricing = page.locator('text=/Free|Pro|Premium|month|year/i');
    await expect(pricing.first()).toBeVisible();
  });
});
