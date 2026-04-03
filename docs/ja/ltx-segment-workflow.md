# LTX セグメント ワークフロー

`scripts/segment_ltx_audio.py` は、LTX lip-sync 準備と viewer 上の確認用に、曲単位の `*.ltx_segments.srt` を生成します。

## 生成されるもの

このスクリプトが作る SRT は:

- `00:00:00,000` から音声末尾までをカバーします
- セグメント境界が gapless です
- 7〜15秒付近の長さを目安に分割します
- 歌詞がない区間は `[melody]` を入れます

## 基本コマンド

```powershell
uv run python scripts/segment_ltx_audio.py assets --output-dir assets/ltx-segments
```

単体ファイルだけ生成する場合:

```powershell
uv run python scripts/segment_ltx_audio.py "assets/Track Name.main.srt" --output-dir assets/ltx-segments
```

## 出力の使い方

- 1曲につき 1つの `*.ltx_segments.srt` を生成します
- part ごとの出力ではなく曲単位です
- viewer の `LTX Segments` レーンに表示できます
- downstream の LTX lip-sync 準備に使えます

## manifest 登録

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

## viewer 上の挙動

- `Lyrics` レーンは歌詞字幕を表示します
- `LTX Segments` レーンは粗いセグメントを表示します
- どちらをクリックしても共有オーディオが同じ位置にシークします
- `Current` / `Next` は歌詞レーンを基準に動きます

## 検証

```powershell
uv run python scripts/validate_manifest.py
uv run pytest
npm run test:viewer
```
