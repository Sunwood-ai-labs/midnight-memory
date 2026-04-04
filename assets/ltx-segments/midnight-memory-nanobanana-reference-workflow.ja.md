# Midnight Memory Nanobanana Reference Workflow

`nanobanana pro` で今回の MV カットを作るときは、[momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) の狐娘を主役固定の絶対基準にして、まずロケーション固定マスター画像を作り、そのマスター画像を最終ショットの参照に使います。

## Core Goal

- 主役は常に [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) の狐娘
- `画像1 + 画像2 + 画像3` からロケーション固定マスター画像を作る
- 最終ショットは `画像1 + ロケーション固定マスター` を主参照にして、カメラ位置や寄り引きだけを変える
- カットは `動画生成のスタートフレーム` 用として使う
- 表情はフラット寄り、口は閉じ気味か少しだけ開く程度に留める
- 口元は見える状態を保ち、後段のリップシンクに繋げやすくする

## Save Location

- 参照画像の保存先は `assets/ltx-segments/reference-images/` 配下です。
- 主役基準: `character/`
- 環境参照: `environment/`
- スタイル参照: `style/`
- ロケーション固定マスター画像: `location-masters/`
- 最終ショット: `shots/`

## Execution Owner

- 実行責任者は `nanobanana pro` の運用担当者です。
- 参照画像またはロケーション固定マスターを更新した人が、manifest とログも同時に更新します。

## Runbook Files

- [reference-pack.manifest.json](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-pack.manifest.json)
- [reference-parameter-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-parameter-log.template.csv)
- [segment-render-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/segment-render-log.template.csv)

## Reference Stack Design

- `画像1 = character`
  - 主役の同一性を固定する
- `画像2 = environment`
  - 場所の形、奥行き、機材配置、夜景の位置を固定する
- `画像3 = style-master`
  - 全体のスタイル、タッチ、空気感、色温度を固定する

この 3 枚から、まず `location-masters/` にロケーション固定マスター画像を作ります。  
その後の最終ショットでは、通常は `画像1 = character`、`画像2 = location master` の 2 枚参照で十分です。必要なときだけ `style-master` を 3 枚目に足します。

## Parameter Log

参照画像やロケーション固定マスターごとに、次を記録してください。

- `model`
- `preset` または `quality mode`
- `seed`
- `steps`
- `cfg` または `guidance`
- `denoise`
- `aspect ratio`
- `notes`
- `sha256`

## Mandatory Existing Reference

### 0. Protagonist Base

- `filename`: `character/momiji-studio_0014.png`
- `role`: `character`
- `purpose`: 狐娘シンガーの絶対基準
- `must_keep`: 狐耳、長い琥珀色の髪、金色の瞳、ふわっとした尾、和柄寄りの衣装、黒金のヘッドホン
- `validation`: 今後の全ショットが、この画像の同一人物に見えること

## Fixed Reference Images To Prepare

### 1. Environment Vocal Booth

- `filename`: `environment/midnight-memory-ref-env-vocal-booth-night-v01.png`
- `purpose`: 夜景の見えるボーカルブース固定
- `prompt_ja`: `東京の夜景が大きく見える録音スタジオ、コンデンサーマイク、少し横に避けたポップガード、吸音材、ミキサーのボケ、人物なし、city-pop MV向け、文字なし、ウォーターマークなし`
- `validation`: 主役を前景に置いても口元を塞がない構図になっていること

### 2. Environment Rooftop Stage

- `filename`: `environment/midnight-memory-ref-env-rooftop-stage-v01.png`
- `purpose`: 夜風のある屋上ステージ固定
- `prompt_ja`: `東京の夜景が広がる屋上ステージ、濡れた床、控えめなパフォーマンス空間、人物なし、MV向け、文字なし、ウォーターマークなし`
- `validation`: 主役を大きく前景に置ける余白があること

### 3. Environment River Bridge Stage

- `filename`: `environment/midnight-memory-ref-env-river-bridge-stage-v01.png`
- `purpose`: 川沿いブリッジステージ固定
- `prompt_ja`: `東京の川沿いのブリッジステージ、濡れた床、欄干、遠くの光跡、水面反射、人物なし、切ない city-pop MV 向け、文字なし、ウォーターマークなし`
- `validation`: 顔アップでも上半身でも自然に乗ること

### 4. Environment Glass City Space

- `filename`: `environment/midnight-memory-ref-env-glass-city-v01.png`
- `purpose`: ガラス越し都会空間の固定
- `prompt_ja`: `夜の都会のガラス空間、ネオンの滲み、白色灯、都会の反射、人物なし、上品なハレーション、MV向け、文字なし、ウォーターマークなし`
- `validation`: 主役の顔と口元が埋もれない程度に反射が整理されていること

