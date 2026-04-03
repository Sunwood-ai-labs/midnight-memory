<div align="center">
  <img src="./favicon.svg" alt="midnight-memory icon" width="88" height="88">
  <h1>midnight-memory</h1>
  <p>Generate lyric-aligned SRT subtitles with Gemini and review them in a local audio + subtitle viewer.</p>
</div>

<p align="center">
  <a href="./README.ja.md">日本語 README</a>
</p>

<p align="center">
  <a href="https://github.com/Sunwood-ai-labs/midnight-memory/actions/workflows/ci.yml"><img src="https://github.com/Sunwood-ai-labs/midnight-memory/actions/workflows/ci.yml/badge.svg" alt="Repository CI"></a>
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white" alt="Python 3.11+">
  <img src="https://img.shields.io/badge/uv-managed-6C47FF?logo=astral&logoColor=white" alt="uv managed">
  <img src="https://img.shields.io/badge/local--first-viewer-111111" alt="local-first viewer">
</p>

## 🌙 Overview

`midnight-memory` is a small local-first workflow for lyric timing work.

- `scripts/gemini_srt.py` turns a WAV file plus lyric candidates into an `.srt` subtitle file with Gemini.
- `viewer/` and `assets/manifest.json` provide a browser-based review surface for subtitle timing, cue order, and playback state.
- `assets/manifest.json` can point to either one subtitle file or multiple subtitle files that are merged into one timeline in the viewer.

## ✨ Features

- Accepts local `*.wav` audio and lyric candidate text files.
- Keeps subtitle generation aligned to the lyric lines that are actually audible.
- Supports `--allow-extra-text` for short spoken or sung fragments that are not in the lyric source.
- Reviews generated output in a responsive static viewer with transport controls, current/next cue state, and raw SRT inspection.
- Preserves private audio inputs under `private-assets/`, which stays ignored by Git.

## 🚀 Quick Start

### Requirements

- Python 3.11+
- [uv](https://github.com/astral-sh/uv)
- `.env` containing `GEMINI_API_KEY`

### Setup

```bash
cd D:\midnight-memory
uv sync
```

Copy `.env.example` to `.env`, then set your API key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Generate SRT

```bash
uv run python scripts/gemini_srt.py `
  --audio "private-assets/Midnight Memory 夢のつづき  Intro - Chorus 1.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/Midnight Memory 夢のつづき  Intro - Chorus 1.srt"
```

Use `--allow-extra-text` when you want short audible fragments preserved even if they are not present in the lyric candidates:

```bash
uv run python scripts/gemini_srt.py `
  --audio "path/to/audio.wav" `
  --lyrics "path/to/lyrics.txt" `
  --output "assets/track.srt" `
  --allow-extra-text
```

## 🎛️ Viewer

The repo root `index.html` redirects to the local viewer in `viewer/`.

```bash
cd D:\midnight-memory
uv run python -m http.server 8000
```

Open `http://localhost:8000/` or `http://localhost:8000/viewer/`.
The viewer expects audio files to exist locally under `private-assets/`.

### Manifest Format

Use `subtitle` for a single SRT file:

```json
{
  "id": "intro-chorus-1",
  "title": "Midnight Memory 夢のつづき",
  "section": "Intro - Chorus 1",
  "audio": "private-assets/....wav",
  "subtitle": "assets/....srt"
}
```

Use `subtitles` when one track should combine multiple SRT files such as an intro fragment plus the main lyric body:

```json
{
  "id": "split-track",
  "title": "Midnight Memory 夢のつづき",
  "section": "Intro - Chorus 1",
  "audio": "private-assets/....wav",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/....intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/....main.srt" }
  ]
}
```

## ✅ Validation

Run the Python checks:

```bash
uv sync --group dev
uv run pytest
uv run python scripts/validate_manifest.py
```

Run the viewer probe tests:

```bash
npm install
npx playwright install chromium
uv run python scripts/create_stub_audio.py
npm run test:viewer
```

`scripts/create_stub_audio.py` only creates missing WAV files under `private-assets/`, so it is safe to use for local or CI-only smoke checks when the real audio is unavailable.

## 📁 Project Layout

- `scripts/gemini_srt.py`: Gemini-backed subtitle generation CLI.
- `scripts/validate_manifest.py`: manifest structure validation for local QA and CI.
- `scripts/create_stub_audio.py`: creates silent test fixtures for viewer smoke tests.
- `viewer/`: static review UI.
- `assets/*.srt`: generated subtitles and sample subtitle outputs.
- `assets/manifest.json`: track registry for the viewer.
- `private-assets/`: local-only audio and lyric sources that stay out of Git.

## ⚖️ Content Rights

This repository intentionally stays local-first.
Tracked subtitle samples may contain lyric excerpts that are subject to separate rights from the source code and automation scripts, so the repo does not declare a blanket open-source `LICENSE` file yet.
Treat audio, lyric, and subtitle content as your own responsibility unless you have redistribution rights.

## 📝 Notes

- Never commit `.env` with API keys.
- Keep lyric text and subtitle files in UTF-8 to avoid mojibake.
- `private-assets/` is ignored by Git and expected to contain your local audio sources.
