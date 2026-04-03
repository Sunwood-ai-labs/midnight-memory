# Midnight Memory Nanobanana Prompt Pack

`nanobanana pro` へそのまま貼るための日本語 prompt pack です。  
主役は必ず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘に固定し、MV風の歌唱カット、顔アップ、口元可視、後段リップシンク対応を優先しています。

## Quick Start

1. まず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を読み込んで、参照画像 9 枚を先に作ります。
2. 次に各ショットで、指定順の参照画像を読み込み、ショット用 prompt を貼ります。
3. 同じ `model` / `preset` / `quality mode` / `seed 方針` を保ち、生成結果は [reference-parameter-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-parameter-log.template.csv) と [segment-render-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/segment-render-log.template.csv) へ記録します。

## 参照順ルール

- 基本順序: `momiji base -> mouth close or upper body -> environment -> style`
- 顔寄りショット: `momiji base -> mouth close -> environment -> style`
- 上半身ショット: `momiji base -> upper body -> environment -> style`

## 共通ネガティブ

```text
文字なし、ウォーターマークなし、読める看板ロゴなし、口元が隠れない、髪が口にかからない、マイクが唇を隠さない、極端な真横顔にしない、髪型を変えない、耳の形を変えない、尾の色を変えない、瞳の色を変えない、ヘッドホンのデザインを変えない、現代的な車を入れない、スマートフォンを入れない、LED看板の密集を入れない
```

## 参照画像用プロンプト

### 1. protagonist-mouth-close

参照入力:
1. `画像1（momiji-studio_0014.png）`

Prompt:
```text
画像1の狐娘と完全に同一人物の、歌唱用の顔アップ参照画像を作る。  
狐耳、琥珀色の長い髪、金色の瞳、黒金ヘッドホン、和モダン衣装の肩口を維持する。  
画角はタイトなクローズアップ。顔を大きく写し、唇と顎のラインがはっきり見える。正面寄りか柔らかい 3/4 角度。  
舞台は高級感のある夜のボーカルブース、背景は柔らかいスタジオボケ。  
暖かいスタジオキーライトに、東京の夜景の青い縁光を少し入れる。  
切ない city-pop バラードの雰囲気。  
絶対条件: 同じ狐娘の顔、耳、髪、瞳、衣装感を保つ。口元を明確に見せる。歌い出せる表情。文字なし、ウォーターマークなし。  
避ける: 極端な真横顔、前髪が唇にかかる構図、マイクが口元の前に来る構図。
```

### 2. protagonist-upperbody

参照入力:
1. `画像1（momiji-studio_0014.png）`

Prompt:
```text
画像1の狐娘と完全に同一人物の、上半身歌唱ポーズ参照画像を作る。  
狐耳、長い琥珀色の髪、金色の瞳、ふわっとした尾、和モダン衣装、黒金ヘッドホンを維持する。  
上半身が見える自然な歌唱ポーズ。肩から胸元まで見え、口元も確認できる。  
背景は上質な録音空間のボケ。  
暖かいスタジオ光と青い夜景の気配を混ぜ、ロマンティックな深夜ムードにする。  
絶対条件: 入力画像と同じ狐娘に見えること。衣装シルエットを崩さないこと。文字なし、ウォーターマークなし。  
避ける: 口元が隠れるポーズ、衣装シルエットの変化、アイドルライブの誇張ポーズ。
```

### 3. env-vocal-booth-night

Prompt:
```text
深夜の city-pop バラード MV に合う、夜景の見えるボーカルブース環境参照画像を作る。  
大きな窓の向こうに東京の夜景。コンデンサーマイク、少し横へ逃がしたポップガード、吸音材、ミキサーの柔らかいボケ。人物は入れない。  
狐娘の顔アップ歌唱カットを前景に置けるよう、中央を塞がず、口元の位置に機材が来ない構図にする。  
暖かいスタジオ光と深い夜景ブルーを共存させる。  
文字なし、ウォーターマークなし。  
避ける: 口元位置にポップガードが重なる構図、機材が密集しすぎた壁、安っぽい配信部屋感。
```

### 4. env-rooftop-stage

Prompt:
```text
深夜の city-pop MV に合う、屋上歌唱ステージの環境参照画像を作る。  
東京の夜景、濡れた床、控えめなパフォーマンス空間、上品な都市のシルエット。人物は入れない。  
狐娘の上半身歌唱カットを大きく置ける余白を前景に残す。  
青い夜風、アンバーの街明かり、抑えたロマンス。  
文字なし、ウォーターマークなし。  
避ける: 巨大な舞台装置、フェス照明、ロゴだらけの看板。
```

### 5. env-river-bridge-stage

