---
layout: home
hero:
  name: midnight-memory
  text: Subtitle Workflow Docs
  tagline: Split lyric subtitles, generate gapless LTX segments, and review them in synchronized viewer lanes.
  image:
    src: /favicon.svg
    alt: midnight-memory icon
  actions:
    - theme: brand
      text: Intro / Outro Workflow
      link: /intro-outro-subtitle-workflow
    - theme: alt
      text: LTX Segment Workflow
      link: /ltx-segment-workflow
    - theme: alt
      text: 日本語 Docs
      link: /ja/
features:
  - title: Split Subtitle Workflow
    details: Manage `intro`, `main`, and `outro` as separate lyric subtitle files and merge them through the manifest.
  - title: LTX Segment Timeline
    details: Generate full-track, gapless `*.ltx_segments.srt` files with `[melody]` coverage for downstream LTX preparation.
  - title: Separate Viewer Lanes
    details: Review lyric cues and LTX segment cues in separate synchronized lanes without cluttering the lyric timeline.
---

## Documentation Growth Rules

- Keep English and Japanese pages paired when the topic is user-facing.
- Link new pages from both `README.md` and `README.ja.md` when they are part of the main workflow.
- Keep command examples aligned with the actual repo paths and `uv run ...` conventions.
- Treat `assets/manifest.json` as the source of truth for viewer-facing examples.
- For icons and header images, reference the palette and mood of [Tokyo Midnight](https://tokyomidnight.tokiwavalley.com/).

## Current Guides

- [Intro / Outro Subtitle Workflow](./intro-outro-subtitle-workflow.md)
- [LTX Segment Workflow](./ltx-segment-workflow.md)
- [Japanese Documentation Hub](./ja/index.md)
