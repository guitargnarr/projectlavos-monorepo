// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://mirador.projectlavos.com';

test.describe('Mirador Landing Page - Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('hero section displays benefit-focused messaging', async ({ page }) => {
    // Main headline - problem-focused
    await expect(page.locator('h1')).toContainText('AI Security Scanning');
    await expect(page.locator('h1')).toContainText('That Never Leaves Your Machine');
    
    // Value proposition
    await expect(page.getByText('Your code is sensitive. Cloud AI isn\'t an option.')).toBeVisible();
    await expect(page.getByText('Mirador runs 100% locally via Ollama')).toBeVisible();
  });

  test('hero proof points are visible', async ({ page }) => {
    await expect(page.getByText('Found real CORS vulnerability in production')).toBeVisible();
    await expect(page.getByText('16 AI models review your code in sequence')).toBeVisible();
    await expect(page.getByText('Zero API costs, zero data exposure')).toBeVisible();
  });

  test('target audience section shows three industries', async ({ page }) => {
    await expect(page.getByText('Built For Engineers Who Can\'t Use Cloud AI')).toBeVisible();
    
    // Three target industries
    await expect(page.getByText('Healthcare / HIPAA')).toBeVisible();
    await expect(page.getByText('Finance / SOC2')).toBeVisible();
    await expect(page.getByText('Defense / IP')).toBeVisible();
    
    // Industry descriptions
    await expect(page.getByText('Patient data can\'t leave your network')).toBeVisible();
    await expect(page.getByText('Trading algorithms, PII, audit trails')).toBeVisible();
    await expect(page.getByText('Proprietary code stays proprietary')).toBeVisible();
  });

  test('how it works section shows 4 numbered steps', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'How It Works' })).toBeVisible();
    
    // Four steps - use heading role for step titles
    await expect(page.getByRole('heading', { name: 'Send Code' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '16 Models Analyze' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Self-Critique' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Get Findings' })).toBeVisible();
    
    // Step descriptions
    await expect(page.getByText('POST your code to localhost:5001')).toBeVisible();
    await expect(page.getByText('Meta-cognitive layer identifies blind spots')).toBeVisible();
  });

  test('real example section shows SQL injection demo', async ({ page }) => {
    await expect(page.getByText('Real Example: SQL Injection Found')).toBeVisible();
    await expect(page.getByText('Input: Vulnerable Code')).toBeVisible();
    await expect(page.getByText('Output: Security Findings')).toBeVisible();
    
    // SQL injection details
    await expect(page.getByText('CRITICAL')).toBeVisible();
    await expect(page.getByText('SQL Injection (CWE-89)')).toBeVisible();
    await expect(page.getByText('FIX:')).toBeVisible();
  });

  test('accuracy badges show chain recommendations', async ({ page }) => {
    // Chain names - look for text in the result cards section
    await expect(page.locator('h3').filter({ hasText: 'security_audit' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'architecture' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'code_review' })).toBeVisible();
    
    // Accuracy ratings
    await expect(page.getByText('100%').first()).toBeVisible();
    await expect(page.getByText('~70%')).toBeVisible();
    await expect(page.getByText('Weak')).toBeVisible();
  });

  test('architecture diagram is visible', async ({ page }) => {
    // Check Architecture section heading (h2, exact match to avoid h3 accuracy badge)
    await expect(page.getByRole('heading', { name: 'Architecture', exact: true })).toBeVisible();
    
    // Check there's at least one pre element (code block) on page
    await expect(page.locator('pre').first()).toBeVisible();
    
    // Verify page HTML contains key architecture terms
    const pageContent = await page.content();
    expect(pageContent).toContain('Flask API');
    expect(pageContent).toContain('Persona Chain');
  });

  test('quick start section has copyable code', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quick Start' })).toBeVisible();
    
    // Installation commands
    await expect(page.getByText('curl -fsSL https://ollama.ai/install.sh')).toBeVisible();
    await expect(page.getByText('git clone https://github.com/guitargnarr/mirador')).toBeVisible();
    await expect(page.getByText('python api.py')).toBeVisible();
    await expect(page.getByText('curl http://localhost:5001/api/health')).toBeVisible();
    
    // Copy button
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
  });

  test('API endpoints section lists all routes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API Endpoints' })).toBeVisible();
    
    // Endpoints - use exact match
    await expect(page.getByText('/api/health', { exact: true })).toBeVisible();
    await expect(page.getByText('/api/personas', { exact: true })).toBeVisible();
    await expect(page.getByText('/api/sessions', { exact: true })).toBeVisible();
    await expect(page.locator('code').filter({ hasText: '/api/run' }).first()).toBeVisible();
    await expect(page.getByText('/api/webhooks', { exact: true })).toBeVisible();
    
    // HTTP methods - look for badges
    await expect(page.locator('span').filter({ hasText: 'GET' }).first()).toBeVisible();
    await expect(page.locator('span').filter({ hasText: 'POST' }).first()).toBeVisible();
  });

  test('research section shows academic links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Research Alignment' })).toBeVisible();
    await expect(page.getByText('Microsoft AI Agents Curriculum')).toBeVisible();
    await expect(page.getByText('Honda Research')).toBeVisible();
    await expect(page.getByText('Self-Evolving Agents')).toBeVisible();
  });

  test('footer shows Project Lavos branding', async ({ page }) => {
    await expect(page.getByText('Part of the')).toBeVisible();
    await expect(page.getByText('Project Lavos')).toBeVisible();
    await expect(page.getByText('MIT License')).toBeVisible();
  });
});

