# midnight-memory

`midnight-memory` は、音声ファイルと歌詞候補を使って Gemini 2.5 Pro で字幕タイムラインを自動生成し、`.srt` を出力する小さなユーティリティです。

- `scripts/gemini_srt.py`: WAV 音声と歌詞テキストから SRT を生成する CLI
- `viewer/` + `assets/manifest.json`: 生成済みの音声/SRT をブラウザで確認する静的ビューア

## 何ができるか

- WAV 音声（`*.wav`）と歌詞ファイル（`*.txt`）を入力として読み込む
- Google Gemini に対して、音声中で実際に歌われた行だけを検出して開始・終了秒を推定させる
- 入力の歌詞順番（行番号）に従ってタイムコード化し、`.srt` を生成する
- 生成結果を `output` パスに保存する

主な実装は `scripts/gemini_srt.py` にあります。

## 要件

- Python 3.11 以上
- [`uv`](https://github.com/astral-sh/uv) が利用可能
- `GEMINI_API_KEY` を含む `.env` ファイル

## 事前準備

```bash
cd D:\midnight-memory
uv venv
uv pip install "google-genai"
```

`.env` を作成し、以下を保存します。

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

公開用には `.env.example` を置いてあるので、必要ならそれをコピーして `.env` を作成してください。

## 使い方（uv）

```bash
uv run python scripts/gemini_srt.py `
  --audio "private-assets/Midnight Memory 夢のつづき  Intro - Chorus 1.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/Midnight Memory 夢のつづき  Intro - Chorus 1.srt"
```

`--audio`, `--lyrics`, `--output` は実ファイルに合わせて変更してください。

## 静的ビューア

`viewer/` はローカルの静的ファイルとして開ける字幕確認ビューアです。ルートの `index.html` は `viewer/` へのランチャーです。簡易サーバーを立てる場合は次のように実行できます。

```bash
cd D:\midnight-memory
uv run python -m http.server 8000
```

その後、ブラウザで `http://localhost:8000/` または `http://localhost:8000/viewer/` を開くと、`assets/manifest.json` に登録された音声と SRT を確認できます。音声本体は `private-assets/` に置く前提です。

## `assets` の構成

- `private-assets/*.wav`: ローカル専用の音声ファイル（Git 追跡対象外）
- `assets/*.srt`: 生成済み字幕（またはサンプルの字幕）
- `private-assets/09 (1).txt`: ローカル専用の歌詞候補（Git 追跡対象外）
- `assets/manifest.json`: 静的ビューアが参照するトラック一覧

## 注意

- `GEMINI_API_KEY` が入った `.env` は公開リポジトリに含めないでください
- `.env` は `.gitignore` で除外されています
- `private-assets/` も `.gitignore` で除外されており、公開リポジトリには含めません
- 文字化けを避けるため、歌詞テキストは UTF-8 保存を推奨します
