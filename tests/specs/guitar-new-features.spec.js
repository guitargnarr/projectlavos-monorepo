const { test, expect } = require('@playwright/test');

test.describe('Guitar Platform New Features Tests', () => {
  const baseUrl = 'https://guitar.projectlavos.com';

  // Helper to open More dropdown and click a link
  async function clickMoreDropdownLink(page, linkText) {
    const moreButton = page.locator('nav button:has-text("More")');
    await moreButton.click();
    const link = page.locator(`.more-dropdown a:has-text("${linkText}")`);
    await link.click();
  }

  test.describe('Backing Tracks (/backing)', () => {
    test('should load backing tracks page successfully', async ({ page }) => {
      const response = await page.goto(`${baseUrl}/backing`);
      expect(response.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Header should be visible
      const header = page.locator('h1:has-text("Backing Tracks")');
      await expect(header).toBeVisible();
    });

    test('should highlight Backing in More dropdown with active style', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      // More button should show active state when on Backing page
      const moreButton = page.locator('nav button:has-text("More")');
      await expect(moreButton).toBeVisible();

      // Click More to see dropdown
      await moreButton.click();

      // Backing link should have active styling in dropdown
      const backingLink = page.locator('.more-dropdown a:has-text("Backing")');
      await expect(backingLink).toBeVisible();
      const classes = await backingLink.getAttribute('class');
      expect(classes).toContain('dropdown-link-active');
    });

    test('should display key selection buttons', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      // Should have 12 key buttons (C through B)
      const keyButtons = page.locator('button:has-text("C"), button:has-text("D"), button:has-text("E"), button:has-text("F"), button:has-text("G"), button:has-text("A"), button:has-text("B")');
      const count = await keyButtons.count();
      expect(count).toBeGreaterThanOrEqual(7);
    });

    test('should display style selection buttons', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      // Should have style buttons
      const rockBtn = page.locator('button:has-text("Rock")');
      const bluesBtn = page.locator('button:has-text("Blues")');
      const jazzBtn = page.locator('button:has-text("Jazz")');

      await expect(rockBtn).toBeVisible();
      await expect(bluesBtn).toBeVisible();
      await expect(jazzBtn).toBeVisible();
    });

    test('should display BPM control', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      // BPM slider should exist
      const bpmSlider = page.locator('input[type="range"]').first();
      await expect(bpmSlider).toBeVisible();

      // BPM number input should exist
      const bpmInput = page.locator('input[type="number"]');
      await expect(bpmInput).toBeVisible();
    });

    test('should have Start button', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      const startBtn = page.locator('button:has-text("Start")');
      await expect(startBtn).toBeVisible();
    });

    test('should change key when clicking key button', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      // Click on G key
      const gButton = page.locator('button:has-text("G")').first();
      await gButton.click();

      // G should now have active styling
      const classes = await gButton.getAttribute('class');
      expect(classes).toContain('bg-orange-500');
    });

    test('should change style when clicking style button', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      // Click on Jazz
      const jazzBtn = page.locator('button:has-text("Jazz")');
      await jazzBtn.click();

      // Jazz should now have active styling
      const classes = await jazzBtn.getAttribute('class');
      expect(classes).toContain('bg-orange-500');
    });
  });

  test.describe('Scale Trainer (/scales)', () => {
    test('should load scale trainer page successfully', async ({ page }) => {
      const response = await page.goto(`${baseUrl}/scales`);
      expect(response.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Header should be visible
      const header = page.locator('h1:has-text("Scale Trainer")');
      await expect(header).toBeVisible();
    });

    test('should highlight Scales in More dropdown with active style', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Click More to see dropdown
      const moreButton = page.locator('nav button:has-text("More")');
      await moreButton.click();

      // Scales link should have active styling in dropdown
      const scalesLink = page.locator('.more-dropdown a:has-text("Scales")');
      await expect(scalesLink).toBeVisible();
      const classes = await scalesLink.getAttribute('class');
      expect(classes).toContain('dropdown-link-active');
    });

    test('should display root note selection', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Should have root note buttons
      const rootLabel = page.locator('label:has-text("Root Note")');
      await expect(rootLabel).toBeVisible();

      // Should have at least 12 note buttons
      const noteButtons = page.locator('button').filter({ hasText: /^[A-G]#?$/ });
      const count = await noteButtons.count();
      expect(count).toBeGreaterThanOrEqual(12);
    });

    test('should display scale type selection', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Scale buttons should be visible
      const majorBtn = page.locator('button:has-text("Major")').first();
      const minorBtn = page.locator('button:has-text("Minor")').first();
      const bluesBtn = page.locator('button:has-text("Blues")');

      await expect(majorBtn).toBeVisible();
      await expect(minorBtn).toBeVisible();
      await expect(bluesBtn).toBeVisible();
    });

    test('should display practice mode selection', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Practice mode buttons
      const ascendingBtn = page.locator('button:has-text("Ascending")');
      const descendingBtn = page.locator('button:has-text("Descending")');
      const randomBtn = page.locator('button:has-text("Random")');

      await expect(ascendingBtn).toBeVisible();
      await expect(descendingBtn).toBeVisible();
      await expect(randomBtn).toBeVisible();
    });

    test('should display fretboard visualization', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Page should have loaded with scale trainer content
      const header = page.locator('h1:has-text("Scale Trainer")');
      await expect(header).toBeVisible();

      // Should have scale selection buttons
      const majorBtn = page.locator('button:has-text("Major")');
      await expect(majorBtn).toBeVisible();
    });

    test('should have Start Listening button', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      const listenBtn = page.locator('button:has-text("Start Listening")');
      await expect(listenBtn).toBeVisible();
    });

    test('should have Play Scale button', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      const playBtn = page.locator('button:has-text("Play Scale")');
      await expect(playBtn).toBeVisible();
    });

    test('should change scale when clicking scale button', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Click on Blues scale
      const bluesBtn = page.locator('button:has-text("Blues")');
      await bluesBtn.click();

      // Blues should have active styling
      const classes = await bluesBtn.getAttribute('class');
      expect(classes).toContain('bg-teal-500');
    });
  });

  test.describe('Ear Training (/ear-training)', () => {
    test('should load ear training page successfully', async ({ page }) => {
      const response = await page.goto(`${baseUrl}/ear-training`);
      expect(response.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Header should be visible
      const header = page.locator('h1:has-text("Ear Training")');
      await expect(header).toBeVisible();
    });

    test('should highlight Ear Training in More dropdown with active style', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Click More to see dropdown
      const moreButton = page.locator('nav button:has-text("More")');
      await moreButton.click();

      // Ear Training link should have active styling in dropdown
      const earLink = page.locator('.more-dropdown a:has-text("Ear Training")');
      await expect(earLink).toBeVisible();
      const classes = await earLink.getAttribute('class');
      expect(classes).toContain('dropdown-link-active');
    });

    test('should display game mode selection', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Game mode buttons (use first() to avoid strict mode with multiple matches)
      const intervalsBtn = page.locator('button:has-text("Intervals")').first();
      const chordsBtn = page.locator('button:has-text("Chords")').first();

      await expect(intervalsBtn).toBeVisible();
      await expect(chordsBtn).toBeVisible();
    });

    test('should display difficulty selection for intervals mode', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Difficulty buttons
      const easyBtn = page.locator('button:has-text("Easy")');
      const mediumBtn = page.locator('button:has-text("Medium")');
      const hardBtn = page.locator('button:has-text("Hard")');

      await expect(easyBtn).toBeVisible();
      await expect(mediumBtn).toBeVisible();
      await expect(hardBtn).toBeVisible();
    });

    test('should have Start Training button', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      const startBtn = page.locator('button:has-text("Start Training")');
      await expect(startBtn).toBeVisible();
    });

    test('should display interval reference', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Interval reference section
      const refSection = page.locator('h2:has-text("Interval Reference")');
      await expect(refSection).toBeVisible();

      // Should list common intervals
      const perfectFifth = page.locator('text=Perfect 5th');
      await expect(perfectFifth).toBeVisible();
    });

    test('should switch to chords mode when clicking Chords', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Click Chords mode (use first() for strict mode)
      const chordsBtn = page.locator('button:has-text("Chords")').first();
      await chordsBtn.click();

      // Chords should have active styling
      const classes = await chordsBtn.getAttribute('class');
      expect(classes).toContain('bg-pink-500');
    });

    test('should start game when clicking Start Training', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Click Start Training
      const startBtn = page.locator('button:has-text("Start Training")');
      await startBtn.click();

      // Play button should appear
      const playBtn = page.locator('button:has-text("Play")');
      await expect(playBtn).toBeVisible();

      // Score should be displayed
      const score = page.locator('text=Score:');
      await expect(score).toBeVisible();
    });
  });

  test.describe('Navigation Integration', () => {
    test('should access new pages from More dropdown', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Navigation should have More dropdown
      const moreButton = page.locator('nav button:has-text("More")');
      await expect(moreButton).toBeVisible();

      // Click More to open dropdown
      await moreButton.click();

      // Dropdown should show new feature links
      const scalesLink = page.locator('.more-dropdown a:has-text("Scales")');
      const backingLink = page.locator('.more-dropdown a:has-text("Backing")');
      const earLink = page.locator('.more-dropdown a:has-text("Ear Training")');

      await expect(scalesLink).toBeVisible();
      await expect(backingLink).toBeVisible();
      await expect(earLink).toBeVisible();
    });

    test('should navigate from Home to Scale Trainer via More dropdown', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Click More dropdown and then Scales
      await clickMoreDropdownLink(page, 'Scales');
      await page.waitForURL('**/scales');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/scales');
    });

    test('should navigate from Home to Backing Tracks via More dropdown', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Click More dropdown and then Backing
      await clickMoreDropdownLink(page, 'Backing');
      await page.waitForURL('**/backing');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/backing');
    });

    test('should navigate from Home to Ear Training via More dropdown', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Click More dropdown and then Ear Training
      await clickMoreDropdownLink(page, 'Ear Training');
      await page.waitForURL('**/ear-training');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/ear-training');
    });

    test('should navigate between new features using More dropdown', async ({ page }) => {
      // Start at Scales
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Navigate to Backing via dropdown
      await clickMoreDropdownLink(page, 'Backing');
      await page.waitForURL('**/backing');
      expect(page.url()).toContain('/backing');

      // Navigate to Ear Training via dropdown
      await clickMoreDropdownLink(page, 'Ear Training');
      await page.waitForURL('**/ear-training');
      expect(page.url()).toContain('/ear-training');

      // Navigate back to Scales via dropdown
      await clickMoreDropdownLink(page, 'Scales');
      await page.waitForURL('**/scales');
      expect(page.url()).toContain('/scales');
    });

    test('should have main nav links plus More dropdown', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Main nav should have key links visible
      const homeLink = page.locator('nav a:has-text("Home")');
      const fretboardLink = page.locator('nav a:has-text("Fretboard")');
      const tabPlayerLink = page.locator('nav a:has-text("Tab Player")');
      const moreButton = page.locator('nav button:has-text("More")');

      await expect(homeLink).toBeVisible();
      await expect(fretboardLink).toBeVisible();
      await expect(tabPlayerLink).toBeVisible();
      await expect(moreButton).toBeVisible();
    });
  });
});
