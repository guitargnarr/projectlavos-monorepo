const { test, expect } = require('@playwright/test');

test.describe('Guitar Platform New Features Tests', () => {
  const baseUrl = 'https://guitar.projectlavos.com';

  test.describe('Backing Tracks (/backing)', () => {
    test('should load backing tracks page successfully', async ({ page }) => {
      const response = await page.goto(`${baseUrl}/backing`);
      expect(response.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Header should be visible
      const header = page.locator('h1:has-text("Backing Tracks")');
      await expect(header).toBeVisible();
    });

    test('should highlight Backing nav link with orange color', async ({ page }) => {
      await page.goto(`${baseUrl}/backing`);
      await page.waitForLoadState('networkidle');

      const backingLink = page.locator('nav a:has-text("Backing")');
      await expect(backingLink).toBeVisible();

      const classes = await backingLink.getAttribute('class');
      expect(classes).toContain('bg-orange-500');
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

    test('should highlight Scales nav link with teal color', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      const scalesLink = page.locator('nav a:has-text("Scales")');
      await expect(scalesLink).toBeVisible();

      const classes = await scalesLink.getAttribute('class');
      expect(classes).toContain('bg-teal-500');
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

      // Fretboard should show scale notes
      const fretboard = page.locator('.bg-gray-800').filter({ hasText: /Scale$/ });
      await expect(fretboard).toBeVisible();

      // Should show fret numbers (0-12)
      const fretZero = page.locator('text=0');
      await expect(fretZero.first()).toBeVisible();
    });

    test('should have Start Listening button', async ({ page }) => {
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      const listenBtn = page.locator('button:has-text("Start Listening")');
      await expect(listenBtn).toBeVisible();
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

    test('should highlight Ear nav link with pink color', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      const earLink = page.locator('nav a:has-text("Ear")');
      await expect(earLink).toBeVisible();

      const classes = await earLink.getAttribute('class');
      expect(classes).toContain('bg-pink-500');
    });

    test('should display game mode selection', async ({ page }) => {
      await page.goto(`${baseUrl}/ear-training`);
      await page.waitForLoadState('networkidle');

      // Game mode buttons
      const intervalsBtn = page.locator('button:has-text("Intervals")');
      const chordsBtn = page.locator('button:has-text("Chords")');

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

      // Click Chords mode
      const chordsBtn = page.locator('button:has-text("Chords")');
      await chordsBtn.click();

      // Chords should have active styling
      const classes = await chordsBtn.getAttribute('class');
      expect(classes).toContain('bg-pink-500');

      // Difficulty selection should be hidden for chords mode
      const difficultySection = page.locator('text=Difficulty');
      await expect(difficultySection).not.toBeVisible();
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
    test('should navigate to all new pages from Home', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Check Scale Trainer card exists
      const scalesCard = page.locator('a[href="/scales"]');
      await expect(scalesCard).toBeVisible();

      // Check Backing Tracks card exists
      const backingCard = page.locator('a[href="/backing"]');
      await expect(backingCard).toBeVisible();

      // Check Ear Training card exists
      const earCard = page.locator('a[href="/ear-training"]');
      await expect(earCard).toBeVisible();
    });

    test('should navigate from Scales card on Home to Scale Trainer', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Click Scale Trainer card
      await page.click('a[href="/scales"]');
      await page.waitForURL('**/scales');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/scales');
    });

    test('should navigate from Backing card on Home to Backing Tracks', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Click Backing Tracks card
      await page.click('a[href="/backing"]');
      await page.waitForURL('**/backing');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/backing');
    });

    test('should navigate from Ear card on Home to Ear Training', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Click Ear Training card
      await page.click('a[href="/ear-training"]');
      await page.waitForURL('**/ear-training');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/ear-training');
    });

    test('should navigate between new features using navbar', async ({ page }) => {
      // Start at Scales
      await page.goto(`${baseUrl}/scales`);
      await page.waitForLoadState('networkidle');

      // Navigate to Backing via navbar
      await page.click('nav a:has-text("Backing")');
      await page.waitForURL('**/backing');
      expect(page.url()).toContain('/backing');

      // Navigate to Ear Training via navbar
      await page.click('nav a:has-text("Ear")');
      await page.waitForURL('**/ear-training');
      expect(page.url()).toContain('/ear-training');

      // Navigate back to Scales via navbar
      await page.click('nav a:has-text("Scales")');
      await page.waitForURL('**/scales');
      expect(page.url()).toContain('/scales');
    });

    test('should show all 10 nav links', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.waitForLoadState('networkidle');

      // Count nav links (excluding logo)
      const navLinks = page.locator('nav a:not(:has-text("Guitar Platform"))');
      const count = await navLinks.count();
      expect(count).toBe(10); // Home, FretVision, Tab Player, Chords, Tuner, Metronome, Catalog, Scales, Backing, Ear
    });
  });
});
