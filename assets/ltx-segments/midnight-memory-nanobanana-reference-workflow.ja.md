# Midnight Memory Nanobanana Reference Workflow

`nanobanana pro` で今回の MV カットを作るときは、[momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘を主役固定の絶対基準にして、先に参照画像セットを揃えてから各セグメントへ入力します。

## Core Goal

- 主役は常に [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘
- 全カットを「歌っている MV シーン」に寄せる
- 後段のリップシンク用に、顔アップと口元可視性を優先する
- 街並み、スタジオ、夜景、湿度感、ネオンの滲みも参照画像で固定する

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

- `character refs`
  - 顔、耳、髪、尾、衣装、ヘッドホンを固定する層
- `mouth refs`
  - 口元、顎、歌唱時の顔寄りフレームを固定する層
- `environment refs`
  - スタジオ、夜景窓、屋上、川沿いブリッジ、ガラス空間を固定する層
- `style refs`
  - 色温度、ネオンの滲み、湿度感、映画粒子を固定する層

1ショットに参照を盛りすぎると競合するので、基本は `4〜5枚` までに抑えます。

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
- `must_keep`: 狐耳、長い琥珀色の髪、金色の瞳、ふわっとした尾、和柄寄りの衣装、黒金のヘッドホン、アニメ寄り高品質ルック
- `validation`: 今後の全ショットが、この画像の同一人物に見えること

## Fixed Reference Images To Prepare

### 1. Protagonist Mouth Close

- `filename`: `midnight-memory-ref-protagonist-mouth-close-v01.png`
- `purpose`: 顔アップと口元の固定
- `prompt_ja`: `momiji-studio_0014.png の狐娘と同一人物、歌唱用の顔アップ、唇と顎のラインが見える、狐耳と琥珀色の髪、金色の瞳、黒金ヘッドホン、和柄衣装の肩口が見える、スタジオ光、リップシンク向け、no text, no watermark`
- `validation`: 口元が大きく見え、髪やマイクで隠れないこと

### 2. Protagonist Upper Body Performance

- `filename`: `midnight-memory-ref-protagonist-upperbody-v01.png`
- `purpose`: 上半身の歌唱ポーズ固定
- `prompt_ja`: `momiji-studio_0014.png の狐娘と同一人物、上半身が見える歌唱ポーズ、片手または両手で自然に歌う、狐耳、長い髪、尾の一部、和柄衣装、黒金ヘッドホン、MV向けの洗練された実在感、no text, no watermark`
- `validation`: 顔と衣装の整合がベース画像とズレないこと

### 3. Environment Vocal Booth

- `filename`: `midnight-memory-ref-env-vocal-booth-night-v01.png`
- `purpose`: 夜景の見えるボーカルブース固定
- `prompt_ja`: `東京の夜景が大きく見える録音スタジオ、コンデンサーマイク、少し横に避けたポップガード、吸音材、ミキサーのボケ、人物なし、city-pop MV向け、no text, no watermark`
- `validation`: 主役を合成しても口元を塞がない構成になっていること

### 4. Environment Rooftop Stage

- `filename`: `midnight-memory-ref-env-rooftop-stage-v01.png`
- `purpose`: 夜風のある屋上歌唱ステージ固定
- `prompt_ja`: `東京の夜景が広がる屋上ステージ、濡れた床、マイクスタンドまたはパフォーマンス用スペース、夜風を感じる空気、人物なし、MV向け、no text, no watermark`
- `validation`: 主役を大きく前景に置ける余白があること

### 5. Environment River Bridge Stage

- `filename`: `midnight-memory-ref-env-river-bridge-stage-v01.png`
- `purpose`: 後半の川沿いブリッジ歌唱ステージ固定
- `prompt_ja`: `東京の川沿いのブリッジステージ、濡れた床、欄干、遠くの光跡、水面反射、人物なし、切ない city-pop MV 向け、no text, no watermark`
- `validation`: サビの歌唱カットに何度も使える奥行きがあること

### 6. Environment Glass City Space

- `filename`: `midnight-memory-ref-env-glass-city-v01.png`
- `purpose`: ガラス越し都会空間の固定
- `prompt_ja`: `夜の都会のガラス空間、ネオンの滲み、白色灯、都会の反射、人物なし、上品なハレーション、MV向け、no text, no watermark`
- `validation`: 主役の顔が埋もれない程度に反射が整理されていること

### 7. Style Master Look

- `filename`: `midnight-memory-ref-style-master-v01.png`
- `purpose`: 全ショット共通の色温度、粒子、city-pop 感の固定
- `prompt_ja`: `1980年代東京 city-pop MV ルック、深紺、コバルトブルー、温かいアンバー、少量のローズ、繊細な映画粒子、湿度を帯びた夜の空気、人物なし、no text, no watermark`
- `validation`: どの場所に重ねても同じ作品の色味に見えること

### 8. Style Wet Reflection

- `filename`: `midnight-memory-ref-style-wet-reflection-v01.png`
- `purpose`: 濡れた床と光の反射の質感固定
- `prompt_ja`: `雨上がりの舗道やステージ床に細長く反射するネオン、上品な湿度感、人物なし、no text, no watermark`
- `validation`: 屋上、橋、屋外歌唱カットに流用できること

### 9. Style Studio Glow

- `filename`: `midnight-memory-ref-style-studio-glow-v01.png`
- `purpose`: スタジオ内の暖色グロウと夜景ブルーの共存を固定
- `prompt_ja`: `録音スタジオの暖かい室内光と窓外の青い夜景が共存するルック、人物なし、上質なMV照明、no text, no watermark`
- `validation`: スタジオ歌唱カット全般に馴染むこと

## Lip Sync Framing Rules

- 正面または 3/4 の顔角度を優先
- 口元が見えるよう、マイクはやや外す
- ポップガードは唇の前に置かない
- 髪を唇にかけない
- 1ショットの中で顔が小さくなりすぎない

## Shot Prompt Usage Rules

- 全ショット共通で [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を最優先で添付します。
- 顔寄りショットは `protagonist-base + protagonist-mouth-close + style-master` を基本セットにします。
- 歌唱の上半身が必要なときは `protagonist-upperbody` を足します。
- スタジオ歌唱は `env-vocal-booth-night + style-studio-glow` を使います。
- 屋外歌唱は `env-rooftop-stage` または `env-river-bridge-stage` と `style-wet-reflection` を使います。
- ガラス越し歌唱は `env-glass-city + style-master` を使います。
- 参照の読み込み順を指定できるなら、`protagonist base -> mouth close -> upper body -> environment -> style` の順にします。

## Segment Attachment Matrix

### Intro - Chorus 1

- `intro-01`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-02`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-03`: `momiji-studio_0014.png`, `protagonist-upperbody`, `env-vocal-booth-night`, `style-master`
- `intro-04`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-05`: `momiji-studio_0014.png`, `protagonist-upperbody`, `env-rooftop-stage`, `style-wet-reflection`
- `intro-06`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-glass-city`, `style-master`
- `intro-07`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-08`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `intro-09`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-master`

### Bridge - Final Chorus

- `bridge-01`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `bridge-02`: `momiji-studio_0014.png`, `protagonist-upperbody`, `env-river-bridge-stage`, `style-wet-reflection`
- `bridge-03`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-river-bridge-stage`, `style-master`
- `bridge-04`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-glass-city`, `style-master`
- `bridge-05`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-glass-city`, `style-master`
- `bridge-06`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-studio-glow`
- `bridge-07`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-river-bridge-stage`, `style-wet-reflection`
- `bridge-08`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-river-bridge-stage`, `style-master`
- `bridge-09`: `momiji-studio_0014.png`, `protagonist-mouth-close`, `env-vocal-booth-night`, `style-master`

## Prompt Assembly Template

```text
reference_images:
- momiji-studio_0014.png
- midnight-memory-ref-protagonist-mouth-close-v01.png
- midnight-memory-ref-env-vocal-booth-night-v01.png
- midnight-memory-ref-style-studio-glow-v01.png

shot_goal:
- 狐娘キャラは momiji-studio_0014.png と同一人物に固定
- 顔を大きく写し、口元が見える
- 実際に歌っているMVカットにする
- スタジオまたは夜景ロケの空気感を保つ

prompt:
<midnight-memory-scene-prompts.ja.md の image_prompt_ja を貼る>

negative:
- no text
- no watermark
- no readable signage logos
- no blocked lips
- no hair over mouth
- no extreme side profile
- no different hairstyle
- no different ear shape
- no different tail color
```

## Preflight Checklist

- [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) と生成結果が同一人物に見える
- 狐耳、髪、尾、瞳色、衣装、ヘッドホンが崩れていない
- 口元が見える
- マイクやポップガードで唇を隠していない
- 歌っているように見える
- スタジオか曲に合う夜景ロケのどちらかに乗っている

## Recommended Review Threshold

次のどれかがズレたら採用しないほうが安全です。

- momiji の狐娘に見えない
- 口元が読み取れない
- 歌唱カットではなく単なる立ち絵に見える
- 背景が現代的すぎて曲のムードから外れる
