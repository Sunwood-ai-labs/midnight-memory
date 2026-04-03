# 前奏・後奏の抽出フロー

`midnight-memory` では、前奏や後奏に歌やアドリブが入っている場合、字幕本文にだけラベルを書くのではなく、`intro` / `main` / `outro` の分割字幕として扱います。

このフローの目的は次の 3 つです。

- viewer で前奏・後奏を metadata ベースで少し違う見た目にできるようにする
- 既存の `.srt` 利用先のために combined 版も残す
- その場の一時ワンライナーではなく、repo 内スクリプトで再現できるようにする

## 基本方針

1. 既存の combined `.srt` と音源長を比較する
2. 先頭側なら `intro`、末尾側なら `outro` の未カバー区間を決める
3. `scripts/extract_subtitle_gap.py` でその gap だけを切り出して Gemini に問い合わせる
4. `.intro.srt` または `.outro.srt` と `.main.srt` を整える
5. combined `.srt` を更新する
6. `assets/manifest.json` の `subtitles` 配列を更新する
7. validation と viewer テストを回す

## 再現用スクリプト

前奏・後奏の抽出に使う実体は [extract_subtitle_gap.py](D:/midnight-memory/scripts/extract_subtitle_gap.py) です。

このスクリプトは次を自動で行います。

- reference SRT から未カバーの `intro` / `outro` 区間を検出
- 対象区間だけ WAV を切り出し
- Gemini モデルに問い合わせ
- model ごとの relative / absolute cue を JSON レポート化
- 必要なら primary model の結果から SRT 候補を生成

## 使い方

### 前奏

```powershell
uv run python scripts/extract_subtitle_gap.py `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --reference-srt "assets/<track>.main.srt" `
  --part intro `
  --report-output "assets/<track>.intro.report.json" `
  --srt-output "assets/<track>.intro.srt"
```

### 後奏

```powershell
uv run python scripts/extract_subtitle_gap.py `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --reference-srt "assets/<track>.main.srt" `
  --part outro `
  --report-output "assets/<track>.outro.report.json" `
  --srt-output "assets/<track>.outro.srt"
```

### 複数モデル比較

```powershell
uv run python scripts/extract_subtitle_gap.py `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --reference-srt "assets/<track>.main.srt" `
  --part outro `
  --model "gemini-3-pro-preview" `
  --model "gemini-3.1-pro-preview" `
  --report-output "assets/<track>.outro.report.json" `
  --srt-output "assets/<track>.outro.srt"
```

## 出力

### `*.report.json`

- `gap_start_seconds`
- `gap_end_seconds`
- `clip_duration_seconds`
- model ごとの `relative_cues`
- model ごとの `absolute_cues`

### `*.srt`

- `--primary-model` で選んだモデルの absolute cue を SRT 化したもの
- split file の叩き台として使う

## テキスト決定ルール

- モデルが安定して同じ語を返す:
  - そのまま字幕にする
- 単語は割れるが音種は安定する:
  - `Ah` / `Ooh` のような ad-lib token に寄せる
- それでも不安定:
  - 中立ラベルを使うか、無理に入れない
- 純 instrumental:
  - 字幕にしない

## ファイル構成

### 前奏があるとき

- `Track Name.intro.srt`
- `Track Name.main.srt`
- `Track Name.srt`  … combined 版

### 後奏があるとき

- `Track Name.main.srt`
- `Track Name.outro.srt`
- `Track Name.srt`  … combined 版

combined 版は split file を時系列順に連結した内容に保ちます。

## manifest の持ち方

```json
{
  "subtitle": "assets/Track Name.srt",
  "subtitles": [
    { "id": "intro", "label": "前奏", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "本編", "path": "assets/Track Name.main.srt" }
  ]
}
```

または

```json
{
  "subtitle": "assets/Track Name.srt",
  "subtitles": [
    { "id": "main", "label": "本編", "path": "assets/Track Name.main.srt" },
    { "id": "outro", "label": "後奏", "path": "assets/Track Name.outro.srt" }
  ]
}
```

viewer の見分け方は字幕本文ではなく `subtitleId` / `subtitleLabel` ベースです。

## 実例

- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.intro.srt`
- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt`
- `assets/Midnight Memory 夢のつづき   Bridge - Final Chorus.main.srt`
- `assets/Midnight Memory 夢のつづき   Bridge - Final Chorus.outro.srt`

## 最後の確認

```powershell
uv run python -m py_compile scripts/gemini_srt.py scripts/extract_subtitle_gap.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py tests/test_extract_subtitle_gap.py
npm run test:viewer
```
