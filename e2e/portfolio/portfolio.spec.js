/**
 * Consolidated Portfolio E2E Tests
 *
 * Tests all 10 portfolio sites for:
 * - Core functionality (page load, title, heading)
 * - SEO meta tags (description, OG image, viewport)
 * - Mobile responsiveness (no overflow, 44px touch targets)
 * - Accessibility (focusable elements, link names)
 *
 * Run: npx playwright test e2e/portfolio/portfolio.spec.js
 */

import { test, expect, devices } from '@playwright/test';

// All portfolio sites to test
const PORTFOLIO_SITES = [
  {
    name: 'projectlavos.com',
    url: 'https://projectlavos.com',
    expectedContent: /Project Lavos|Matthew|Portfolio/i,
  },
  {
    name: 'guitar.projectlavos.com',
    url: 'https://guitar.projectlavos.com',
    expectedContent: /Guitar|Fret|Music|Lesson/i,
  },
  {
    name: 'demos.projectlavos.com',
    url: 'https://demos.projectlavos.com',
    expectedContent: /Demo|AI|Sentiment|Phishing/i,
  },
  {
    name: 'about.projectlavos.com',
    url: 'https://about.projectlavos.com',
    expectedContent: /About|Matthew|Contact/i,
  },
  {
    name: 'jobs.projectlavos.com',
    url: 'https://jobs.projectlavos.com',
    expectedContent: /Job|Career|Search|Louisville/i,
  },
  {
    name: 'interactive-resume',
    url: 'https://interactive-resume-ten-pi.vercel.app',
    expectedContent: /Matthew|Resume|Experience|Skills/i,
  },
  {
    name: 'ourjourney-app',
    url: 'https://ourjourney-app.vercel.app',
    expectedContent: /Journey|Goals|Welcome/i,
  },
  {
    name: 'ba-pathfinder',
    url: 'https://ba-pathfinder.vercel.app',
    expectedContent: /BA|Business Analyst|Pathfinder|Roadmap/i,
  },
  {
    name: 'phishguard-ui',
    url: 'https://phishguard-ui.vercel.app',
    expectedContent: /PhishGuard|Phishing|Security|Email/i,
  },
  {
    name: 'jaspermatters',
    url: 'https://jaspermatters-job-intelligence.vercel.app',
    expectedContent: /Matthew|ML|AI|Job Intelligence/i,
  },
];

// ============================================================
// CORE FUNCTIONALITY TESTS
// ============================================================

test.describe('Portfolio Sites - Core Functionality', () => {
  for (const site of PORTFOLIO_SITES) {
    test(`${site.name} - Page loads successfully`, async ({ page }) => {
      const response = await page.goto(site.url);
      expect(response?.status()).toBe(200);
    });

    test(`${site.name} - Title is present`, async ({ page }) => {
      await page.goto(site.url);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test(`${site.name} - Main heading visible`, async ({ page }) => {
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');
      const heading = page.locator('h1, h2, [class*="title"]');
      await expect(heading.first()).toBeVisible();
    });

    test(`${site.name} - Expected content visible`, async ({ page }) => {
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');
      const content = page.locator(`text=${site.expectedContent.source}`);
      // At least one match should be found
      await expect(page.locator('body')).toContainText(site.expectedContent);
    });
  }
});

// ============================================================
// SEO & META TAGS TESTS
// ============================================================

test.describe('Portfolio Sites - SEO & Meta Tags', () => {
  for (const site of PORTFOLIO_SITES) {
    test(`${site.name} - Meta description present`, async ({ page }) => {
      await page.goto(site.url);
      const metaDesc = page.locator('meta[name="description"]');
      await expect(metaDesc).toBeAttached();
    });

    test(`${site.name} - OG image present`, async ({ page }) => {
      await page.goto(site.url);
      const ogImage = page.locator('meta[property="og:image"]');
      await expect(ogImage).toBeAttached();
    });

    test(`${site.name} - Viewport meta present`, async ({ page }) => {
      await page.goto(site.url);
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toBeAttached();
    });
  }
});

// ============================================================
// MOBILE RESPONSIVENESS TESTS
// ============================================================

test.describe('Portfolio Sites - Mobile Responsiveness', () => {
  for (const site of PORTFOLIO_SITES) {
    test(`${site.name} - No horizontal overflow on mobile`, async ({ browser }) => {
      const context = await browser.newContext({ ...devices['iPhone 12'] });
      const page = await context.newPage();
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');

      // Allow 5px tolerance for subpixel rendering differences across browsers
      const overflowAmount = await page.evaluate(() => {
        return document.body.scrollWidth - document.documentElement.clientWidth;
      });
      expect(overflowAmount).toBeLessThanOrEqual(5);
      await context.close();
    });

    test(`${site.name} - Touch targets meet 44px minimum`, async ({ browser }) => {
      const context = await browser.newContext({ ...devices['iPhone 12'] });
      const page = await context.newPage();
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');

      const smallTargets = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('a, button')];
        return elements.filter(el => {
          const rect = el.getBoundingClientRect();
          // Skip sr-only and hidden elements
          const computedStyle = window.getComputedStyle(el);
          if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') return false;
          const isSrOnly = computedStyle.position === 'absolute' &&
                           (rect.width <= 1 || rect.height <= 1);
          if (isSrOnly) return false;
          // Use 43.5 threshold for subpixel rounding
          return rect.width > 0 && rect.height > 0 && (rect.width < 43.5 || rect.height < 43.5);
        }).map(el => ({
          text: el.textContent?.slice(0, 30),
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height)
        }));
      });

      if (smallTargets.length > 0) {
        console.log(`[${site.name}] Small touch targets:`, JSON.stringify(smallTargets, null, 2));
      }
      expect(smallTargets).toHaveLength(0);
      await context.close();
    });

    test(`${site.name} - Content accessible on mobile`, async ({ browser }) => {
      const context = await browser.newContext({ ...devices['iPhone 12'] });
      const page = await context.newPage();
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('h1, h2, main, section, [class*="content"]');
      await expect(mainContent.first()).toBeVisible();
      await context.close();
    });
  }
});

// ============================================================
// ACCESSIBILITY TESTS
// ============================================================

test.describe('Portfolio Sites - Accessibility', () => {
  for (const site of PORTFOLIO_SITES) {
    test(`${site.name} - Interactive elements are focusable`, async ({ page }) => {
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');

      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

    test(`${site.name} - Links have accessible names`, async ({ page }) => {
      await page.goto(site.url);
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
  }
});

// ============================================================
// INTERACTIVE ELEMENTS TEST
// ============================================================

test.describe('Portfolio Sites - Interactive Elements', () => {
  for (const site of PORTFOLIO_SITES) {
    test(`${site.name} - Has interactive elements`, async ({ page }) => {
      await page.goto(site.url);
      await page.waitForLoadState('networkidle');

      const interactiveElements = page.locator('a, button');
      const count = await interactiveElements.count();
      expect(count).toBeGreaterThan(0);
    });
  }
});
