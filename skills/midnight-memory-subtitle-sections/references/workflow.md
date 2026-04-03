# Midnight Memory Intro/Outro Subtitle Workflow

## Use This Workflow For

- vocals before the first main lyric cue
- vocals after the last main lyric cue
- ad-lib tails that should render differently in the viewer timeline
- keeping combined `.srt` files while also exposing split parts in `assets/manifest.json`

## File Naming Rules

- Intro split:
  - `Track Name.intro.srt`
  - `Track Name.main.srt`
  - `Track Name.srt` as the combined fallback
- Outro split:
  - `Track Name.main.srt`
  - `Track Name.outro.srt`
  - `Track Name.srt` as the combined fallback

Keep the combined file as the ordered concatenation of the split files.

## Detection Flow

1. Inspect the existing combined `.srt`.
2. Compare:
   - first cue start time vs `00:00:00`
   - last cue end time vs WAV duration
3. Treat uncovered leading vocals as `intro`.
4. Treat uncovered trailing vocals as `outro`.

## Extraction Flow

### 1. Probe The Region

Use the dedicated gap extraction helper so the trim, prompt, and report format stay reproducible:

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

### 2. Decide Text Conservatively

- If models agree on stable words, keep the words.
- If models disagree but the sound class is stable, prefer a simple ad-lib token such as `Ah` or `Ooh`.
- If even the ad-lib class is unstable, use a neutral placeholder only as a last resort.
- Leave instrumental spans uncovered.

### 3. Write Split Files

- Put only the uncovered leading cues in `.intro.srt`.
- Put only the uncovered trailing cues in `.outro.srt`.
- Keep the lyric body in `.main.srt`.
- Rebuild the combined `.srt` so cue order remains continuous.

## Manifest Rules

Keep backward compatibility:

```json
{
  "subtitle": "assets/Track Name.srt",
  "subtitles": [
    { "id": "intro", "label": "前奏", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "本編", "path": "assets/Track Name.main.srt" }
  ]
}
```

or

```json
{
  "subtitle": "assets/Track Name.srt",
  "subtitles": [
    { "id": "main", "label": "本編", "path": "assets/Track Name.main.srt" },
    { "id": "outro", "label": "後奏", "path": "assets/Track Name.outro.srt" }
  ]
}
```

Viewer styling depends on `subtitleId` and `subtitleLabel`, not the rendered cue text.

## Current Repo Examples

- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.intro.srt`
- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt`
- `assets/Midnight Memory 夢のつづき   Bridge - Final Chorus.main.srt`
- `assets/Midnight Memory 夢のつづき   Bridge - Final Chorus.outro.srt`

## Validation Checklist

Run all of these after editing:

```powershell
uv run python -m py_compile scripts/gemini_srt.py scripts/extract_subtitle_gap.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py tests/test_extract_subtitle_gap.py
npm run test:viewer
```

Confirm:

- split files concatenate back to the combined file
- `assets/manifest.json` paths exist
- viewer still loads both single-file and split-file tracks
- intro/outro cues keep their metadata labels for timeline styling
