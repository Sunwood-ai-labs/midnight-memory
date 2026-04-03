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

Useful one-off checks:

```powershell
uv run python -m py_compile scripts/gemini_srt.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py
npm run test:viewer
```

## Extraction Flow

### 1. Probe The Region

Use the repo generator first when you want a broad pass:

```powershell
uv run python scripts/gemini_srt.py `
  --allow-extra-text `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/_probe.srt"
```

Then trim the exact uncovered region and verify it with Gemini 3 models if the wording is uncertain.

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
uv run python -m py_compile scripts/gemini_srt.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py
npm run test:viewer
```

Confirm:

- split files concatenate back to the combined file
- `assets/manifest.json` paths exist
- viewer still loads both single-file and split-file tracks
- intro/outro cues keep their metadata labels for timeline styling
