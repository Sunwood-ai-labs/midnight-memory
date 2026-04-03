# Midnight Memory Nanobanana Prompt Pack

`nanobanana pro` へそのまま貼るための日本語 prompt pack です。  
主役は必ず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) の狐娘に固定し、MV風のスタートフレーム用カット、顔アップ、口元可視、後段リップシンク対応を優先しています。

## Quick Start

1. まず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) を読み込んで、環境参照とスタイル参照 7 枚を先に作ります。
2. 次に各ショットで、指定順の参照画像を読み込み、ショット用 prompt を貼ります。
3. 同じ `model` / `preset` / `quality mode` / `seed 方針` を保ち、生成結果は [reference-parameter-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-parameter-log.template.csv) と [segment-render-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/segment-render-log.template.csv) へ記録します。

## 参照順ルール

- 基本順序: `画像1 = 主役固定 -> 画像2 = 環境 -> 画像3 = スタイル`
- 顔アップや上半身の調整は、画像2を別のキャラ参照にせず、本文プロンプトで行います。
- 通常運用では `画像1〜画像3` の 3 枚だけで十分です。

## 共通ネガティブ

```text
文字なし、ウォーターマークなし、読める看板ロゴなし、口元が隠れない、髪が口にかからない、マイクが唇を隠さない、極端な真横顔にしない、髪型を変えない、耳の形を変えない、尾の色を変えない、瞳の色を変えない、ヘッドホンのデザインを変えない、現代的な車を入れない、スマートフォンを入れない、LED看板の密集を入れない、強い歌唱口形にしない、口を大きく開けすぎない
```

## スタートフレーム方針

- この prompt pack は静止画カット用です。
- 歌い方や口の動きそのものは、後段の動画生成プロンプトで与える前提です。
- そのため各カットは、`歌唱中` ではなく `歌い出す直前` `感情が乗る直前` `息を整えている瞬間` のような静止状態に寄せます。
- 表情はフラット寄りにし、口は閉じ気味か、少しだけ開く程度に留めます。
- ただしリップシンクしやすいように、唇と顎のラインは見えるままにします。

## 参照画像用プロンプト

### 1. env-vocal-booth-night

Prompt:
```text
深夜の city-pop バラード MV に合う、夜景の見えるボーカルブース環境参照画像を作る。  
大きな窓の向こうに東京の夜景。コンデンサーマイク、少し横へ逃がしたポップガード、吸音材、ミキサーの柔らかいボケ。人物は入れない。  
狐娘の顔アップスタートフレームを前景に置けるよう、中央を塞がず、口元の位置に機材が来ない構図にする。  
暖かいスタジオ光と深い夜景ブルーを共存させる。  
文字なし、ウォーターマークなし。  
避ける: 口元位置にポップガードが重なる構図、機材が密集しすぎた壁、安っぽい配信部屋感。
```

### 2. env-rooftop-stage

Prompt:
```text
深夜の city-pop MV に合う、屋上ステージの環境参照画像を作る。  
東京の夜景、濡れた床、控えめなパフォーマンス空間、上品な都市のシルエット。人物は入れない。  
狐娘の上半身スタートフレームを大きく置ける余白を前景に残す。  
青い夜風、アンバーの街明かり、抑えたロマンス。  
文字なし、ウォーターマークなし。  
避ける: 巨大な舞台装置、フェス照明、ロゴだらけの看板。
```

### 3. env-river-bridge-stage

Prompt:
```text
切ない city-pop MV の後半サビに合う、川沿いブリッジステージの環境参照画像を作る。  
東京の川沿い、濡れた床、欄干、遠くの光跡、水面反射。人物は入れない。  
顔アップでも上半身でも自然に乗る構図にする。  
深い青、コバルト、アンバー、少し霞んだ夜気。  
文字なし、ウォーターマークなし。  
避ける: ただの高速道路っぽい空間、サイバーパンク過多、人物が小さくしか置けない遠すぎる構図。
```

### 4. env-glass-city

Prompt:
```text
深夜の city-pop MV に合う、ガラス越し都会空間の環境参照画像を作る。  
ガラス面、控えめなネオンの滲み、整った都会の反射、上質な都市空間。人物は入れない。  
顔アップスタートフレームで唇と目が埋もれない程度に、反射は上品に整理する。  
青い都会光と柔らかい白色灯を混ぜる。  
文字なし、ウォーターマークなし。  
避ける: 反射が強すぎて顔が消える構図、昼のオフィスのような雰囲気。
```

