---
layout: home
hero:
  name: "midnight-memory"
  text: "ドキュメント"
  tagline: "split subtitle、LTX セグメント、viewer の確認フローをまとめた docs ハブです。"
  actions:
    - theme: brand
      text: "前奏 / 後奏フロー"
      link: "/ja/intro-outro-subtitle-workflow"
    - theme: alt
      text: "LTX セグメント運用"
      link: "/ja/ltx-segment-workflow"
    - theme: alt
      text: "English Docs"
      link: "/"
features:
  - title: "Split Subtitle 管理"
    details: "intro / main / outro を分けて管理し、manifest で1つの歌詞タイムラインとして扱います。"
  - title: "LTX セグメント生成"
    details: "曲全体をカバーする gapless な *.ltx_segments.srt を生成し、[melody] 区間も明示できます。"
  - title: "viewer 別レーン表示"
    details: "Lyrics と LTX Segments を別レーンで同期表示し、粗い確認用タイムラインが歌詞表示を邪魔しません。"
---

## 運用ルール

- 英語版と日本語版のページ構成はできるだけそろえる
- 主要ワークフローに関わるページは `README.md` と `README.ja.md` からも辿れるようにする
- コマンド例は repo の実パスと `uv run ...` に合わせる
- viewer の実例は `assets/manifest.json` を基準に更新する
- アイコンやヘッダーなどのビジュアルは [Tokyo Midnight](https://tokyomidnight.tokiwavalley.com/) の配色と雰囲気を参考にする

## 現在のガイド

- [Intro / Outro Subtitle Workflow（英語）](../intro-outro-subtitle-workflow.md)
- [前奏 / 後奏 split subtitle フロー（日本語）](./intro-outro-subtitle-workflow.md)
- [LTX Segment Workflow（英語）](../ltx-segment-workflow.md)
- [LTX セグメント運用（日本語）](./ltx-segment-workflow.md)