test.describe('Mirador Landing Page - Navigation & Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('nav logo displays MIRADOR', async ({ page }) => {
    const logo = page.locator('nav').getByText('MIRADOR');
    await expect(logo).toBeVisible();
  });

  test('nav GitHub link points to correct repo', async ({ page }) => {
    const githubLink = page.locator('nav').getByRole('link', { name: 'GitHub' });
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/guitargnarr/mirador');
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });

  test('nav Portfolio link points to projectlavos.com', async ({ page }) => {
    const portfolioLink = page.locator('nav').getByRole('link', { name: 'Portfolio' });
    await expect(portfolioLink).toHaveAttribute('href', 'https://projectlavos.com');
  });

  test('hero CTA buttons have correct links', async ({ page }) => {
    // View on GitHub button
    const githubCta = page.getByRole('link', { name: 'View on GitHub' });
    await expect(githubCta).toHaveAttribute('href', 'https://github.com/guitargnarr/mirador');
    await expect(githubCta).toHaveAttribute('target', '_blank');
    
    // Quick Start button (anchor link)
    const quickStartCta = page.getByRole('link', { name: 'Quick Start' });
    await expect(quickStartCta).toHaveAttribute('href', '#quickstart');
  });

  test('Quick Start anchor scrolls to section', async ({ page }) => {
    await page.getByRole('link', { name: 'Quick Start' }).click();
    
    // Verify URL hash
    await expect(page).toHaveURL(`${BASE_URL}/#quickstart`);
    
    // Verify section is in view
    const quickStartSection = page.locator('#quickstart');
    await expect(quickStartSection).toBeInViewport();
  });

  test('research links open in new tab', async ({ page }) => {
    const microsoftLink = page.getByRole('link', { name: /Microsoft AI Agents/ });
    await expect(microsoftLink).toHaveAttribute('target', '_blank');
    await expect(microsoftLink).toHaveAttribute('href', /microsoft.github.io/);
    
    const hondaLink = page.getByRole('link', { name: /Honda Research/ });
    await expect(hondaLink).toHaveAttribute('target', '_blank');
    await expect(hondaLink).toHaveAttribute('href', /honda-ri.com/);
    
    const arxivLink = page.getByRole('link', { name: /Self-Evolving Agents/ });
    await expect(arxivLink).toHaveAttribute('target', '_blank');
    await expect(arxivLink).toHaveAttribute('href', /arxiv.org/);
  });

  test('footer Project Lavos link works', async ({ page }) => {
    const footerLink = page.locator('footer').getByRole('link', { name: 'Project Lavos' });
    await expect(footerLink).toHaveAttribute('href', 'https://projectlavos.com');
  });
});

