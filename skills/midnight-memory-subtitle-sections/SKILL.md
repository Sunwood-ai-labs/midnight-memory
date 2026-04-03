---
name: midnight-memory-subtitle-sections
description: Split `midnight-memory` track subtitles into `intro`, `main`, and `outro` parts, reproduce uncovered vocal extraction with `scripts/extract_subtitle_gap.py`, keep combined `.srt` files and `assets/manifest.json` synchronized, and preserve metadata for viewer-specific timeline treatment. Use when Codex needs to extract 前奏 or 後奏 cues, create `.intro.srt` / `.main.srt` / `.outro.srt` files, update `subtitles` arrays, or maintain this repo's segmented subtitle workflow.
---

# Midnight Memory Subtitle Sections

## Overview

Use this skill when a track in this repository has uncovered vocals before the first lyric cue or after the last lyric cue and you want to split that region into a dedicated subtitle part without breaking the merged viewer timeline.

Read [references/workflow.md](./references/workflow.md) when you need the exact command sequence, file naming rules, and validation checklist.

## Workflow

1. Compare the audio duration with the first and last cues in the current combined `.srt`.
2. Identify whether the uncovered region should become `intro` or `outro`.
3. Probe the uncovered clip with `uv run python scripts/extract_subtitle_gap.py`.
4. Keep wording conservative:
   - use stable lyrics when models converge
   - use stable ad-lib tokens such as `Ah` or `Ooh` when only the sound class converges
   - avoid inventing full lyrical sentences when the wording is unstable
5. Create or refresh:
   - the split file for the uncovered region
   - the matching `.main.srt`
   - the combined `.srt`
6. Update `assets/manifest.json`:
   - keep `subtitle` pointing at the combined file
   - add a `subtitles` array with `id` and `label`
7. Preserve viewer metadata semantics:
   - use `id: "intro"` with label `前奏`
   - use `id: "main"` with label `本編`
   - use `id: "outro"` with label `後奏`
8. Validate with the repo checks from the reference file.

## Guardrails

- Use metadata such as `subtitleId` and `subtitleLabel` for viewer behavior. Do not encode section meaning only in cue text.
- Keep the combined `.srt` in sync with the split parts so fallback consumers still work.
- Prefer repo-local examples and naming patterns already present in `assets/manifest.json`.
- Do not invent lyrics for purely instrumental spans.
- Store the extraction report JSON so the model evidence remains reproducible.
