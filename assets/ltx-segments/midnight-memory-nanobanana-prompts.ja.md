# Midnight Memory Nanobanana Prompt Pack

`nanobanana pro` へそのまま貼るための日本語 prompt pack です。  
主役は必ず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) の狐娘に固定し、ロケーション固定マスター画像を経由して、最終ショットの一貫性を高める構成にしています。

## Quick Start

1. まず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) を読み込む
2. 環境参照 4 枚と `style-master` 1 枚を作る
3. `画像1 = 主役`, `画像2 = 環境`, `画像3 = style-master` でロケーション固定マスター画像を作る
4. 最終ショットは `画像1 = 主役`, `画像2 = ロケーション固定マスター` で 1 枚だけ出す
5. 必要ならこちらで何回も実行して候補を集め、よいものを選ぶ

## 参照順ルール

- ロケーション固定マスター生成:
  - `画像1 = 主役`
  - `画像2 = 環境`
  - `画像3 = style-master`
- 最終ショット生成:
  - `画像1 = 主役`
  - `画像2 = ロケーション固定マスター`
- どうしても絵が散るときだけ、最終ショット生成で `画像3 = style-master` を追加する
- 候補を増やしたいときは、同じプロンプトをこちらで何回も実行し、そのたびにカメラ角度、距離、寄り引き、視線のランダム差分を拾う

## 共通ネガティブ

```text
文字なし、ウォーターマークなし、読める看板ロゴなし、口元が隠れない、髪が口にかからない、マイクが唇を隠さない、極端な真横顔にしない、髪型を変えない、耳の形を変えない、尾の色を変えない、瞳の色を変えない、ヘッドホンのデザインを変えない、現代的な車を入れない、スマートフォンを入れない、LED看板の密集を入れない、強い歌唱口形にしない、口を大きく開けすぎない
```

## スタートフレーム方針

- この prompt pack は静止画カット用
- 歌い方や口の動きそのものは、後段の動画生成プロンプトで与える
- 各カットは `歌唱中` ではなく `歌い出す直前` `感情が乗る直前` `息を整えている瞬間` に寄せる
- 表情はフラット寄り
- 唇と顎のラインは見えるままにする

## 汎用ランダムプロンプト

このセクションは、ロケーション固定マスター画像を参照しながら、別角度の収録シーンを1枚ずつ作るための汎用プロンプトです。

### 共通テンプレ

参照順:
1. `画像1 = character/momiji-studio_0014.png`
2. `画像2 = location master`

Prompt:
```text
画像1の狐娘を主役にして、画像2のロケーション固定マスター画像と同じ場所のまま、別の角度からの収録シーンにして。  
顔はアップで。カメラの角度、距離、寄り引き、顔の向き、視線はランダムでいい。  
キャラクターの同一性、衣装、背景の構造は変えない。  
表情はフラット寄り。口は閉じ気味か少しだけ開く程度。唇と顎のラインは見えるようにして。  
文字なし、ウォーターマークなし。
```

### vocal-booth 用

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役にして、画像2のボーカルブースのロケーション固定マスター画像と同じ場所のまま、別の角度からの収録シーンにして。  
顔はアップで。カメラの角度、距離、寄り引き、視線はランダムでいい。  
ボーカルブースの構造、窓の夜景、マイク位置は変えない。  
表情はフラット寄り。口元は見えるようにして。  
文字なし、ウォーターマークなし。
```

### rooftop 用

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-rooftop-v01.png）`

Prompt:
```text
画像1の狐娘を主役にして、画像2の屋上ステージのロケーション固定マスター画像と同じ場所のまま、別の角度からの収録シーンにして。  
顔はアップで。カメラの角度、距離、寄り引き、視線はランダムでいい。  
屋上ステージの構造、床の反射、夜景の位置は変えない。  
表情はフラット寄り。口元は見えるようにして。  
文字なし、ウォーターマークなし。
```

### river-bridge 用

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-river-bridge-v01.png）`

Prompt:
```text
画像1の狐娘を主役にして、画像2の川沿いブリッジのロケーション固定マスター画像と同じ場所のまま、別の角度からの収録シーンにして。  
顔はアップで。カメラの角度、距離、寄り引き、視線はランダムでいい。  
欄干、水面、背景の光は変えない。  
表情はフラット寄り。口元は見えるようにして。  
文字なし、ウォーターマークなし。
```

### glass-city 用

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-glass-city-v01.png）`

