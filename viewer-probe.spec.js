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

test('viewer includes LTX cues on the existing timeline', async ({ page }) => {
  await page.goto('/viewer/?testSeek=26');
  await expect(page.locator('body')).toHaveAttribute('data-probe-sync', /.+\|.+/);
  await expect(page.locator('.cue-part-badge--ltx').first()).toHaveText('LTX');
  await expect(page.locator('#rawSrt')).toContainText('===== LTX =====');
});

test('viewer renders ltx cues on the existing timeline', async ({ page }) => {
  await page.goto('/viewer/');
  await expect(page.locator('.cue-part-badge--ltx').first()).toHaveText('LTX');
  await expect(page.locator('.cue-button--ltx .cue-time').first()).toContainText('00:00.000');
});
