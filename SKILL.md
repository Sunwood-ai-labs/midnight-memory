---
name: midnight-memory
description: Manage intro/main/outro subtitle sectioning, gap extraction, manifest sync, and Remotion lyric motion outputs for `midnight-memory`, while keeping viewer timeline metadata aligned.
---

# Midnight Memory Repository Instructions

Use this file as the primary entry point for agent tasks in this repository.

Read `./README.md` first when you need the broader repo overview, setup, or validation context.
Use `uv` for all Python commands in this repository.

## Scope

- Generate lyric-aligned SRT files with `scripts/gemini_srt.py` when a track still needs base subtitle timing.
- Split lyric SRT tracks into `intro` / `main` / `outro` parts without breaking combined fallbacks.
- Extract gap regions before first cue or after last cue using `scripts/extract_subtitle_gap.py`.
- Generate gapless LTX timelines with `scripts/segment_ltx_audio.py` when downstream segment review is needed.
- Keep `assets/manifest.json` `subtitles` / `timelineSubtitles` in sync with generated subtitle files.
- Render lyric motion videos from `assets/Midnight Memory_TopV.mp4` and synchronized split subtitle parts using `remotion-app/`.
- Validate and fix subtitle workflow consistency via repo checks.

## Core Files

- `scripts/extract_subtitle_gap.py`
- `scripts/segment_ltx_audio.py`
- `scripts/validate_manifest.py`
- `assets/manifest.json`
- `assets/*.srt`
- `remotion-app/`
- `remotion-app/scripts/prepare-assets.mjs`
- `remotion-app/src/compositions/MidnightMemoryTopView.jsx`
- `viewer/`
- `docs/intro-outro-subtitle-workflow.md`
- `docs/ltx-segment-workflow.md`
- `docs/remotion-lyric-motion-workflow.md`

## Quick Workflow

1. Inspect source and combined subtitle timings against WAV duration.
2. For uncovered leading/trailing vocal regions, run `uv run python scripts/extract_subtitle_gap.py`.
3. Keep combined `.srt` and split parts synchronized:
   - keep `assets/Track Name.srt` as fallback merged file
   - create/update `assets/Track Name.intro.srt` and/or `assets/Track Name.outro.srt`
   - keep `assets/Track Name.main.srt` as lyric section
4. Update `assets/manifest.json`:
   - keep `subtitle` set to merged file when needed
   - add `subtitles` entries with `id`/`label` (`intro`, `main`, `outro`)
   - maintain existing timeline entries when `timelineSubtitles` are used
5. Run validation and manifest checks before handoff.
6. For lyric motion tasks, run `cd remotion-app`, prepare assets, then preview or render the Remotion composition.

## Intro/Outro Split Workflow

Use this flow when you need to separate uncovered vocals before the first main lyric cue or after the last main lyric cue.

### File Naming Rules

- Intro split:
  - `Track Name.intro.srt`
  - `Track Name.main.srt`
  - `Track Name.srt` as the combined fallback
- Outro split:
  - `Track Name.main.srt`
  - `Track Name.outro.srt`
  - `Track Name.srt` as the combined fallback

Keep the combined file as the ordered concatenation of the split files.

### Detection Flow

1. Inspect the existing combined `.srt`.
2. Compare:
   - first cue start time vs `00:00:00`
   - last cue end time vs WAV duration
3. Treat uncovered leading vocals as `intro`.
4. Treat uncovered trailing vocals as `outro`.

### Extraction Flow

Probe the region with the dedicated helper so trim, prompt, and report format stay reproducible:

```powershell
uv run python scripts/extract_subtitle_gap.py `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --reference-srt "assets/<track>.main.srt" `
  --part intro `
  --report-output "assets/<track>.intro.report.json" `
  --srt-output "assets/<track>.intro.srt"
```

For outro extraction, change `--part intro` to `--part outro`.
Repeat `--model` to compare multiple Gemini models on the same uncovered region.

Decide text conservatively:

- If models agree on stable words, keep the words.
- If models disagree but the sound class is stable, prefer a simple ad-lib token such as `Ah` or `Ooh`.
- If even the ad-lib class is unstable, use a neutral placeholder only as a last resort.
- Leave instrumental spans uncovered.

Write split files as follows:

- Put only the uncovered leading cues in `.intro.srt`.
- Put only the uncovered trailing cues in `.outro.srt`.
- Keep the lyric body in `.main.srt`.
- Rebuild the combined `.srt` so cue order remains continuous.

### Manifest Rules

Keep backward compatibility with the combined fallback:

```json
{
  "subtitle": "assets/Track Name.srt",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ]
}
```

or:

```json
{
  "subtitle": "assets/Track Name.srt",
  "subtitles": [
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" },
    { "id": "outro", "label": "Outro", "path": "assets/Track Name.outro.srt" }
  ]
}
```

Viewer styling depends on `subtitleId` and `subtitleLabel`, not the rendered cue text.

## Required Checks

```powershell
uv run python -m py_compile scripts/gemini_srt.py scripts/extract_subtitle_gap.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py tests/test_extract_subtitle_gap.py
npm run test:viewer
```

Only report completion when commands and manifest/metadata consistency are passing.

## Additional Checks For Lyric Motion Work

When you modify `remotion-app/`, also run:

```powershell
cd remotion-app
npm run prepare:assets
```

Run `npm run render` as well when composition logic, subtitle wiring, or credit content changes.

## Guardrails

- Do not change existing file formats unless needed for workflow correctness.
- Keep `subtitle` fallback compatibility alive when split files are introduced.
- Prefer conservative transcription choices for unstable model output.
- Keep the TopView lyric motion credits aligned with the source repo credit and `TopView / SeeDance 2.0`.
- Treat `remotion-app/out/` as generated output and do not commit renders unless explicitly requested.
- Avoid committing local secrets from `.env`.
