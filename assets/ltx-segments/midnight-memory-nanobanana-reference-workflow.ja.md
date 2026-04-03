# Midnight Memory Nanobanana Reference Workflow

`nanobanana pro` で人物の一貫性を出したい場合は、各セグメントをいきなり生成せず、まず固定の参照画像セットを作ってから各ショットへ入力参照する運用にします。

## Save Location

- 生成した固定参照画像は `assets/ltx-segments/reference-images/` に保存する想定です。
- 推奨命名規則は `midnight-memory-ref-<subject>-<variant>-v01.png` です。
- 再生成して更新したら `v02`, `v03` のように版を増やし、古い画像は消さずに残します。

## Execution Owner

- このワークフローの実行責任者は、`nanobanana pro` で画像を生成する運用担当者です。
- 参照画像を更新した人が、同時にログファイルも更新する前提にします。

## Runbook Files

- `assets/ltx-segments/reference-images/reference-parameter-log.template.csv`
  - 参照画像ごとの `model/preset/seed/steps/cfg/denoise/aspect_ratio` を残すテンプレート
- `assets/ltx-segments/reference-images/reference-pack.manifest.json`
  - どの参照画像が必要で、生成済みか、どの版を使うかを管理する manifest
- `assets/ltx-segments/reference-images/segment-render-log.template.csv`
  - 各セグメントショットが、どの参照画像を使って生成されたかを残すテンプレート

## Parameter Log

参照画像を作るときは、画像と一緒に次の条件も必ずメモしてください。

- `model`
- `preset` または `quality mode`
- `seed`
- `steps`
- `cfg` または `guidance`
- `denoise` 相当の値
- `aspect ratio`
- `notes`

人物が崩れたときにショット側だけ直すと泥沼になりやすいので、まず参照画像の条件を戻せる状態にしておくのが大事です。

## Fixed Reference Images

### 1. Protagonist Full Body

- `filename`: `midnight-memory-ref-protagonist-full-v01.png`
- `purpose`: 全ショット共通の顔、髪、体格、衣装、年代感の固定
- `must_keep`: 黒髪ボブ、20代後半女性、薄いベージュのトレンチコート、深いネイビーの80sワンピース、繊細で抑えた表情
- `prompt_ja`: `1980年代東京の夜、黒髪ボブの20代後半女性、薄いベージュのトレンチコート、深いネイビーの80sワンピース、全身が分かる自然な立ち姿、雨上がりの街の空気、湿度を帯びたシネマティックな実写風ポートレート、顔立ちは繊細で落ち着き、派手すぎないメイク、映画粒子、no text, no watermark`
- `validation`: 顔の輪郭、前髪、肩幅、コート丈、ワンピース色が今後の全ショットに使い回せる状態になっていること

### 2. Protagonist Close Portrait

- `filename`: `midnight-memory-ref-protagonist-close-v01.png`
- `purpose`: 顔寄りショットで目元、鼻筋、唇、髪の分け方を固定
- `must_keep`: 上のフルボディ画像と同一人物に見えること
- `prompt_ja`: `1980年代東京 city-pop ムード、黒髪ボブの20代後半女性の顔寄りポートレート、ベージュのトレンチコートの襟が少し見える、静かな憂い、濡れた空気、ネオンの反射が頬に薄く乗る、実写風、35mm film grain、no text, no watermark`
- `validation`: フルボディ参照と並べたときに同一人物として違和感がないこと

### 3. Counterpart Shadow

- `filename`: `midnight-memory-ref-counterpart-shadow-v01.png`
- `purpose`: 記憶の相手の輪郭、髪型、服装、距離感の固定
- `must_keep`: ダークコートまたはネイビーグレーの細身スーツ、20代後半男性、正面顔を出しすぎない
- `prompt_ja`: `1980年代東京の夜、20代後半男性、ダークコートまたはネイビーグレーの細身スーツ、遠景または半透明の反射として成立する控えめな立ち姿、顔は明確に出しすぎず、静かな記憶の気配、雨上がりのネオン、実写風シネマスチル、no text, no watermark`
- `validation`: 主役より目立たず、影や反射へ転用しやすい濃度になっていること

### 4. Apartment Window Environment

- `filename`: `midnight-memory-ref-env-apartment-window-v01.png`
- `purpose`: Intro 冒頭の窓辺、室内と街の同居感
- `prompt_ja`: `1980年代東京の夜明け前、アパートの窓辺から見える高架下と住宅街、濡れたガラス、外のネオンが薄く反射する、深い藍とアンバー街灯、静かな映画的空気、人物なし、no text, no watermark`
- `validation`: 室内外のレイヤーが1枚で分かること

### 5. Rain Lane Environment

