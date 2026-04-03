# 前奏 / 後奏 split subtitle ワークフロー

このリポジトリでは、main lyric cue の前後に未カバーの vocal がある場合、1つの字幕に押し込まず `intro` / `main` / `outro` の split subtitle として管理します。

## 分割ファイル

- 先頭側の未カバー vocal は `Track Name.intro.srt`
- 本編の歌詞は `Track Name.main.srt`
- 末尾側の未カバー vocal は `Track Name.outro.srt`
- split file は時系列順に並ぶように保ちます

## manifest の持ち方

歌詞字幕は `subtitles` に登録します。

```json
{
  "id": "intro-chorus-1",
  "audio": "private-assets/Track Name.wav",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ]
}
```

LTX セグメントも一緒に見たい場合は `timelineSubtitles` に追加します。

```json
{
  "id": "intro-chorus-1",
  "audio": "private-assets/Track Name.wav",
  "subtitles": [
    { "id": "intro", "label": "Intro", "path": "assets/Track Name.intro.srt" },
    { "id": "main", "label": "Main", "path": "assets/Track Name.main.srt" }
  ],
  "timelineSubtitles": [
    { "id": "ltx", "label": "LTX", "path": "assets/ltx-segments/Track Name.ltx_segments.srt" }
  ]
}
```

## viewer 上の見え方

- `Lyrics` レーンに split subtitle が表示されます
- `LTX Segments` レーンに LTX 用の粗いセグメントが表示されます
- 2 つのレーンは同じ再生位置に同期します
- デスクトップでは横並び、狭い画面では縦積みです
- `Current` / `Next` は歌詞レーン基準です

## 抽出ヘルパー

```powershell
uv run python scripts/extract_subtitle_gap.py `
  --audio "private-assets/<track>.wav" `
  --lyrics "private-assets/09 (1).txt" `
  --reference-srt "assets/<track>.main.srt" `
  --part intro `
  --report-output "assets/<track>.intro.report.json" `
  --srt-output "assets/<track>.intro.srt"
```

後奏側を作るときは `--part intro` を `--part outro` に変更してください。

## 検証

```powershell
uv run python scripts/validate_manifest.py
uv run pytest
npm run test:viewer
```
