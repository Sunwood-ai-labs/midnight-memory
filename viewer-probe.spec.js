import { test, expect } from '@playwright/test';

test('viewer testSeek probe sets sync marker', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/viewer/?testSeek=26');
  await page.waitForTimeout(900);
  const probe = await page.locator('body').getAttribute('data-probe-sync');
  expect(probe, 'probeSync marker should be set').toBeTruthy();
  expect(probe?.includes('|')).toBeTruthy();
});

test('viewer testRace probe keeps latest track selected', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/viewer/?testRace=1');
  await page.waitForTimeout(900);
  const track = await page.locator('.track-button[aria-selected="true"] .track-section').innerText();
  const subtitle = await page.locator('#deckSubtitle').innerText();
  const cue = await page.locator('.cue-button .cue-time').first().innerText();
  expect(track).toBeTruthy();
  expect(subtitle).toBeTruthy();
  expect(cue).toBeTruthy();
});