- `filename`: `midnight-memory-ref-env-rain-lane-v01.png`
- `purpose`: 路地、分岐路、濡れた舗道の共通空気
- `prompt_ja`: `1980年代東京の雨上がりの路地、濡れた舗道にネオンが薄く反射する、同じ街灯が奥へ連なる、コバルトブルーとわずかなローズ、人物なし、シネマティック、no text, no watermark`
- `validation`: Intro 2, 5 や余韻ショットへ再利用しやすいこと

### 6. Station Glass Environment

- `filename`: `midnight-memory-ref-env-station-glass-v01.png`
- `purpose`: 駅ホール、ガラス扉、反射ショットの固定
- `prompt_ja`: `1980年代の駅ホール脇、ガラスドアと階段、雨粒で歪んだ反射、白色灯と青いネオン、少し古びた内装、人物なし、city-pop映画の静止画、no text, no watermark`
- `validation`: 反射を使った人物合成がしやすいガラス面があること

### 7. Record Shop Environment

- `filename`: `midnight-memory-ref-env-record-shop-v01.png`
- `purpose`: 忘れかけたメロディを思い出す店内空間
- `prompt_ja`: `1980年代の街角レコードショップ、ガラス戸越しに見えるターンテーブルと古いレコードジャケット、外は雨のネオン、内側はアンバーランプ、人物なし、映画的で静かな構図、no text, no watermark`
- `validation`: 現代的なレジやディスプレイが混ざっていないこと

### 8. Small Room Lamp Environment

- `filename`: `midnight-memory-ref-env-room-lamp-v01.png`
- `purpose`: 胸の奥の感情を見せる小部屋ショット
- `prompt_ja`: `1980年代の小さな部屋、窓際ランプ、古い壁時計、小型ラジオ、外の街灯が斜めに差し込む、深い群青とアンバー、人物なし、静かなシネマ写真、no text, no watermark`
- `validation`: クローズアップ背景としてうるさくないこと

### 9. Bridge River Environment

- `filename`: `midnight-memory-ref-env-bridge-river-v01.png`
- `purpose`: Bridge - Final Chorus の主舞台固定
- `prompt_ja`: `1980年代東京の川沿いの橋、濡れたアスファルト、欄干、遠くの列車の光跡、ネオンブルーとアンバー、夜明け前のわずかな白み、人物なし、ロマンティックで抑制されたcity-popシネマスチル、no text, no watermark`
- `validation`: 後半の9カットで繰り返し使っても破綻しない広さと余白があること

## Global Style Reference Images

人物や場所が揃っても、色温度や湿度感がショットごとに散ると別作品っぽく見えやすいです。そこで、全体テイストを縛るためのスタイル参照を別で用意します。

### 10. Style Master Look

- `filename`: `midnight-memory-ref-style-master-v01.png`
- `purpose`: 全ショット共通の色温度、映画粒子、ネオンの滲み方、80s city-pop の空気感を固定
- `prompt_ja`: `1980年代東京 city-pop の映画的ルック、深紺とコバルトブルー、アンバーネオン、くすんだローズを少量、雨上がりの湿度、濡れた舗道の反射、控えめなネオンの滲み、35mm film grain、静かなロマンティックノスタルジー、人物なし、no text, no watermark`
- `validation`: どのロケーション参照と並べても、同じ作品のカラーグレードに見えること

### 11. Style Wet Reflection

- `filename`: `midnight-memory-ref-style-wet-reflection-v01.png`
- `purpose`: 濡れたアスファルト、光の尾、地面の反射密度を固定
- `prompt_ja`: `雨上がりの東京の舗道、ネオンが細く長く反射する濡れたアスファルト、水たまり、控えめな光芒、シネマティックで上品な湿度感、人物なし、no text, no watermark`
- `validation`: 路地、橋、駅前のどこに混ぜても反射の質感が揃うこと

### 12. Style Glass Neon Haze

- `filename`: `midnight-memory-ref-style-glass-neon-v01.png`
- `purpose`: ガラス越しの滲み、反射、ネオンハレーションを固定
- `prompt_ja`: `1980年代東京の夜、ガラス面に滲むネオン、薄い反射、曇った空気、白色灯と青いネオンの重なり、繊細なハレーション、人物なし、no text, no watermark`
- `validation`: 駅のガラス扉、窓辺、レコード店ガラスに流用しても違和感がないこと

## Reference Stack Design

- `character refs`: 顔、髪、衣装、体格を固定する層
- `environment refs`: ロケーションの形、奥行き、看板密度、欄干や窓の位置を固定する層
- `style refs`: 色温度、湿度、粒子、反射、ネオンの滲み方を固定する層
- 1ショットに全部盛りしすぎると参照が競合しやすいので、基本は `3〜5枚` までに抑えます。
- 推奨の優先順位は `主人公 -> スタイルマスター -> 必要な相手 -> 必要な環境 -> 補助スタイル` です。

