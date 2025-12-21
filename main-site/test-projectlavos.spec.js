import { test, expect, devices } from '@playwright/test';

test.describe('ProjectLavos - Core Functionality', () => {
  test('Page loads successfully', async ({ page }) => {
    const response = await page.goto('https://projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('Title is present', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Main heading visible', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('Navigation is present', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });
});

test.describe('ProjectLavos - Portfolio Projects', () => {
  test('Projects section visible', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Look for projects section or cards
    const projects = page.locator('text=/Projects|Portfolio|Work/i');
    await expect(projects.first()).toBeVisible();
  });

  test('Project links are functional', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    // Check for external links
    const links = page.locator('a[href*="http"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('ProjectLavos - Subdomains', () => {
  test('guitar.projectlavos.com loads', async ({ page }) => {
    const response = await page.goto('https://guitar.projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('jobs.projectlavos.com loads', async ({ page }) => {
    const response = await page.goto('https://jobs.projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('about.projectlavos.com loads', async ({ page }) => {
    const response = await page.goto('https://about.projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('demos.projectlavos.com loads', async ({ page }) => {
    const response = await page.goto('https://demos.projectlavos.com');
    expect(response.status()).toBe(200);
  });
});

test.describe('ProjectLavos - SEO & Meta Tags', () => {
  test('Meta description present', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toBeAttached();
  });

  test('OG image present', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeAttached();
  });

  test('Viewport meta present', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeAttached();
  });
});

test.describe('ProjectLavos - Mobile Responsiveness', () => {
  test('No horizontal overflow on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    await page.goto('https://projectlavos.com');
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
    await page.goto('https://projectlavos.com');
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

  test('Main content accessible on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    const main = page.locator('main, [role="main"], body > div');
    await expect(main.first()).toBeVisible();
    await context.close();
  });
});

test.describe('ProjectLavos - Accessibility', () => {
  test('Interactive elements are focusable', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('Links have accessible names', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Link should have some accessible name
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });
});

test.describe('ProjectLavos - Brand Consistency', () => {
  test('Uses teal brand color', async ({ page }) => {
    await page.goto('https://projectlavos.com');
    await page.waitForLoadState('networkidle');

    const hasTeal = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const style = getComputedStyle(el);
        const colors = [style.color, style.backgroundColor, style.borderColor];
        for (const color of colors) {
          // Check for teal shades (#14b8a6, #2dd4bf, rgb equivalents)
          if (color.includes('20, 184, 166') || color.includes('45, 212, 191') ||
              color.includes('rgb(20, 184, 166)') || color.includes('rgb(45, 212, 191)')) {
            return true;
          }
        }
      }
      return false;
    });

    expect(hasTeal).toBe(true);
  });
});