test.describe('Mirador Landing Page - VHS Terminal Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('VHS demo section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'See It In Action' })).toBeVisible();
    await expect(page.getByText('Watch a security audit chain analyze vulnerable code')).toBeVisible();
  });

  test('demo button shows correct initial state', async ({ page }) => {
    const demoButton = page.getByRole('button', { name: 'Run Security Audit Demo' });
    await expect(demoButton).toBeVisible();
    await expect(demoButton).toBeEnabled();
  });

  test('terminal has VHS-style header with traffic lights', async ({ page }) => {
    // Red/yellow/green traffic light dots
    await expect(page.locator('.bg-red-500.rounded-full')).toBeVisible();
    await expect(page.locator('.bg-yellow-500.rounded-full')).toBeVisible();
    await expect(page.locator('.bg-green-500.rounded-full')).toBeVisible();
    
    // Terminal title
    await expect(page.getByText('mirador-demo.tape')).toBeVisible();
  });

  test('clicking demo button starts animation', async ({ page }) => {
    const demoButton = page.getByRole('button', { name: 'Run Security Audit Demo' });
    await demoButton.click();
    
    // Button should change to running state
    await expect(page.getByRole('button', { name: 'Running Demo...' })).toBeVisible();
    
    // REC indicator should appear
    await expect(page.getByText('REC')).toBeVisible();
  });

  test('demo shows simulated output note', async ({ page }) => {
    await expect(page.getByText('Simulated output - run locally for real analysis')).toBeVisible();
  });
});

test.describe('Mirador Landing Page - Interactive Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('copy button copies quick start code', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: 'Copy' });
    await copyButton.click();
    
    // Button text changes to "Copied!"
    await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
    
    // Button resets after 2 seconds
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible({ timeout: 3000 });
  });

  test('feature cards are hoverable', async ({ page }) => {
    const featureCards = page.locator('.bg-slate-800.rounded-xl.p-6');
    const firstCard = featureCards.first();
    
    // Card should have hover transition class
    await expect(firstCard).toHaveClass(/hover:bg-slate-700/);
  });
});

test.describe('Mirador Landing Page - Visual & Meta', () => {
  test('page has correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Mirador AI Orchestrator/);
  });

  test('page has meta description', async ({ page }) => {
    await page.goto(BASE_URL);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /16 specialized AI personas/);
  });

  test('page has OG tags for social sharing', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', 'Mirador AI Orchestrator');
    
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /mirador.projectlavos.com.*og-image/);
    
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute('content', 'https://mirador.projectlavos.com');
  });

  test('page has favicon', async ({ page }) => {
    await page.goto(BASE_URL);
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
  });

  test('page is responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Hero should still be visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Navigation should be visible
    await expect(page.locator('nav')).toBeVisible();
  });

  test('page loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors (e.g., favicon 404 on some browsers)
    const criticalErrors = errors.filter(e => !e.includes('favicon'));
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Mirador Landing Page - External Link Validation', () => {
  test('GitHub repo is accessible', async ({ request }) => {
    const response = await request.get('https://github.com/guitargnarr/mirador');
    expect(response.status()).toBe(200);
  });

  test('Project Lavos portfolio is accessible', async ({ request }) => {
    const response = await request.get('https://projectlavos.com');
    expect(response.status()).toBe(200);
  });

  test('Microsoft research link is accessible', async ({ request }) => {
    const response = await request.get('https://microsoft.github.io/ai-agents-for-beginners/09-metacognition/');
    expect([200, 301, 302]).toContain(response.status());
  });
});