## Shot Prompt Usage Rules

- 各ショットでは、まず主人公参照を最優先で添付します。
- 全ショットで `style-master` を常時添付します。
- 屋外ショットでは `style-wet-reflection` を追加すると、舗道や橋の反射が揃いやすいです。
- ガラスや反射が主役のショットでは `style-glass-neon` を追加します。
- 顔が見えるショットは `protagonist-full` と `protagonist-close` の両方を添付します。
- 相手が画面に出るショットだけ `counterpart-shadow` を追加します。
- 背景の空気感を安定させたいショットは、対応する環境参照を最後に追加します。
- 参照を読み込む順番を指定できるなら、`主人公 full -> 主人公 close -> style master -> 相手 -> 環境 -> 補助style` の順で固定します。
- この順番は全ショットで変えません。
- `[melody]` セグメントは人物より空間の感情が主役なので、相手参照は省略可能です。
- `image_prompt_ja` はこのリファレンス群を前提にした「カット内容の追記」として使います。顔や衣装の説明を毎回盛りすぎないほうが安定します。
- 崩れたときはショットを連続でリロールする前に、参照画像側の出来を見直します。

## Segment Attachment Matrix

### Intro - Chorus 1

- `intro-01`: `protagonist-full`, `protagonist-close`, `style-master`, `style-glass-neon`, `env-apartment-window`
- `intro-02`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `env-rain-lane`
- `intro-03`: `protagonist-full`, `protagonist-close`, `style-master`, `style-glass-neon`, `counterpart-shadow`, `env-station-glass`
- `intro-04`: `protagonist-full`, `protagonist-close`, `style-master`, `style-glass-neon`, `env-record-shop`
- `intro-05`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `counterpart-shadow`, `env-rain-lane`
- `intro-06`: `protagonist-full`, `protagonist-close`, `style-master`, `style-glass-neon`, `counterpart-shadow`, `env-station-glass`
- `intro-07`: `protagonist-full`, `protagonist-close`, `style-master`, `env-room-lamp`
- `intro-08`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `counterpart-shadow`, `env-bridge-river`
- `intro-09`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `env-rain-lane`

### Bridge - Final Chorus

- `bridge-01`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `env-bridge-river`
- `bridge-02`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `env-bridge-river`
- `bridge-03`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `counterpart-shadow`, `env-bridge-river`
- `bridge-04`: `protagonist-full`, `protagonist-close`, `style-master`, `style-glass-neon`, `counterpart-shadow`, `env-station-glass`
- `bridge-05`: `protagonist-full`, `protagonist-close`, `style-master`, `style-glass-neon`, `counterpart-shadow`, `env-station-glass`
- `bridge-06`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `counterpart-shadow`, `env-bridge-river`
- `bridge-07`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `counterpart-shadow`, `env-bridge-river`
- `bridge-08`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `counterpart-shadow`, `env-bridge-river`
- `bridge-09`: `protagonist-full`, `protagonist-close`, `style-master`, `style-wet-reflection`, `env-bridge-river`

## Prompt Assembly Template

ショット生成時は、参照画像を添付した上で次の形に寄せると管理しやすいです。

```text
reference_images:
- midnight-memory-ref-protagonist-full-v01.png
- midnight-memory-ref-protagonist-close-v01.png
- midnight-memory-ref-style-master-v01.png
- midnight-memory-ref-counterpart-shadow-v01.png
- midnight-memory-ref-env-bridge-river-v01.png

shot_goal:
- 主人公の顔、髪、衣装は参照画像に合わせて固定
- 色温度、粒子、湿度、ネオンの滲み方は style master に合わせて固定
- 相手は反射または遠景の影として控えめに出す
- 背景の湿度、ネオン、年代感は環境参照に合わせる

prompt:
<midnight-memory-scene-prompts.ja.md の image_prompt_ja を貼る>

negative:
- no text
- no watermark
- no readable signage logos
- no smartphone
- no modern cars
- no LED billboards
- no different hairstyle
- no different coat color
```

## Preflight Checklist

- 参照画像どうしの解像度、縦横比、露出、色味が揃っている
- 主人公フルと主人公クローズを並べて同一人物に見える
- style master が全ロケーションに流用できる色味になっている
- 相手参照が主役より強く出すぎていない
- モデル設定、seed、guidance などを記録している
- 1枚生成するたびに「顔」「髪」「コート色」「年代感」の4点だけは目視チェックする
- 破綻したらショットを増やす前に参照画像を直す

## Recommended Review Threshold

次のどれかがズレたら、そのショットは採用しないほうが安全です。

- 主人公の髪型がボブから大きく外れる
- コート色がベージュから離れる
- 相手が正面顔で主役化してしまう
- 1980年代の空気より現代都市の広告感が勝つ
