# LTX Segment Workflow

Use this workflow when you need gapless, per-track segment SRT files for LTX lip-sync preparation.

## What The Script Does

`scripts/segment_ltx_audio.py` reads track definitions from `assets/manifest.json` and produces `*.ltx_segments.srt` files.

For each track it:

- merges split subtitle sources such as `intro`, `main`, and `outro`
- uses the WAV duration from `audio`
- fills uncovered regions with `[melody]`
- segments the full track into gapless windows
- writes one per-track SRT file under `assets/ltx-segments/`

## Command

```powershell
uv run python scripts/segment_ltx_audio.py assets --output-dir assets/ltx-segments
```

## Output Shape

Example output:

- `assets/ltx-segments/Track Name.ltx_segments.srt`

The SRT is intended for two uses:

- as an LTX preparation artifact
- as the `timelineSubtitles` companion lane in the viewer

## Manifest Wiring

Register the generated file like this:

```json
{
  "id": "track-id",
  "audio": "private-assets/Track Name.wav",
  "subtitles": [
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ],
  "timelineSubtitles": [
    { "id": "ltx", "label": "LTX", "path": "assets/ltx-segments/Track Name.ltx_segments.srt" }
  ]
}
```

## Viewer Behavior

- `Lyrics` and `LTX Segments` are shown in separate synchronized lanes
- desktop layout is side by side
- narrow layout stacks the lanes
- `Current / Next` stays tied to the lyric lane

## Validation

```powershell
uv run python scripts/validate_manifest.py
uv run pytest
npm run test:viewer
```
