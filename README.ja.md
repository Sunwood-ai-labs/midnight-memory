<div align="center">
  <img src="./favicon.svg" alt="midnight-memory icon" width="88" height="88">
  <h1>midnight-memory</h1>
  <p>WAV と歌詞候補から SRT を生成し、intro / main / outro の分割字幕と LTX セグメントをローカル viewer で確認するためのワークフローです。</p>
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

## 🧭 概要

`midnight-memory` は、楽曲の字幕タイミングをローカルで整えるためのリポジトリです。

- `scripts/gemini_srt.py` で WAV と歌詞候補から歌詞寄りの SRT を生成します。
- `assets/manifest.json` の `subtitles` で `intro` / `main` / `outro` を分割管理できます。
- `scripts/segment_ltx_audio.py` で melody 区間も含む `*.ltx_segments.srt` を生成できます。
- viewer では `Lyrics` と `LTX Segments` を別レーンで同期表示するため、歌詞タイムラインを汚さずに LTX 用セグメントも確認できます。

## ⚡ クイックスタート

### 必要なもの

- Python 3.11 以上
- [uv](https://github.com/astral-sh/uv)
- `GEMINI_API_KEY` を書いた `.env`

### セットアップ

```bash
cd D:\midnight-memory
uv sync
```

`.env.example` を `.env` にコピーし、API キーを設定します。

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 歌詞 SRT を生成する

```bash
uv run python scripts/gemini_srt.py `
  --audio "private-assets/Midnight Memory 夢のつづき  Intro - Chorus 1.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt"
```

歌詞候補にない短い発話やアドリブも残したい場合は `--allow-extra-text` を付けます。

### LTX セグメント SRT を生成する

```bash
uv run python scripts/segment_ltx_audio.py assets --output-dir assets/ltx-segments
```

このコマンドは `assets/manifest.json` を読み、音声長を参照しながら `[melody]` 区間も含めた track 単位の `*.ltx_segments.srt` を作ります。

### Viewer を起動する

```bash
cd D:\midnight-memory
uv run python -m http.server 8000
```

`http://localhost:8000/` または `http://localhost:8000/viewer/` を開きます。

`timelineSubtitles` があるトラックでは、viewer は `Lyrics` と `LTX Segments` を別レーンで表示します。
デスクトップでは横並び、狭い画面では縦積みに切り替わります。

![Viewer screenshot with separate lyric and LTX lanes](./assets/viewer-lyric-ltx-lanes.png)

## 🗂 ドキュメント案内

- [docs/index.md](./docs/index.md): 英語の docs ハブ
- [docs/ja/index.md](./docs/ja/index.md): 日本語の docs ハブ
- [docs/intro-outro-subtitle-workflow.md](./docs/intro-outro-subtitle-workflow.md): 英語の split subtitle フロー
- [docs/ja/intro-outro-subtitle-workflow.md](./docs/ja/intro-outro-subtitle-workflow.md): 日本語の split subtitle フロー
- [docs/ltx-segment-workflow.md](./docs/ltx-segment-workflow.md): 英語の LTX セグメント運用
- [docs/ja/ltx-segment-workflow.md](./docs/ja/ltx-segment-workflow.md): 日本語の LTX セグメント運用

## 🎛 Viewer の manifest 形式

単一 SRT なら `subtitle` を使います。

```json
{
  "id": "track-id",
  "audio": "private-assets/Track Name.wav",
  "subtitle": "assets/Track Name.srt"
}
```

分割字幕なら `subtitles` を使います。

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

LTX セグメントを別レーンに出したい場合は `timelineSubtitles` を使います。

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

Python 側:

```bash
uv sync --group dev
uv run pytest
uv run python scripts/validate_manifest.py
```

viewer 側:

```bash
npm install
npx playwright install chromium
uv run python scripts/create_stub_audio.py
npm run test:viewer
```

## 📦 構成

- `scripts/gemini_srt.py`: Gemini ベースの SRT 生成 CLI
- `scripts/extract_subtitle_gap.py`: intro / outro gap 抽出ヘルパー
- `scripts/segment_ltx_audio.py`: LTX 用セグメント SRT 生成
- `scripts/validate_manifest.py`: manifest 検証
- `viewer/`: ローカル viewer
- `docs/`: ワークフローと viewer 仕様の文書
- `assets/*.srt`: 歌詞字幕の入力 / サンプル
- `assets/ltx-segments/*.ltx_segments.srt`: LTX 用セグメント出力
- `assets/manifest.json`: viewer 用トラック定義
- `private-assets/`: Git 管理外の音声と歌詞候補

## 📚 今後の追記ルール

今後 docs を増やすときは次を揃えてください。

- 英語ページを `docs/` に追加する
- 日本語ページを `docs/` または `docs/ja/` に追加する
- `docs/index.md` と `docs/ja/index.md` の両方にリンクを追加する
- README の主要導線に関わるページなら README 側にもリンクを追加する
- コマンド例とファイル名は英日でずれないように保つ

## ⚖️ 権利について

このリポジトリはローカル利用を前提にしています。
音声・歌詞・字幕サンプルにはソースコードとは別の権利が関わる可能性があるため、リポジトリ全体へ一律に適用する `LICENSE` は置いていません。
音声・歌詞・字幕の再配布可否は利用者側で確認してください。

## 📝 メモ

- API キー入りの `.env` はコミットしない
- 歌詞 / 字幕ファイルは UTF-8 を使う
- `private-assets/` は Git 管理外で、ローカルの音源置き場として使う