Prompt:
```text
画像1の狐娘を主役にして、画像2のガラス越し都会空間のロケーション固定マスター画像と同じ場所のまま、別の角度からの収録シーンにして。  
顔はアップで。カメラの角度、距離、寄り引き、視線はランダムでいい。  
ガラスの反射やネオンの滲み、空間の構造は変えない。  
表情はフラット寄り。口元は見えるようにして。  
文字なし、ウォーターマークなし。
```

## 環境参照・スタイル参照プロンプト

### 1. env-vocal-booth-night

```text
深夜の city-pop バラード MV に合う、夜景の見えるボーカルブース環境参照画像を作る。  
大きな窓の向こうに東京の夜景。コンデンサーマイク、少し横へ逃がしたポップガード、吸音材、ミキサーの柔らかいボケ。人物は入れない。  
狐娘の顔アップスタートフレームを前景に置けるよう、中央を塞がず、口元の位置に機材が来ない構図にする。  
文字なし、ウォーターマークなし。
```

### 2. env-rooftop-stage

```text
深夜の city-pop MV に合う、屋上ステージの環境参照画像を作る。  
東京の夜景、濡れた床、控えめなパフォーマンス空間、上品な都市のシルエット。人物は入れない。  
狐娘の上半身スタートフレームを大きく置ける余白を前景に残す。  
文字なし、ウォーターマークなし。
```

### 3. env-river-bridge-stage

```text
切ない city-pop MV の後半サビに合う、川沿いブリッジステージの環境参照画像を作る。  
東京の川沿い、濡れた床、欄干、遠くの光跡、水面反射。人物は入れない。  
顔アップでも上半身でも自然に乗る構図にする。  
文字なし、ウォーターマークなし。
```

### 4. env-glass-city

```text
深夜の city-pop MV に合う、ガラス越し都会空間の環境参照画像を作る。  
ガラス面、控えめなネオンの滲み、整った都会の反射、上質な都市空間。人物は入れない。  
顔アップスタートフレームで唇と目が埋もれない程度に、反射は上品に整理する。  
文字なし、ウォーターマークなし。
```

### 5. style-master

```text
Midnight Memory の狐娘 MV 全体に共通する、マスタールック参照画像を作る。  
1980年代東京 city-pop MV の空気。深紺、コバルトブルー、温かいアンバー、少量のローズ。  
繊細な映画粒子、湿度を帯びた夜気、磨かれたハレーション。人物は入れない。  
文字なし、ウォーターマークなし。
```

## ロケーション固定マスター画像用プロンプト

### 1. vocal-booth master

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（environment/midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（style/midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の夜景ボーカルブースと画像3のスタイルやタッチ、空気感を参照して、ロケーション固定マスター画像を作る。  
高級感のある夜景スタジオのボーカルブースに立つ狐娘。  
顔と上半身が自然に見えるミディアムクローズ。正面寄りからやや 3/4。  
表情はフラット寄り、口は閉じ気味か少しだけ開く程度。唇と顎のラインは見える。  
この画像は後段で別カメラ角度のショットを作るための基準画像にする。  
文字なし、ウォーターマークなし。
```

### 2. rooftop master

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（environment/midnight-memory-ref-env-rooftop-stage-v01.png）`
3. `画像3（style/midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の屋上ステージと画像3のスタイルやタッチ、空気感を参照して、ロケーション固定マスター画像を作る。  
夜景の見える屋上ステージに立つ狐娘。  
顔と上半身が自然に見えるミディアムクローズ。  
風に揺れる髪と狐耳、濡れた床、しかし表情はフラット寄り。  
後段でカメラ位置を変えても一貫性が崩れない基準画像にする。  
文字なし、ウォーターマークなし。
```

### 3. river-bridge master

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（environment/midnight-memory-ref-env-river-bridge-stage-v01.png）`
3. `画像3（style/midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の川沿いブリッジステージと画像3のスタイルやタッチ、空気感を参照して、ロケーション固定マスター画像を作る。  
東京の川沿いブリッジステージに立つ狐娘。  
顔と上半身が自然に見えるミディアムクローズ。  
表情はフラット寄り、口元は見える。  
後段で寄り引きや角度変更をしても一貫性が保てる母体画像にする。  
文字なし、ウォーターマークなし。
```

### 4. glass-city master

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（environment/midnight-memory-ref-env-glass-city-v01.png）`
3. `画像3（style/midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のガラス越し都会空間と画像3のスタイルやタッチ、空気感を参照して、ロケーション固定マスター画像を作る。  
ガラス越しに都会のネオンが滲む夜の空間に立つ狐娘。  
顔と上半身が自然に見えるミディアムクローズ。  
表情はフラット寄り、唇と顎のラインは見える。  
後段のカメラ変更に耐える基準画像にする。  
文字なし、ウォーターマークなし。
```