Prompt:
```text
切ない city-pop MV の後半サビに合う、川沿いブリッジ歌唱ステージの環境参照画像を作る。  
東京の川沿い、濡れた床、欄干、遠くの光跡、水面反射。人物は入れない。  
顔アップと上半身歌唱の両方が自然に乗る構図にする。  
深い青、コバルト、アンバー、少し霞んだ夜気。  
文字なし、ウォーターマークなし。  
避ける: ただの高速道路っぽい空間、サイバーパンク過多、人物が小さくしか置けない遠すぎる構図。
```

### 6. env-glass-city

Prompt:
```text
深夜の city-pop MV に合う、ガラス越し都会空間の環境参照画像を作る。  
ガラス面、控えめなネオンの滲み、整った都会の反射、上質な都市空間。人物は入れない。  
顔アップ歌唱カットで唇と目が埋もれない程度に、反射は上品に整理する。  
青い都会光と柔らかい白色灯を混ぜる。  
文字なし、ウォーターマークなし。  
避ける: 反射が強すぎて顔が消える構図、昼のオフィスのような雰囲気。
```

### 7. style-master

Prompt:
```text
Midnight Memory の狐娘 MV 全体に共通する、マスタールック参照画像を作る。  
1980年代東京 city-pop MV の空気。深紺、コバルトブルー、温かいアンバー、少量のくすんだローズ。  
繊細な映画粒子、湿度を帯びた夜気、磨かれたハレーション。人物は入れない。  
スタジオ歌唱にも屋外歌唱にも共通で使える、統一感のある色温度にする。  
文字なし、ウォーターマークなし。  
避ける: サイバーパンク過多、平板な照明、明るすぎるアイドル色。
```

### 8. style-wet-reflection

Prompt:
```text
屋外歌唱カット用に、濡れた床とネオン反射の質感を固定するスタイル参照画像を作る。  
雨上がりの舗道やステージ床に、細長いネオン反射が上品に伸びる。人物は入れない。  
湿度感はあるが汚れすぎず、ロマンティックで洗練された質感にする。  
コバルト、深紺、アンバーを主に使う。  
文字なし、ウォーターマークなし。  
避ける: 水たまりの混沌、泥感、虹色に散る反射。
```

### 9. style-studio-glow

Prompt:
```text
スタジオ歌唱カット用に、暖色の室内光と青い夜景が共存するスタイル参照画像を作る。  
録音スタジオの暖かな光、窓外の深い青い夜、ガラスの柔らかいグロウ。人物は入れない。  
顔アップの歌唱カットに向く、上質で静かな MV 照明にする。  
文字なし、ウォーターマークなし。  
避ける: 強すぎるスポットライト、事務所の蛍光灯のような光。
```

## ショット用プロンプト

### intro-01

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップの顔バランス、画像3の夜景ボーカルブース、画像4のスタジオ光の雰囲気も参照する。  
夜景の見えるボーカルブースで歌い出す直前、もう声が始まりそうな口元を見せる MV カット。  
顔が大きく写るミディアムクローズ。口元がよく見える。黒金のヘッドホン、和モダン衣装、東京の夜景ボケ。  
静かな導入の雰囲気。リップシンクしやすいように唇と顎のラインを明確に見せる。
```

### intro-02

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3の夜景ボーカルブース、画像4のスタジオ光を参照する。  
スタジオで実際に歌い始めるクローズアップ。Ooh の母音が読みやすい口元。  
金色の瞳、琥珀色の長い髪、黒金ヘッドホン。マイクは脇へ寄せて唇を見せる。  
夜の東京の窓景色。city-pop MV の冒頭らしい、上質で切ない歌唱カット。
```

### intro-03

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-upperbody-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の上半身歌唱ポーズ、画像3の夜景ボーカルブース、画像4のマスタールックを参照する。  
夜景が大きく見えるスタジオ窓の前で歌う。上半身のミディアムショット。口元が見える。  
東京の街の光が背後で滲み、歌唱中の自然な表情が出ている。  
物語説明より、実際に歌っている MV パフォーマンスとして見せる。
```

### intro-04

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のスタジオ光を参照する。  
録音ブースの中で切なく歌う顔アップ。唇の動きがはっきり分かる。  
ヘッドホン、和柄衣装の肩口、柔らかいスタジオ機材のボケ。  
city-pop バラード MV の感情的な歌唱カットとして、目元と口元に余韻を乗せる。
```

