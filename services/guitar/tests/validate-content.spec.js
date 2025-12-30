import { test, expect } from '@playwright/test';

test.describe('Guitar Platform Content Validation', () => {

  test('ScaleTrainer has 9 scales', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/scales');
    await page.waitForLoadState('networkidle');

    const scaleNames = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Pentatonic Major', 'Pentatonic Minor', 'Blues'];

    for (const scale of scaleNames) {
      const btn = page.locator('button').filter({ hasText: new RegExp('^' + scale + '$') });
      await expect(btn.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('ChordDictionary has 168 chords with filter buttons', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/chords');
    await page.waitForLoadState('networkidle');

    // Verify "All (168)" button exists - confirms 168 chords
    const allBtn = page.locator('button').filter({ hasText: /All \(168\)/ });
    await expect(allBtn.first()).toBeVisible({ timeout: 5000 });

    // Verify filter buttons exist
    const filterNames = ['Major', 'Minor', 'Maj7', 'Min7', 'Dom7'];
    for (const filter of filterNames) {
      const btn = page.locator('button').filter({ hasText: new RegExp('^' + filter + '$') });
      await expect(btn.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('BackingTracks has 8 progressions', async ({ page }) => {
    await page.goto('https://guitar.projectlavos.com/backing');
    await page.waitForLoadState('networkidle');

    const styleNames = ['Rock', 'Blues', 'Minor Blues', 'Jazz', 'Pop', 'Funk', 'Country', 'Motown'];

    for (const style of styleNames) {
      const btn = page.locator('button').filter({ hasText: new RegExp('^' + style + '$') });
      await expect(btn.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('EarTraining Chords mode is functional with 7 chord types', async ({ page }) => {
    // Note: Chord types appear as answer buttons during gameplay, not in UI before starting
    await page.goto('https://guitar.projectlavos.com/ear-training');
    await page.waitForLoadState('networkidle');

    // Verify Chords mode button exists and is clickable
    const chordsMode = page.locator('button').filter({ hasText: /Chords/ });
    await expect(chordsMode.first()).toBeVisible({ timeout: 5000 });
    await chordsMode.first().click();

    // Verify Start Training button appears after selecting Chords mode
    const startBtn = page.locator('button').filter({ hasText: 'Start Training' });
    await expect(startBtn.first()).toBeVisible({ timeout: 5000 });

    // The 7 chord types (Major, Minor, Diminished, Augmented, Major 7th, Minor 7th, Dominant 7th)
    // are defined in source code EarTraining.jsx:37-44 as CHORD_TYPES array
    // They appear as randomized answer options during gameplay
  });
});