## 最終ショット用プロンプト

### intro-01

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
夜景の見えるボーカルブースで歌い出す直前、もう声が始まりそうな口元を見せる MV カット。  
顔が大きく写るミディアムクローズ。  
カメラ位置だけを少し変えて、ロケーションの一貫性は画像2に従う。
```

### intro-02

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
スタジオで歌い出す直前のクローズアップ。Ooh に入る前の静かな口元。  
同じ場所のまま、前ショットより少し寄ったカメラ位置にする。
```

### intro-03

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
夜景が大きく見えるスタジオ窓の前に立つ。上半身のミディアムショット。口元が見える。  
同じロケーションのまま、少し横へ振ったカメラ位置にする。
```

### intro-04

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
録音ブースの中で切なさをたたえる顔アップ。唇の輪郭がはっきり分かる。  
同じ場所のまま、より顔寄りのカメラ位置にする。
```

### intro-05

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-rooftop-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
夜景の見える屋上ステージで歌唱直前に構える。風に揺れる髪と狐耳。口元がしっかり見える。  
屋上の世界観は画像2に合わせ、カメラ位置だけを変える。
```

### intro-06

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-glass-city-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
ガラスに都会の反射が入る夜の空間で静かに佇むクローズアップ。  
ガラスの反射やネオンの滲みは画像2に従い、カメラ位置だけ変える。
```

### intro-07

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
ボーカルブースで囁く直前の超クローズアップ。唇と顎のラインがきれいに見える。  
同じスタジオ空間のまま、さらに寄ったカメラ位置にする。
```

### intro-08

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
夜景を背にしてサビへ入る直前の、正面寄りクローズアップ。口元が明確。  
同じスタジオ空間のまま、ヒーローカット寄りのカメラにする。
```

### intro-09

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
エンディングへ入る直前の余韻を残して静かに息を整える、顔中心のミディアムクローズ。  
同じスタジオ空間のまま、やや引いたカメラ位置にする。
```

### bridge-01

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
後半の始まり、夜景スタジオで集中した表情のミディアムクローズ。  
同じスタジオ空間のまま、前半より少し緊張感のあるカメラ位置にする。
```

### bridge-02

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-river-bridge-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
川沿いのブリッジステージでハミングへ入る直前。口元が読めるタイトミディアム。  
ブリッジの世界観は画像2に従い、カメラ位置だけ変える。
```

### bridge-03

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-river-bridge-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
川沿いの夜景ステージで感情が高まる直前のクローズアップ。口元が明確。  
同じブリッジ空間のまま、より顔に寄ったカメラ位置にする。
```

### bridge-04

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-glass-city-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
ガラス越しの都会空間でカメラへ向かって静かに構える正面クローズアップ。  
同じ都会空間のまま、カメラ位置だけ変える。
```

### bridge-05

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-glass-city-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
感情を抑えたフラット表情の顔アップ。唇の形が読みやすい。  
同じ都会空間のまま、少し寄りのカメラ位置にする。
```

### bridge-06

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
スタジオでサビへ入る直前に真正面で構える、顔が大きく写るクローズアップ。  
同じスタジオ空間のまま、王道ヒーロー寄りのカメラ位置にする。
```

### bridge-07

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-river-bridge-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
サビの余韻へ入る直前に静かに息を溜める 3/4 クローズアップ。  
同じブリッジ空間のまま、やや横に振ったカメラ位置にする。
```

### bridge-08

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-river-bridge-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
長い Ah に入る直前のタイトクローズアップ。唇の形と顎の動きが分かる。  
同じブリッジ空間のまま、口元重視のカメラ位置にする。
```

### bridge-09

参照順:
1. `画像1（character/momiji-studio_0014.png）`
2. `画像2（location-masters/midnight-memory-master-vocal-booth-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のロケーション固定マスター画像を参照して生成する。  
エンディング直前の余韻を残して夜景スタジオに立つ、顔中心のミディアムクローズ。  
同じスタジオ空間のまま、静かなラストフレームにする。
```

## 最後のメモ

- まずロケーション固定マスター画像を作る
- その後で最終ショットを作る
- カメラ位置や寄り引きは最終ショット側で変える
