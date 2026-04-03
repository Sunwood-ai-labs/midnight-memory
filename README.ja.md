<div align="center">
  <img src="./favicon.svg" alt="midnight-memory icon" width="88" height="88">
  <h1>midnight-memory</h1>
  <p>WAV と歌詞候補から SRT を生成し、intro / main / outro の split subtitle と LTX セグメントをローカル viewer で確認するためのワークフローです。</p>
</div>

<p align="center">
  <a href="./README.md">English README</a>
</p>

<p align="center">
  ビジュアル参考元: <a href="https://tokyomidnight.tokiwavalley.com/">Tokyo Midnight</a>
</p>

<p align="center">
  <a href="https://github.com/Sunwood-ai-labs/midnight-memory/actions/workflows/ci.yml"><img src="https://github.com/Sunwood-ai-labs/midnight-memory/actions/workflows/ci.yml/badge.svg" alt="Repository CI"></a>
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white" alt="Python 3.11+">
  <img src="https://img.shields.io/badge/uv-managed-6C47FF?logo=astral&logoColor=white" alt="uv managed">
  <img src="https://img.shields.io/badge/local--first-viewer-111111" alt="local-first viewer">
</p>

## 🎯 概要

`midnight-memory` は、楽曲字幕のタイミング調整をローカルで進めるための実務向けリポジトリです。

- `scripts/gemini_srt.py` が WAV 音声と歌詞候補から歌詞SRTを生成します。
- `assets/manifest.json` の `subtitles` で `intro` / `main` / `outro` の split subtitle を管理できます。
- `scripts/segment_ltx_audio.py` が、曲全体をカバーする gapless な `*.ltx_segments.srt` を生成します。
- viewer では `Lyrics` と `LTX Segments` を別レーンで同期表示できます。

## 🚀 クイックスタート

### 前提

- Python 3.11 以上
- [uv](https://github.com/astral-sh/uv)
- `GEMINI_API_KEY` を含む `.env`

### セットアップ

```bash
cd D:\midnight-memory
uv sync
```

`.env.example` を `.env` にコピーして API キーを設定します。

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 歌詞SRTを生成する

```bash
uv run python scripts/gemini_srt.py `
  --audio "private-assets/Midnight Memory 夢のつづき  Intro - Chorus 1.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt"
```

歌詞候補にない短い可聴フレーズも残したい場合は `--allow-extra-text` を使います。

### LTX セグメントSRTを生成する

```bash
uv run python scripts/segment_ltx_audio.py assets --output-dir assets/ltx-segments
```

このコマンドは `assets/manifest.json` を読み、音声長を使って、メロディー区間を `[melody]` で補いながら曲単位の `*.ltx_segments.srt` を生成します。

### Viewer を起動する

```bash
cd D:\midnight-memory
uv run python -m http.server 8000
```

`http://localhost:8000/` または `http://localhost:8000/viewer/` を開いてください。

`timelineSubtitles` があるトラックでは、viewer は `Lyrics` と `LTX Segments` を別レーンで表示します。
デスクトップでは横並び、狭い画面では縦積みです。

![Viewer screenshot with separate lyric and LTX lanes](./assets/viewer-lyric-ltx-lanes.png)

## 🗂️ ドキュメント導線

- [docs/index.md](./docs/index.md): 英語 docs ハブ
- [docs/ja/index.md](./docs/ja/index.md): 日本語 docs ハブ
- [docs/intro-outro-subtitle-workflow.md](./docs/intro-outro-subtitle-workflow.md): 英語 split subtitle フロー
- [docs/ja/intro-outro-subtitle-workflow.md](./docs/ja/intro-outro-subtitle-workflow.md): 日本語 split subtitle フロー
- [docs/ltx-segment-workflow.md](./docs/ltx-segment-workflow.md): 英語 LTX セグメント運用
- [docs/ja/ltx-segment-workflow.md](./docs/ja/ltx-segment-workflow.md): 日本語 LTX セグメント運用

## 🖥️ Viewer 用 manifest

単一字幕ファイルなら `subtitle`:

```json
{
  "id": "track-id",
  "audio": "private-assets/Track Name.wav",
  "subtitle": "assets/Track Name.srt"
}
```

split subtitle なら `subtitles`:

```json
{
  "id": "track-id",
  "audio": "private-assets/Track Name.wav",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ]
}
```

LTX セグメントを別レーンに出すなら `timelineSubtitles`:

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

## ✅ 検証

Python 側の確認:

```bash
uv sync --group dev
uv run pytest
uv run python scripts/validate_manifest.py
```

viewer 側の確認:

```bash
npm install
npx playwright install chromium
uv run python scripts/create_stub_audio.py
npm run test:viewer
```

## 📁 構成

- `scripts/gemini_srt.py`: Gemini ベースの歌詞SRT生成 CLI
- `scripts/extract_subtitle_gap.py`: intro / outro gap 抽出ヘルパー
- `scripts/segment_ltx_audio.py`: LTX セグメントSRT生成
- `scripts/validate_manifest.py`: manifest 検証
- `viewer/`: ローカル viewer
- `docs/`: 英日ドキュメント
- `assets/*.srt`: 歌詞用字幕
- `assets/ltx-segments/*.ltx_segments.srt`: LTX セグメント字幕
- `assets/manifest.json`: viewer 用トラック定義
- `private-assets/`: ローカル専用の音声・歌詞入力

## 📝 今後 docs を増やすとき

- 英語ページは `docs/` に追加する
- 日本語ページは `docs/ja/` に追加する
- `docs/index.md` と `docs/ja/index.md` の両方にリンクを追加する
- 主要ワークフローなら README 側の導線も更新する
- コマンドやファイル名は英日でそろえる

## ⚠️ コンテンツ権利

このリポジトリはローカル運用を前提にしています。
追跡される字幕サンプルには、ソースコードとは別の権利がかかる歌詞断片を含む場合があるため、現時点では包括的な `LICENSE` を置いていません。
音声・歌詞・字幕の利用権は各自で確認してください。

## 🗒️ メモ

- API キー入りの `.env` はコミットしないでください
- 歌詞ファイルと字幕ファイルは UTF-8 を使ってください
- `private-assets/` は Git から除外されるローカル音源置き場です