### 5. style-master

Prompt:
```text
Midnight Memory の狐娘 MV 全体に共通する、マスタールック参照画像を作る。  
1980年代東京 city-pop MV の空気。深紺、コバルトブルー、温かいアンバー、少量のくすんだローズ。  
繊細な映画粒子、湿度を帯びた夜気、磨かれたハレーション。人物は入れない。  
スタジオカットにも屋外カットにも共通で使える、統一感のある色温度にする。  
文字なし、ウォーターマークなし。  
避ける: サイバーパンク過多、平板な照明、明るすぎるアイドル色。
```

### 6. style-wet-reflection

Prompt:
```text
屋外カット用に、濡れた床とネオン反射の質感を固定するスタイル参照画像を作る。  
雨上がりの舗道やステージ床に、細長いネオン反射が上品に伸びる。人物は入れない。  
湿度感はあるが汚れすぎず、ロマンティックで洗練された質感にする。  
コバルト、深紺、アンバーを主に使う。  
文字なし、ウォーターマークなし。  
避ける: 水たまりの混沌、泥感、虹色に散る反射。
```

### 7. style-studio-glow

Prompt:
```text
スタジオカット用に、暖色の室内光と青い夜景が共存するスタイル参照画像を作る。  
録音スタジオの暖かな光、窓外の深い青い夜、ガラスの柔らかいグロウ。人物は入れない。  
顔アップのスタートフレームに向く、上質で静かな MV 照明にする。  
文字なし、ウォーターマークなし。  
避ける: 強すぎるスポットライト、事務所の蛍光灯のような光。
```

## ショット用プロンプト

### intro-01

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の夜景ボーカルブースと画像3のスタジオ光の雰囲気を参照して生成する。  
夜景の見えるボーカルブースで歌い出す直前、もう声が始まりそうな口元を見せる MV カット。  
顔が大きく写るミディアムクローズ。口元がよく見える。黒金のヘッドホン、和モダン衣装、東京の夜景ボケ。  
動画生成のスタートフレーム用として、表情はフラット寄り、口は軽く閉じるか少しだけ開く程度にする。
```

### intro-02

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の夜景ボーカルブースと画像3のスタジオ光を参照して生成する。  
スタジオで歌い出す直前のクローズアップ。Ooh に入る前の静かな口元。  
金色の瞳、琥珀色の長い髪、黒金ヘッドホン。マイクは脇へ寄せて唇を見せる。  
上質で切ない冒頭カットにする。
```

### intro-03

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の夜景ボーカルブースと画像3のマスタールックを参照して生成する。  
夜景が大きく見えるスタジオ窓の前に立つ。上半身のミディアムショット。口元が見える。  
東京の街の光が背後で滲む。  
歌唱中ではなく、パフォーマンスへ入る直前の静かな MV カットにする。
```

### intro-04

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のスタジオ光を参照して生成する。  
録音ブースの中で切なさをたたえる顔アップ。唇の輪郭がはっきり分かる。  
ヘッドホン、和柄衣装の肩口、柔らかいスタジオ機材のボケ。  
目元と口元に余韻を乗せたスタートフレームにする。
```

### intro-05

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-rooftop-stage-v01.png）`
3. `画像3（midnight-memory-ref-style-wet-reflection-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の屋上ステージと画像3の濡れた反射の質感を参照して生成する。  
夜景の見える屋上ステージで歌唱直前に構える。風に揺れる髪と狐耳。口元がしっかり見えるミディアムクローズ。  
手持ちマイクは口を隠さない角度。濡れた床にネオンが反射する。  
フラット寄りの表情で、実際に歌い出す前の静かな瞬間にする。
```

### intro-06

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-glass-city-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のガラス越し都会空間と画像3のマスタールックを参照して生成する。  
ガラスに都会の反射が入る夜の空間で静かに佇むクローズアップ。カメラ寄りの目線。唇が見える。  
ネオンの滲みを入れつつ、顔と口元は埋もれさせない。  
都会的で切ないスタートフレームにする。
```

