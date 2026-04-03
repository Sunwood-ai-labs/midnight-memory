# 前奏・後奏の抽出フロー

`midnight-memory` では、前奏や後奏に歌やアドリブが入っている場合でも、単に本文にラベルを埋め込むのではなく、`intro` / `main` / `outro` の分割字幕として扱います。

このフローの目的は次の 3 つです。

- viewer で前奏・後奏を少し違う見た目で表示できるようにする
- 既存の `.srt` 利用先のために combined 版も残す
- 文字起こしが不安定なアドリブを、無理に歌詞として断定しない

## 基本方針

1. まず現在の combined `.srt` を見る
2. 最初の cue より前、または最後の cue より後に未カバー区間があるか確認する
3. その未カバー区間だけを Gemini で追加確認する
4. `intro` または `outro` の split file を作る
5. `main` と combined `.srt` を更新する
6. `assets/manifest.json` に `subtitles` 配列を追加する
7. viewer と validation を回す

## どこを前奏・後奏とみなすか

- 前奏:
  - `00:00:00` から最初の main lyric cue までの未カバー vocal
- 後奏:
  - 最後の main lyric cue の終了時刻から音源終端までの未カバー vocal

完全に instrumental な区間は字幕にしません。

## 抽出の進め方

### 1. 既存 SRT と音源長を確認する

- 先頭の cue start
- 最後の cue end
- WAV の総再生時間

この差分で、先頭側なら前奏、末尾側なら後奏の候補区間を決めます。

### 2. 広めのプローブを取る

まずは repo の生成スクリプトで広めに見ます。

```powershell
uv run python scripts/gemini_srt.py `
  --allow-extra-text `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --output "assets/_probe.srt"
```

### 3. 必要なら Gemini 3 でトリミング再確認する

前奏・後奏の短い vocal は、モデルごとに語句がぶれやすいです。そういうときは対象区間だけトリミングして Gemini 3 系で再確認します。

判断基準は次です。

- モデルが安定して同じ語を返す:
  - そのまま字幕にする
- 単語は割れるが音種は安定する:
  - `Ah` / `Ooh` のような ad-lib token に寄せる
- それでも不安定:
  - 中立ラベルを検討する

## ファイル構成

### 前奏があるとき

- `Track Name.intro.srt`
- `Track Name.main.srt`
- `Track Name.srt`  … combined 版

### 後奏があるとき

- `Track Name.main.srt`
- `Track Name.outro.srt`
- `Track Name.srt`  … combined 版

combined 版は、split したファイルを時系列順に連結した内容に保ちます。

## manifest の持ち方

`subtitle` は combined 版を残しつつ、viewer 用に `subtitles` 配列を追加します。

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

viewer の見分け方は、字幕本文ではなく `subtitleId` / `subtitleLabel` ベースです。

## この repo の実例

前奏 split:

- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.intro.srt`
- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt`

後奏 split:

- `assets/Midnight Memory 夢のつづき   Bridge - Final Chorus.main.srt`
- `assets/Midnight Memory 夢のつづき   Bridge - Final Chorus.outro.srt`

## 最後の確認コマンド

```powershell
uv run python -m py_compile scripts/gemini_srt.py
uv run python scripts/validate_manifest.py
uv run pytest tests/test_gemini_srt.py
npm run test:viewer
```

この 4 つが通れば、少なくとも repo の生成・manifest・viewer の整合は維持できています。