### intro-05

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-upperbody-v01.png`
3. `midnight-memory-ref-env-rooftop-stage-v01.png`
4. `midnight-memory-ref-style-wet-reflection-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の上半身歌唱ポーズ、画像3の屋上ステージ、画像4の濡れた反射の質感を参照する。  
夜景の見える屋上ステージで歌う。風に揺れる髪と狐耳。口元がしっかり見えるミディアムクローズ。  
手持ちマイクは口を隠さない角度。濡れた床にネオンが反射する。  
MVらしい外ロケ歌唱カットとして、実際に歌っている自然さを優先する。
```

### intro-06

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-glass-city-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のガラス越し都会空間、画像4のマスタールックを参照する。  
ガラスに都会の反射が入る夜の空間で歌うクローズアップ。カメラ寄りの目線。唇が見える。  
ネオンの滲みを入れつつ、顔と口元は埋もれさせない。  
都会的で切ない MV 歌唱ショットにする。
```

### intro-07

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のスタジオ光を参照する。  
ボーカルブースで囁くように歌う超クローズアップ。唇と顎のラインがきれいに見える。  
静かな痛みを含んだ表情。柔らかいスタジオの暗さ。  
後段のリップシンクに使いやすい、口元重視の MV カットにする。
```

### intro-08

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のスタジオ光を参照する。  
夜景を背にしてサビを歌う、正面寄りのクローズアップ。口元が明確。  
金色の瞳、狐耳、ヘッドホン。切なくも少し華やかな city-pop バラード MV のヒーローカット。  
顔を大きく、唇を隠さず見せる。
```

### intro-09

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のマスタールックを参照する。  
歌い終わりの余韻を残して静かに息を吐く、顔中心のミディアムクローズ。唇が見える。  
夜景スタジオの残光を背に、次の展開へつながる余韻を持たせる。  
MV の流れを切らない、呼吸の見えるカットにする。
```

### bridge-01

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のスタジオ光を参照する。  
後半の始まり、夜景スタジオで集中した表情のミディアムクローズ。歌い出す直前で口元が見える。  
黒金ヘッドホン、深夜の city-pop MV の後半導入として、静かな緊張感を出す。
```

### bridge-02

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-upperbody-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-wet-reflection-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の上半身歌唱ポーズ、画像3の川沿いブリッジステージ、画像4の濡れた反射の質感を参照する。  
川沿いのブリッジステージでハミング気味に歌う。口元が読めるタイトミディアム。  
濡れた床、水面の反射、夜景のボケ。  
ロマンティックで切ない MV パフォーマンスカットにする。
```

### bridge-03

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3の川沿いブリッジステージ、画像4のマスタールックを参照する。  
川沿いの夜景ステージで歌い上げるクローズアップ。口元が明確。  
背景に水面と都市の光の波。金色の瞳に感情が乗っている。  
Midnight Memory のサビ前に合う、顔主体の MV カットにする。
```

### bridge-04

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-glass-city-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のガラス越し都会空間、画像4のマスタールックを参照する。  
ガラス越しの都会空間でカメラへ向かって歌う正面クローズアップ。唇がよく見える。  
ガラスにネオンの滲みを入れつつ、顔ははっきり見せる。  
切ない呼びかけの感情を乗せた上質な MV 歌唱ショットにする。
```

### bridge-05

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-glass-city-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のガラス越し都会空間、画像4のマスタールックを参照する。  
感情を抑えながら歌う顔アップ。唇の形が読みやすい。目元に切なさ。  
ネオンの反射が少し頬に乗る。静かな痛みのある city-pop MV カット。  
口元可視を最優先にする。
```

### bridge-06

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のスタジオ光を参照する。  
スタジオでサビを真正面から歌う、顔が大きく写るクローズアップ。口元が明確。  
黒金ヘッドホン、夜の東京の窓景色。  
Stay forever in my heart に合う王道の MV ヒーローショットにする。
```

### bridge-07

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-wet-reflection-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3の川沿いブリッジステージ、画像4の濡れた反射の質感を参照する。  
サビの余韻を伸ばして歌う 3/4 クローズアップ。口元は隠さない。  
耳と髪に縁ライト、夜景が柔らかく滲む。  
洗練された MV の歌唱カットにする。
```

### bridge-08

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3の川沿いブリッジステージ、画像4のマスタールックを参照する。  
長い Ah を歌い続けるタイトクローズアップ。唇の形と顎の動きが分かる。  
金色の瞳、狐耳、背景は夜景の柔らかいボケだけ。  
リップシンク向けの理想的な MV 歌唱カットにする。
```

### bridge-09

参照順:
1. `画像1（momiji-studio_0014.png）`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
画像1と同じ狐娘シンガー。  
画像2の口元アップ参照、画像3のボーカルブース、画像4のマスタールックを参照する。  
歌い終わった余韻を残して夜景スタジオに立つ、顔中心のミディアムクローズ。唇がまだ少し開いている。  
朝前の青い街を背景に、静かなエンディングを感じる MV ラストカットにする。
```

## 最後のメモ

- すべてのショットで [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を最優先に入れてください。
- 顔アップと口元可視が崩れたら、そのショットは採用しないほうが安全です。
- Negative には必ず `共通ネガティブ` を足してください。