### intro-07

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のスタジオ光を参照して生成する。  
ボーカルブースで囁く直前の超クローズアップ。唇と顎のラインがきれいに見える。  
静かな痛みを含んだ、しかしフラット寄りの表情。  
口元重視のスタートフレームにする。
```

### intro-08

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のスタジオ光を参照して生成する。  
夜景を背にしてサビへ入る直前の、正面寄りクローズアップ。口元が明確。  
金色の瞳、狐耳、ヘッドホン。  
切なくも少し華やかなヒーローカットだが、表情はフラット寄りにする。
```

### intro-09

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のマスタールックを参照して生成する。  
エンディングへ入る直前の余韻を残して静かに息を整える、顔中心のミディアムクローズ。唇が見える。  
夜景スタジオの残光を背に、呼吸の見える静止フレームにする。
```

### bridge-01

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のスタジオ光を参照して生成する。  
後半の始まり、夜景スタジオで集中した表情のミディアムクローズ。歌い出す直前で口元が見える。  
深夜の city-pop MV の後半導入として、静かな緊張感を出す。
```

### bridge-02

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-river-bridge-stage-v01.png）`
3. `画像3（midnight-memory-ref-style-wet-reflection-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の川沿いブリッジステージと画像3の濡れた反射の質感を参照して生成する。  
川沿いのブリッジステージでハミングへ入る直前。口元が読めるタイトミディアム。  
濡れた床、水面の反射、夜景のボケ。  
ロマンティックで切ない静止フレームにする。
```

### bridge-03

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-river-bridge-stage-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の川沿いブリッジステージと画像3のマスタールックを参照して生成する。  
川沿いの夜景ステージで感情が高まる直前のクローズアップ。口元が明確。  
背景に水面と都市の光の波。金色の瞳に感情が乗る寸前。  
顔主体のスタートフレームにする。
```

### bridge-04

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-glass-city-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のガラス越し都会空間と画像3のマスタールックを参照して生成する。  
ガラス越しの都会空間でカメラへ向かって静かに構える正面クローズアップ。唇がよく見える。  
ガラスにネオンの滲みを入れつつ、顔ははっきり見せる。  
切ない呼びかけの前の静止フレームにする。
```

### bridge-05

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-glass-city-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のガラス越し都会空間と画像3のマスタールックを参照して生成する。  
感情を抑えたフラット表情の顔アップ。唇の形が読みやすい。目元に切なさ。  
ネオンの反射が少し頬に乗る。  
口元可視を最優先にした静止フレームにする。
```

### bridge-06

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-studio-glow-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のスタジオ光を参照して生成する。  
スタジオでサビへ入る直前に真正面で構える、顔が大きく写るクローズアップ。口元が明確。  
黒金ヘッドホン、夜の東京の窓景色。  
王道のヒーローカットだが、表情は静かに保つ。
```

### bridge-07

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-river-bridge-stage-v01.png）`
3. `画像3（midnight-memory-ref-style-wet-reflection-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の川沿いブリッジステージと画像3の濡れた反射の質感を参照して生成する。  
サビの余韻へ入る直前に静かに息を溜める 3/4 クローズアップ。口元は隠さない。  
耳と髪に縁ライト、夜景が柔らかく滲む。  
洗練された静止フレームにする。
```

### bridge-08

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-river-bridge-stage-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2の川沿いブリッジステージと画像3のマスタールックを参照して生成する。  
長い Ah に入る直前のタイトクローズアップ。唇の形と顎の動きが分かる。  
金色の瞳、狐耳、背景は夜景の柔らかいボケだけ。  
リップシンクへ繋ぎやすい静止フレームにする。
```

### bridge-09

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `画像2（midnight-memory-ref-env-vocal-booth-night-v01.png）`
3. `画像3（midnight-memory-ref-style-master-v01.png）`

Prompt:
```text
画像1の狐娘を主役として固定し、画像2のボーカルブースと画像3のマスタールックを参照して生成する。  
エンディング直前の余韻を残して夜景スタジオに立つ、顔中心のミディアムクローズ。唇がまだ少し開いている。  
朝前の青い街を背景に、静かなラストフレームにする。
```

## 最後のメモ

- すべてのショットで [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png) を最優先に入れてください。
- 環境とスタイルはショットごとの `画像2` `画像3` に従ってください。
- 顔アップと口元可視が崩れたら、そのショットは採用しないほうが安全です。
- Negative には必ず `共通ネガティブ` を足してください。
