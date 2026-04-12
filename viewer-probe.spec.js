import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

test.beforeAll(() => {
  execFileSync("uv", ["run", "python", "scripts/prepare_viewer_test_assets.py"], {
    cwd: repoRoot,
    stdio: "inherit",
  });
});

test("viewer testSeek probe sets sync marker", async ({ page }) => {
  await page.goto("/viewer/?testSeek=26");
  await expect(page.locator("body")).toHaveAttribute("data-probe-sync", /.+\|.+/);
});

test("viewer testRace probe keeps latest track selected", async ({ page }) => {
  await page.goto("/viewer/?testRace=1");
  await expect(page.locator(".track-button[aria-selected=\"true\"] .track-section")).not.toHaveText("");
  await expect(page.locator("#deckSubtitle")).not.toHaveText("");
  await expect(page.locator(".cue-button .cue-time").first()).not.toHaveText("");
});

test("viewer keeps LTX cues on a separate timeline lane", async ({ page }) => {
  await page.goto("/viewer/?testSeek=26");
  await expect(page.locator("body")).toHaveAttribute("data-probe-sync", /.+\|.+/);
  await expect(page.locator("#segmentList .segment-text").first()).not.toHaveText("");
  await expect(page.locator("#rawSrt")).toContainText("===== LTX =====");
  await expect(page.locator("#cueList .cue-part-badge--ltx")).toHaveCount(0);
});

test("viewer renders lyric and LTX lanes separately", async ({ page }) => {
  await page.goto("/viewer/");
  await expect(page.locator("#segmentCounter")).toContainText("segments");
  await expect(page.locator("#segmentList .segment-time").first()).toContainText("00:00.000");
  await expect(page.locator("#cueList .cue-button").first()).not.toHaveText("");
});

test("clip viewer loads generated WAV split decks on a separate page", async ({ page }) => {
  await page.goto("/viewer/clips/?testClipAudit=1");
  await expect(page.locator("body")).toHaveAttribute("data-probe-clip-audit", /.+\|9\|.+\.wav/);
  await expect(page.locator(".surface-link--active")).toContainText("WAV Clip Review");
  await expect(page.locator("#clipList .clip-button")).toHaveCount(9);
  await expect(page.locator("#currentClipTitle")).toContainText(".wav");
  await expect(page.locator("#clipSourceManifest")).toContainText("private-assets/ltx-segment-splits/");
});

test("clip viewer can filter melody clips", async ({ page }) => {
  await page.goto("/viewer/clips/");
  await page.locator("#filterPills .filter-pill[data-filter=\"melody\"]").click();
  await expect(page.locator(".filter-pill.active")).toHaveText("Melody");
  await expect(page.locator("#clipList .clip-button")).not.toHaveCount(0);
  await expect(page.locator("#clipList .clip-button[data-kind=\"lyric\"]")).toHaveCount(0);
});

test("clip viewer honors track query and keeps subtitle backlink", async ({ page }) => {
  await page.goto("/viewer/clips/?track=bridge-final-chorus&testClipAudit=1");
  await expect(page.locator("#deckTitle")).toContainText("Bridge - Final Chorus");
  await expect(page.locator("#subtitleViewLink")).toHaveAttribute("href", /\.\.\/\?track=bridge-final-chorus$/);
});