### 5. Style Master Look

- `filename`: `style/midnight-memory-ref-style-master-v01.png`
- `purpose`: 全ショット共通のスタイル、タッチ、空気感、色温度、粒子の固定
- `prompt_ja`: `1980年代東京 city-pop MV ルック、深紺、コバルトブルー、温かいアンバー、少量のローズ、繊細な映画粒子、湿度を帯びた夜の空気、人物なし、文字なし、ウォーターマークなし`
- `validation`: どの場所に重ねても同じ作品の見た目に見えること

## Location Master Stage

ここが今回の要点です。  
各ロケーションについて、`画像1 = 主役`、`画像2 = 環境`、`画像3 = style-master` から「ロケーション固定マスター画像」を先に作ります。

### 1. Vocal Booth Master

- `filename`: `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `refs`: `character/momiji-studio_0014.png`, `environment/midnight-memory-ref-env-vocal-booth-night-v01.png`, `style/midnight-memory-ref-style-master-v01.png`
- `purpose`: スタジオ系ショットの母体

### 2. Rooftop Master

- `filename`: `location-masters/midnight-memory-master-rooftop-v01.png`
- `refs`: `character/momiji-studio_0014.png`, `environment/midnight-memory-ref-env-rooftop-stage-v01.png`, `style/midnight-memory-ref-style-master-v01.png`
- `purpose`: 屋上ショットの母体

### 3. River Bridge Master

- `filename`: `location-masters/midnight-memory-master-river-bridge-v01.png`
- `refs`: `character/momiji-studio_0014.png`, `environment/midnight-memory-ref-env-river-bridge-stage-v01.png`, `style/midnight-memory-ref-style-master-v01.png`
- `purpose`: ブリッジ系ショットの母体

### 4. Glass City Master

- `filename`: `location-masters/midnight-memory-master-glass-city-v01.png`
- `refs`: `character/momiji-studio_0014.png`, `environment/midnight-memory-ref-env-glass-city-v01.png`, `style/midnight-memory-ref-style-master-v01.png`
- `purpose`: ガラス越し都会ショットの母体

## Start Frame Rules

- このワークフローで作るカットは、歌唱画像ではなく動画生成前の静止フレーム
- 表情はフラット寄り
- 口は閉じ気味か少しだけ開く程度
- 唇と顎のラインは見える
- マイク、髪、手で口元を隠さない
- 正面または 3/4 角度を優先

## Final Shot Stage

- 最終ショットは、通常 `画像1 = 主役固定`、`画像2 = ロケーション固定マスター画像` の2枚参照で作る
- 一貫性が弱いときだけ `画像3 = style-master` を追加する
- カメラ位置、寄り引き、目線、構図差分は最終ショット側で変える
- つまり、ロケーションの世界観は master に閉じ込めて、ショット側ではカメラ調整だけに寄せる

## Segment Attachment Matrix

### Intro - Chorus 1

- `intro-01`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `intro-02`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `intro-03`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `intro-04`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `intro-05`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-rooftop-v01.png`
- `intro-06`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-glass-city-v01.png`
- `intro-07`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `intro-08`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `intro-09`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`

### Bridge - Final Chorus

- `bridge-01`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `bridge-02`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-river-bridge-v01.png`
- `bridge-03`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-river-bridge-v01.png`
- `bridge-04`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-glass-city-v01.png`
- `bridge-05`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-glass-city-v01.png`
- `bridge-06`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`
- `bridge-07`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-river-bridge-v01.png`
- `bridge-08`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-river-bridge-v01.png`
- `bridge-09`: `character/momiji-studio_0014.png`, `location-masters/midnight-memory-master-vocal-booth-v01.png`

## Prompt Assembly Template

```text
reference_images:
- 画像1: character/momiji-studio_0014.png
- 画像2: location-masters/midnight-memory-master-vocal-booth-v01.png

shot_goal:
- 狐娘キャラは画像1と同一人物に固定
- ロケーションの一貫性は画像2に従う
- 表情はフラット寄り
- 口元が見える
- 動画生成のスタートフレームとして使いやすい

prompt:
<midnight-memory-nanobanana-prompts.ja.md のショット本文を貼る>
```

## Preflight Checklist

- [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) と同一人物に見える
- ロケーション固定マスター画像と整合している
- 口元が見える
- 表情がフラット寄り
- 動画生成のスタートフレームとして静止感がある
