# Remotion lyric motion フロー

TopView の元動画と、この repo にある同期済み字幕から lyric motion 動画を出したいときは、このフローを使います。

## remotion-app がやること

`remotion-app/` は、TopView 用の lyric motion 出力をまとめた Remotion プロジェクトです。

現在は次を行います。

- `assets/Midnight Memory_TopV.mp4` を Remotion の `public/` へ同期する
- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.intro.srt` を読む
- `assets/Midnight Memory 夢のつづき  Intro - Chorus 1.main.srt` を読む
- 2 つの字幕パートを結合した caption metadata を生成する
- タイトルカード付きの lyric motion 本編をレンダリングする
- アウトロに `midnight-memory` と `TopView / SeeDance 2.0` のクレジットを入れる

## コマンド

まず Remotion 側の依存を入れます。

```powershell
cd D:\midnight-memory\remotion-app
npm install
```

Remotion Studio で確認する:

```powershell
npm run preview
```

現在の出力をレンダリングする:

```powershell
npm run render
```

## 出力物

現在のレンダリング先:

- `remotion-app/out/midnight-memory-topview-lyric-motion.mp4`

asset 準備時に生成される metadata:

- `remotion-app/src/generated/captions.jsx`
- `remotion-app/src/generated/video-metadata.jsx`

## 前提

- 元動画は `assets/Midnight Memory_TopV.mp4` を使う
- 歌詞タイミング元は `Intro - Chorus 1` の split subtitle を使う
- `remotion-app/out/` 以下の動画は生成物なので、明示依頼がない限り git に含めない

## 検証

```powershell
cd D:\midnight-memory\remotion-app
npm run prepare:assets
npm run render
```
