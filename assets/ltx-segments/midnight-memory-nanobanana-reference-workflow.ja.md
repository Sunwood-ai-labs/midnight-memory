# Midnight Memory Nanobanana Reference Workflow

`nanobanana pro` で今回の MV カットを作るときは、[momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘を主役固定の絶対基準にして、先に環境参照とスタイル参照を揃えてから各セグメントへ入力します。

## Core Goal

- 主役は常に [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘
- カットは `動画生成のスタートフレーム` 用として使う
- 表情はフラット寄り、口は閉じ気味か少しだけ開く程度に留める
- 口元は見える状態を保ち、後段のリップシンクに繋げやすくする
- 環境と色味の一貫性は環境参照とスタイル参照で固定する

## Save Location

- 参照画像は `assets/ltx-segments/reference-images/` に保存します。
- 命名規則は `midnight-memory-ref-<subject>-<variant>-v01.png` を使います。
- 再生成したら `v02`, `v03` と版を増やします。

## Execution Owner

- 実行責任者は `nanobanana pro` の運用担当者です。
- 参照画像を追加・更新した人が、manifest とログも同時に更新します。

## Runbook Files

- [reference-pack.manifest.json](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-pack.manifest.json)
- [reference-parameter-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-parameter-log.template.csv)
- [segment-render-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/segment-render-log.template.csv)

## Reference Stack Design

- `character ref`
  - `画像1` に固定する主役ベース画像
- `environment refs`
  - スタジオ、屋上、川沿いブリッジ、ガラス空間を固定する層
- `style refs`
  - 色温度、ネオンの滲み、湿度感、映画粒子を固定する層

通常運用では `画像1 = 主役固定`、`画像2 = 環境`、`画像3 = スタイル` の 3 枚で十分です。  
顔アップや上半身の差分参照は、必要になったときだけ追加で作るオプション扱いにします。

## Parameter Log

参照画像ごとに、次を必ず記録してください。

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

- `filename`: `momiji-studio_0014.png`
- `role`: `character`
- `purpose`: 狐娘シンガーの絶対基準
- `must_keep`: 狐耳、長い琥珀色の髪、金色の瞳、ふわっとした尾、和柄寄りの衣装、黒金のヘッドホン
- `validation`: 今後の全ショットが、この画像の同一人物に見えること

## Fixed Reference Images To Prepare

### 1. Environment Vocal Booth

- `filename`: `midnight-memory-ref-env-vocal-booth-night-v01.png`
- `purpose`: 夜景の見えるボーカルブース固定
- `prompt_ja`: `東京の夜景が大きく見える録音スタジオ、コンデンサーマイク、少し横に避けたポップガード、吸音材、ミキサーのボケ、人物なし、city-pop MV向け、文字なし、ウォーターマークなし`
- `validation`: 主役を前景に置いても口元を塞がない構図になっていること

### 2. Environment Rooftop Stage

- `filename`: `midnight-memory-ref-env-rooftop-stage-v01.png`
- `purpose`: 夜風のある屋上ステージ固定
- `prompt_ja`: `東京の夜景が広がる屋上ステージ、濡れた床、控えめなパフォーマンス空間、人物なし、MV向け、文字なし、ウォーターマークなし`
- `validation`: 主役を大きく前景に置ける余白があること

### 3. Environment River Bridge Stage

- `filename`: `midnight-memory-ref-env-river-bridge-stage-v01.png`
- `purpose`: 川沿いブリッジステージ固定
- `prompt_ja`: `東京の川沿いのブリッジステージ、濡れた床、欄干、遠くの光跡、水面反射、人物なし、切ない city-pop MV 向け、文字なし、ウォーターマークなし`
- `validation`: 顔アップでも上半身でも自然に乗ること

### 4. Environment Glass City Space

- `filename`: `midnight-memory-ref-env-glass-city-v01.png`
- `purpose`: ガラス越し都会空間の固定
- `prompt_ja`: `夜の都会のガラス空間、ネオンの滲み、白色灯、都会の反射、人物なし、上品なハレーション、MV向け、文字なし、ウォーターマークなし`
- `validation`: 主役の顔と口元が埋もれない程度に反射が整理されていること

### 5. Style Master Look

- `filename`: `midnight-memory-ref-style-master-v01.png`
- `purpose`: 全ショット共通の色温度、粒子、city-pop 感の固定
- `prompt_ja`: `1980年代東京 city-pop MV ルック、深紺、コバルトブルー、温かいアンバー、少量のローズ、繊細な映画粒子、湿度を帯びた夜の空気、人物なし、文字なし、ウォーターマークなし`
- `validation`: どの場所に重ねても同じ作品の色味に見えること

### 6. Style Wet Reflection

- `filename`: `midnight-memory-ref-style-wet-reflection-v01.png`
- `purpose`: 濡れた床と光の反射の質感固定
- `prompt_ja`: `雨上がりの舗道やステージ床に細長く反射するネオン、上品な湿度感、人物なし、文字なし、ウォーターマークなし`
- `validation`: 屋外カットに流用できること

### 7. Style Studio Glow

- `filename`: `midnight-memory-ref-style-studio-glow-v01.png`
- `purpose`: スタジオ内の暖色グロウと夜景ブルーの共存を固定
- `prompt_ja`: `録音スタジオの暖かい室内光と窓外の青い夜景が共存するルック、人物なし、上質なMV照明、文字なし、ウォーターマークなし`
- `validation`: スタジオ系カット全般に馴染むこと

## Start Frame Rules

- このワークフローで作るカットは、歌唱画像ではなく動画生成前の静止フレーム
- 表情はフラット寄り
- 口は閉じ気味か少しだけ開く程度
- 唇と顎のラインは見える
- マイク、髪、手で口元を隠さない
- 正面または 3/4 角度を優先

## Shot Prompt Usage Rules

- 全ショット共通で [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を最優先で添付します。
- 通常は `画像1 = 主役`, `画像2 = 環境`, `画像3 = スタイル` で生成します。
- カット内の顔アップ・口元可視・表情の静かさは、ショット本文のプロンプトで調整します。
- 環境はショットごとに切り替え、スタイルは大枠の見た目を固定するために使います。

## Segment Attachment Matrix

### Intro - Chorus 1

- `intro-01`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-02`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-03`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-master`
- `intro-04`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-05`: `momiji-studio_0014.png`, `env-rooftop-stage`, `style-wet-reflection`
- `intro-06`: `momiji-studio_0014.png`, `env-glass-city`, `style-master`
- `intro-07`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-08`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-09`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-master`

### Bridge - Final Chorus

- `bridge-01`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `bridge-02`: `momiji-studio_0014.png`, `env-river-bridge-stage`, `style-wet-reflection`
- `bridge-03`: `momiji-studio_0014.png`, `env-river-bridge-stage`, `style-master`
- `bridge-04`: `momiji-studio_0014.png`, `env-glass-city`, `style-master`
- `bridge-05`: `momiji-studio_0014.png`, `env-glass-city`, `style-master`
- `bridge-06`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-studio-glow`
- `bridge-07`: `momiji-studio_0014.png`, `env-river-bridge-stage`, `style-wet-reflection`
- `bridge-08`: `momiji-studio_0014.png`, `env-river-bridge-stage`, `style-master`
- `bridge-09`: `momiji-studio_0014.png`, `env-vocal-booth-night`, `style-master`

## Prompt Assembly Template

```text
reference_images:
- 画像1: momiji-studio_0014.png
- 画像2: midnight-memory-ref-env-vocal-booth-night-v01.png
- 画像3: midnight-memory-ref-style-studio-glow-v01.png

shot_goal:
- 狐娘キャラは画像1と同一人物に固定
- 表情はフラット寄り
- 口元が見える
- 動画生成のスタートフレームとして使いやすい
- 環境と色味は画像2と画像3に合わせる

prompt:
<midnight-memory-nanobanana-prompts.ja.md のショット本文を貼る>
```

## Preflight Checklist

- [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) と同一人物に見える
- 狐耳、髪、尾、瞳色、衣装、ヘッドホンが崩れていない
- 口元が見える
- 表情がフラット寄り
- 動画生成のスタートフレームとして静止感がある
- 環境と色味がショット意図に合っている
