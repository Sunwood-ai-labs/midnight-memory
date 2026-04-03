# Intro / Outro Subtitle Workflow

This repository uses split subtitle files when a track has uncovered vocals before the first main lyric cue or after the last main lyric cue.
Instead of forcing everything into one file, keep the lyric body and the uncovered sections as separate SRT assets.

## Split Files

- Use `Track Name.intro.srt` for uncovered leading vocals.
- Use `Track Name.main.srt` for the main lyric body.
- Use `Track Name.outro.srt` for uncovered trailing vocals.
- Keep the split files in chronological order so the manifest can merge them into one lyric timeline.

## Manifest Shape

Register the lyric parts under `subtitles`:

```json
{
  "id": "intro-chorus-1",
  "audio": "private-assets/Track Name.wav",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ]
}
```

If you also want to review LTX segment timing, register the generated segment SRT under `timelineSubtitles`:

```json
{
  "id": "intro-chorus-1",
  "audio": "private-assets/Track Name.wav",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ],
  "timelineSubtitles": [
    { "id": "ltx", "label": "LTX", "path": "assets/ltx-segments/Track Name.ltx_segments.srt" }
  ]
}
```

## Viewer Behavior

- The `Lyrics` lane shows the main subtitle timeline built from `subtitles`.
- The `LTX Segments` lane shows the coarser segment timeline built from `timelineSubtitles`.
- Both lanes stay synchronized to the same audio playback position.
- On desktop the two lanes are shown side by side.
- On narrower screens the lanes stack vertically.
- The current/next line panel is driven by the lyric lane, not by the LTX lane.

## Extraction Helper

Use the intro/outro extraction helper to generate split subtitle files:

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

## LTX Segment Helper

Generate per-track, gapless LTX segment SRT files with melody coverage:

```powershell
uv run python scripts/segment_ltx_audio.py assets --output-dir assets/ltx-segments
```

The generated `*.ltx_segments.srt` files are intended for the viewer's LTX lane and for downstream LTX lip-sync preparation.

## Validation

```powershell
uv run python scripts/validate_manifest.py
uv run pytest
npm run test:viewer
```
