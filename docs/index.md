# Documentation Hub

This folder is the long-form documentation surface for `midnight-memory`.

## Current Guides

- [Intro / Outro Subtitle Workflow](./intro-outro-subtitle-workflow.md)
- [LTX Segment Workflow](./ltx-segment-workflow.md)
- [Japanese Documentation Hub](./ja/index.md)

## Writing Rules

- Keep English and Japanese pages paired when the topic is user-facing.
- Link new pages from both `README.md` and `README.ja.md` when they are part of the main workflow.
- Keep command examples aligned with the actual repo paths and `uv run ...` conventions.
- Treat `assets/manifest.json` as the source of truth for viewer-facing examples.

## Recommended Growth Path

When the repo gains more features, add pages in this order:

1. workflow-level guides
2. viewer behavior / QA notes
3. troubleshooting
4. release or operations notes

Keep filenames stable and obvious so future links do not churn.
