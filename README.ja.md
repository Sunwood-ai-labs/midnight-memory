<div align="center">
  <img src="./favicon.svg" alt="midnight-memory icon" width="88" height="88">
  <h1>midnight-memory</h1>
  <p>Gemini で歌詞同期 SRT を生成し、ローカルの音声 + 字幕ビューアで確認するための小さなワークフローです。</p>
</div>

<p align="center">
  <a href="./README.md">English README</a>
</p>

<p align="center">
  <a href="https://github.com/Sunwood-ai-labs/midnight-memory/actions/workflows/ci.yml"><img src="https://github.com/Sunwood-ai-labs/midnight-memory/actions/workflows/ci.yml/badge.svg" alt="Repository CI"></a>
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white" alt="Python 3.11+">
  <img src="https://img.shields.io/badge/uv-managed-6C47FF?logo=astral&logoColor=white" alt="uv managed">
  <img src="https://img.shields.io/badge/local--first-viewer-111111" alt="local-first viewer">
</p>

## 🌙 概要

`midnight-memory` は、歌詞タイミング作業をローカル中心で進めるための小さなリポジトリです。

- `scripts/gemini_srt.py` が WAV 音声と歌詞候補から `.srt` を生成します。
- `viewer/` と `assets/manifest.json` が、字幕タイミング・並び順・再生状態をブラウザで確認するためのビューアを提供します。
- `assets/manifest.json` は単一の `subtitle` だけでなく、複数ファイルをまとめる `subtitles` 配列にも対応しています。

## ✨ できること

- ローカルの `*.wav` 音声と歌詞候補テキストを入力に使える
- 実際に聞こえる歌詞だけを Gemini に拾わせて字幕化できる
- 歌詞候補にない短い導入フレーズなどを `--allow-extra-text` で残せる
- 現在行・次行・タイムライン・Raw SRT を静的ビューアで確認できる
- 音声入力は `private-assets/` に閉じたまま扱える

## 🚀 クイックスタート

### 前提

- Python 3.11 以上
- [uv](https://github.com/astral-sh/uv)
- `GEMINI_API_KEY` を入れた `.env`

### セットアップ

```bash
cd D:\midnight-memory
uv sync
```

`.env.example` を `.env` にコピーして、API キーを設定します。

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### SRT を生成する

```bash
uv run python scripts/gemini_srt.py `
  --audio "private-assets/Midnight Memory 夢のつづき  Intro - Chorus 1.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/Midnight Memory 夢のつづき  Intro - Chorus 1.srt"
```

歌詞候補にない短い可聴フレーズも残したい場合は `--allow-extra-text` を付けます。

```bash
uv run python scripts/gemini_srt.py `
  --audio "path/to/audio.wav" `
  --lyrics "path/to/lyrics.txt" `
  --output "assets/track.srt" `
  --allow-extra-text
```

### 前奏・後奏の抽出フロー

最初の main lyric cue より前、または最後の main lyric cue より後に vocal がある場合は、字幕本文だけで区別するのではなく、split subtitle として扱います。

- 必要に応じて `.intro.srt` / `.main.srt` / `.outro.srt` を作る
- 後方互換のため combined `.srt` も残す
- `assets/manifest.json` の `subtitles` 配列に split file を登録する
- `subtitle` には combined file を残す
- viewer 側は `intro` / `main` / `outro` の metadata を使って表示差分を出す

詳しい手順:

- [docs/intro-outro-subtitle-workflow.md](./docs/intro-outro-subtitle-workflow.md)
- [skills/midnight-memory-subtitle-sections/SKILL.md](./skills/midnight-memory-subtitle-sections/SKILL.md)

## 🎛️ ビューア

ルートの `index.html` は `viewer/` へ自動リダイレクトします。

```bash
cd D:\midnight-memory
uv run python -m http.server 8000
```

`http://localhost:8000/` または `http://localhost:8000/viewer/` を開くと確認できます。
音声本体はローカルの `private-assets/` にある前提です。

### Manifest 形式

字幕 1 本なら `subtitle` を使います。

```json
{
  "id": "intro-chorus-1",
  "title": "Midnight Memory 夢のつづき",
  "section": "Intro - Chorus 1",
  "audio": "private-assets/....wav",
  "subtitle": "assets/....srt"
}
```

前奏と本編のように複数字幕をまとめるなら `subtitles` を使います。

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

## ✅ 検証

Python 側のチェックは次で実行できます。

```bash
uv sync --group dev
uv run pytest
uv run python scripts/validate_manifest.py
```

ビューアのプローブテストは次です。

```bash
npm install
npx playwright install chromium
uv run python scripts/create_stub_audio.py
npm run test:viewer
```

`scripts/create_stub_audio.py` は `private-assets/` に足りない WAV だけを無音で補うので、実音声がないローカルや CI でも安全にスモークチェックできます。

## 📁 構成

- `scripts/gemini_srt.py`: Gemini を使う字幕生成 CLI
- `scripts/validate_manifest.py`: manifest 構造の検証
- `scripts/create_stub_audio.py`: ビューア検証用の無音 WAV 生成
- `skills/midnight-memory-subtitle-sections/`: 前奏・後奏の split subtitle 運用をまとめた repo 内 skill
- `viewer/`: 静的レビュー UI
- `docs/intro-outro-subtitle-workflow.md`: 前奏・後奏の抽出フロー詳細
- `assets/*.srt`: 生成済み字幕やサンプル字幕
- `assets/manifest.json`: ビューア用トラック一覧
- `private-assets/`: Git 管理外のローカル音声と歌詞候補

## ⚖️ 権利について

このリポジトリはローカル中心の運用を前提にしています。
追跡済みの字幕サンプルには、ソースコードや自動化スクリプトとは別の権利が関わる歌詞断片が含まれる可能性があるため、現時点ではリポジトリ全体に一括で適用する `LICENSE` は置いていません。
音声・歌詞・字幕コンテンツの再配布可否は、利用者自身の権利確認を前提に扱ってください。

## 📝 注意

- API キー入りの `.env` はコミットしない
- 文字化け防止のため歌詞と字幕は UTF-8 で扱う
- `private-assets/` は Git から除外され、ローカル音声の配置先として使う
