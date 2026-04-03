---
name: midnight-memory
description: Manage intro/main/outro subtitle sectioning, gap extraction, and manifest sync for `midnight-memory`, and keep viewer timeline metadata aligned.
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
- Validate and fix subtitle workflow consistency via repo checks.

## Core Files

- `scripts/extract_subtitle_gap.py`
- `scripts/segment_ltx_audio.py`
- `scripts/validate_manifest.py`
- `assets/manifest.json`
- `assets/*.srt`
- `viewer/`
- `docs/intro-outro-subtitle-workflow.md`
- `docs/ltx-segment-workflow.md`

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

Use `./skills/midnight-memory-subtitle-sections/references/workflow.md` for full command-level workflow examples.

## Required Checks

```powershell
uv run python -m py_compile scripts/gemini_srt.py scripts/extract_subtitle_gap.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py tests/test_extract_subtitle_gap.py
npm run test:viewer
```

Only report completion when commands and manifest/metadata consistency are passing.

## Guardrails

- Do not change existing file formats unless needed for workflow correctness.
- Keep `subtitle` fallback compatibility alive when split files are introduced.
- Prefer conservative transcription choices for unstable model output.
- Avoid committing local secrets from `.env`.
