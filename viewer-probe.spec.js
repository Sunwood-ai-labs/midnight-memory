import { test, expect } from '@playwright/test';

test('viewer testSeek probe sets sync marker', async ({ page }) => {
  await page.goto('/viewer/?testSeek=26');
  await expect(page.locator('body')).toHaveAttribute('data-probe-sync', /.+\|.+/);
});

test('viewer testRace probe keeps latest track selected', async ({ page }) => {
  await page.goto('/viewer/?testRace=1');
  await expect(page.locator('.track-button[aria-selected="true"] .track-section')).not.toHaveText('');
  await expect(page.locator('#deckSubtitle')).not.toHaveText('');
  await expect(page.locator('.cue-button .cue-time').first()).not.toHaveText('');
});
