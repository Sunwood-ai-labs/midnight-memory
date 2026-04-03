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

test('viewer keeps LTX cues on a separate timeline lane', async ({ page }) => {
  await page.goto('/viewer/?testSeek=26');
  await expect(page.locator('body')).toHaveAttribute('data-probe-sync', /.+\|.+/);
  await expect(page.locator('#segmentList .segment-text').first()).not.toHaveText('');
  await expect(page.locator('#rawSrt')).toContainText('===== LTX =====');
  await expect(page.locator('#cueList .cue-part-badge--ltx')).toHaveCount(0);
});

test('viewer renders lyric and LTX lanes separately', async ({ page }) => {
  await page.goto('/viewer/');
  await expect(page.locator('#segmentCounter')).toContainText('segments');
  await expect(page.locator('#segmentList .segment-time').first()).toContainText('00:00.000');
  await expect(page.locator('#cueList .cue-button').first()).not.toHaveText('');
});
