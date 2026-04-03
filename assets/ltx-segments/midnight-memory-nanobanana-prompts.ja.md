# Midnight Memory Nanobanana Prompt Pack

`nanobanana pro` へそのまま貼るための prompt pack です。  
主役は必ず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘に固定し、MV風の歌唱カット、顔アップ、口元可視、後段リップシンク対応を優先しています。

## Quick Start

1. まず [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を読み込んで、参照画像 9 枚を先に作ります。
2. 次に各ショットで、指定順の参照画像を読み込み、ショット用 prompt を貼ります。
3. 同じ `model` / `preset` / `quality mode` / `seed 方針` を保ち、生成結果は [reference-parameter-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-parameter-log.template.csv) と [segment-render-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/segment-render-log.template.csv) へ記録します。

## Reference Order Rule

- 基本順序: `momiji base -> mouth close or upper body -> environment -> style`
- 顔寄りショット: `momiji base -> mouth close -> environment -> style`
- 上半身ショット: `momiji base -> upper body -> environment -> style`

## Common Negative

```text
no text, no watermark, no readable signage logos, no blocked lips, no hair over mouth, no microphone covering lips, no extreme side profile, no different hairstyle, no different ear shape, no different tail color, no different eye color, no different headphone design, no modern cars, no smartphone, no LED billboard clutter
```

## Reference Image Prompts

### 1. protagonist-mouth-close

Reference input:
1. `momiji-studio_0014.png`

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana character reference
Primary request: create a close face singing reference of the same fox-girl character from the input image for lip-sync-ready MV shots
Input images: Image 1: mandatory protagonist base reference
Scene/backdrop: premium night vocal booth, soft studio bokeh
Subject: the same fox-girl singer, amber long hair, fox ears, golden eyes, black-and-gold headphones, kimono-inspired modern outfit
Style/medium: high-end anime-cinematic illustration, music video key visual quality
Composition/framing: tight close-up, face large in frame, mouth and jawline clearly visible, near-front or soft 3/4 angle
Lighting/mood: warm studio key light with cool Tokyo night blue rim light, wistful city-pop ballad mood
Color palette: navy blue, amber, soft gold, subtle rose
Materials/textures: silky hair, soft fur ears and tail, polished headphone metal, smooth skin, subtle film grain
Constraints: keep the exact same fox-girl identity as the input; lips must be clearly visible; singing-ready expression; no text; no watermark
Avoid: no extreme side profile, no bangs over lips, no microphone in front of the mouth
```

### 2. protagonist-upperbody

Reference input:
1. `momiji-studio_0014.png`

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana character reference
Primary request: create an upper-body performance reference of the same fox-girl singer from the input image for music-video singing shots
Input images: Image 1: mandatory protagonist base reference
Scene/backdrop: premium recording space with soft bokeh
Subject: the same fox-girl singer, amber long hair, fox ears, golden eyes, fluffy tail, kimono-inspired modern outfit, black-and-gold headphones
Style/medium: high-end anime-cinematic illustration, polished MV still
Composition/framing: upper-body shot, natural singing pose, head and shoulders clear, mouth still visible
Lighting/mood: warm studio glow mixed with cool blue night accents, romantic midnight mood
Color palette: deep navy, amber, gold, a touch of rose
Materials/textures: soft fur, layered fabric, refined metallic headphone details, subtle film grain
Constraints: same face and outfit identity as the input image; performance-ready pose; no text; no watermark
Avoid: no blocked mouth, no different costume silhouette, no exaggerated idol concert pose
```

### 3. env-vocal-booth-night

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana environment reference
Primary request: create a night vocal booth environment for a city-pop ballad MV
Scene/backdrop: premium recording studio with a large window showing Tokyo night lights, condenser microphone, pop filter shifted slightly off-center, acoustic panels, console bokeh
Subject: empty environment only
Style/medium: high-end anime-cinematic illustration
Composition/framing: singer-friendly framing with usable foreground space for a face-close performance shot
Lighting/mood: warm studio light plus deep blue Tokyo night glow
Color palette: navy, amber, soft gold
Materials/textures: acoustic foam, glass reflections, metal microphone, soft film grain
Constraints: leave room for a large face close-up; no text; no watermark
Avoid: no centered pop filter blocking the future mouth area, no cluttered equipment wall
```

### 4. env-rooftop-stage

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana environment reference
Primary request: create a rooftop performance stage for a midnight city-pop MV
Scene/backdrop: Tokyo rooftop at night, wet reflective floor, subtle performance space, elegant city skyline
Subject: empty environment only
Style/medium: high-end anime-cinematic illustration
Composition/framing: enough foreground room for an upper-body singing shot
Lighting/mood: cool night wind, amber city lights, restrained romance
Color palette: cobalt blue, amber, night navy
Materials/textures: wet floor reflections, metal rails, soft haze
Constraints: MV-ready, classy, no text, no watermark
Avoid: no giant stage props, no festival lighting, no crowded skyline logos
```

### 5. env-river-bridge-stage

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana environment reference
Primary request: create a river bridge performance environment for the final chorus of a bittersweet city-pop MV
Scene/backdrop: Tokyo riverside bridge, wet surface, guard rails, distant light trails, water reflections
Subject: empty environment only
Style/medium: high-end anime-cinematic illustration
Composition/framing: face-close and upper-body singing shots should both fit naturally
Lighting/mood: melancholic midnight atmosphere, elegant reflected light, slightly misty air
Color palette: deep blue, cobalt, amber, faint silver
Materials/textures: wet asphalt, rail metal, water shimmer
Constraints: romantic but restrained, no text, no watermark
Avoid: no empty highway feel, no harsh cyberpunk clutter, no camera distance that makes the singer tiny
```

### 6. env-glass-city

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana environment reference
Primary request: create a glass-walled urban singing space for a late-night city-pop MV
Scene/backdrop: glass panels, subtle neon haze, clean city reflections, upscale urban interior
Subject: empty environment only
Style/medium: high-end anime-cinematic illustration
Composition/framing: suitable for close-up singing shots with visible lips and face
Lighting/mood: cool blue city reflection with soft white indoor light
Color palette: blue, silver, amber, faint rose
Materials/textures: glass reflections, soft halation, polished surfaces
Constraints: elegant, uncluttered, no text, no watermark
Avoid: no overwhelming reflections that hide the face, no office-daytime look
```

### 7. style-master

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana style reference
Primary request: create the master visual grade for a Midnight Memory fox-girl music video
Scene/backdrop: no specific location, just the overall look
Subject: abstract style board image, environment-only
Style/medium: high-end anime-cinematic city-pop MV look
Composition/framing: style reference board-like frame without text
Lighting/mood: wistful midnight romance, subtle melancholy, polished cinematic glow
Color palette: deep navy, cobalt blue, warm amber, soft gold, small amount of muted rose
Materials/textures: subtle film grain, humid night air, refined halation
Constraints: coherent across studio and outdoor shots; no text; no watermark
Avoid: no harsh cyberpunk, no flat lighting, no overly bright pop idol colors
```

### 8. style-wet-reflection

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana style reference
Primary request: create a wet reflection style reference for elegant city-pop MV outdoor shots
Scene/backdrop: rain-wet pavement or stage floor with slender neon reflections
Subject: environment-only style detail
Style/medium: high-end anime-cinematic illustration
Composition/framing: medium detail style plate
Lighting/mood: moody, humid, refined, romantic
Color palette: cobalt, navy, amber
Materials/textures: wet surfaces, reflected light, soft haze
Constraints: clean and elegant, no text, no watermark
Avoid: no puddle chaos, no gritty grime overload, no rainbow reflections
```

### 9. style-studio-glow

Prompt:
```text
Use case: stylized-concept
Asset type: nanobanana style reference
Primary request: create a studio glow style reference where warm interior light coexists with blue Tokyo night light
Scene/backdrop: recording studio lighting mood only
Subject: environment-only style detail
Style/medium: high-end anime-cinematic illustration
Composition/framing: style plate
Lighting/mood: warm and intimate inside, cool and nocturnal outside
Color palette: amber, soft gold, navy blue, deep cobalt
Materials/textures: glass glow, refined highlights, subtle grain
Constraints: ideal for close-up vocal MV shots, no text, no watermark
Avoid: no harsh spotlight concert look, no fluorescent office lighting
```

## Shot Prompts

### intro-01

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
狐耳の少女シンガーが夜景の見えるボーカルブースで歌い出す直前、もう声が始まりそうな口元を見せる MV カット。顔が大きく写るミディアムクローズ、口元がよく見える、黒金のヘッドホン、和モダン衣装、東京の夜景ボケ、静かな導入、cinematic music video still, visible mouth for lip sync
```

### intro-02

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
狐耳の少女シンガーがスタジオで実際に歌い始めるクローズアップ。Ooh の母音が読みやすい口元、金色の瞳、琥珀色の長い髪、黒金ヘッドホン、マイクは脇に寄せて唇を見せる、夜の東京の窓景色、city-pop MV の冒頭、cinematic music video still, visible lips
```

### intro-03

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-upperbody-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
夜景が大きく見えるスタジオ窓の前で歌う狐娘シンガー、上半身のミディアムショット、口元が見える、東京の街の光が背後で滲む、歌唱中の自然な表情、上質なシネマ MV カット、cinematic music video still
```

### intro-04

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
録音ブースの中で切なく歌う狐娘の顔アップ、唇の動きがはっきり分かる、ヘッドホン、和柄衣装の肩口が少し見える、スタジオ機材の柔らかいボケ、city-pop バラードMVの感情的な歌唱カット、close face performance shot
```

### intro-05

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-upperbody-v01.png`
3. `midnight-memory-ref-env-rooftop-stage-v01.png`
4. `midnight-memory-ref-style-wet-reflection-v01.png`

Prompt:
```text
夜景の見える屋上ステージで歌う狐娘シンガー、風に揺れる髪と狐耳、口元がしっかり見えるミディアムクローズ、手持ちマイクは口を隠さない角度、濡れた床にネオンが反射する、MVらしい外ロケ歌唱カット
```

### intro-06

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-glass-city-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
ガラスに都会の反射が入る夜の空間で歌う狐娘のクローズアップ、カメラ寄りの目線、唇が見える、ネオンの滲み、都会的で切ない MV 歌唱ショット、visible mouth for lip sync
```

### intro-07

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
ボーカルブースで囁くように歌う狐娘シンガーの超クローズアップ、唇と顎のラインがきれいに見える、静かな痛みを含んだ表情、柔らかなスタジオの暗さ、リップシンク向けの MV カット
```

### intro-08

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
夜景を背にしてサビを歌う狐娘シンガー、正面寄りのクローズアップ、口元が明確、金色の瞳、狐耳、ヘッドホン、city-pop バラードMVのヒーローカット、切なくも華やか
```

### intro-09

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
歌い終わりの余韻を残して静かに息を吐く狐娘シンガー、顔中心のミディアムクローズ、唇が見える、夜景スタジオの残光、次の展開へつながる MV の余韻カット
```

### bridge-01

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
後半の始まり、夜景スタジオで集中した表情の狐娘シンガー、歌い出す直前のミディアムクローズ、口元が見える、黒金ヘッドホン、city-pop MV の後半導入カット
```

### bridge-02

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-upperbody-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-wet-reflection-v01.png`

Prompt:
```text
川沿いのブリッジステージでハミング気味に歌う狐娘シンガー、口元が読めるタイトミディアム、濡れた床、水面の反射、夜景のボケ、ロマンティックな MV パフォーマンスカット
```

### bridge-03

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
川沿いの夜景ステージで歌い上げる狐娘シンガーのクローズアップ、口元が明確、背景に水面と都市の光の波、金色の瞳に感情が乗る、Midnight memory のサビ前 MV カット
```

### bridge-04

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-glass-city-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
ガラス越しの都会空間でカメラへ向かって歌う狐娘シンガー、正面クローズアップ、唇がよく見える、ガラスにネオンの滲み、切ない呼びかけの感情、上質な MV 歌唱ショット
```

### bridge-05

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-glass-city-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
感情を抑えながら歌う狐娘シンガーの顔アップ、唇の形が読みやすい、目元に切なさ、ネオンの反射が少し頬に乗る、静かな痛みのある city-pop MV カット
```

### bridge-06

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-studio-glow-v01.png`

Prompt:
```text
スタジオでサビを真正面から歌う狐娘シンガー、顔が大きく写るクローズアップ、口元が明確、黒金ヘッドホン、夜の東京の窓景色、Stay forever in my heart に合う王道 MV ヒーローショット
```

### bridge-07

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-wet-reflection-v01.png`

Prompt:
```text
サビの余韻を伸ばして歌う狐娘シンガー、3/4 のクローズアップ、口元は隠さない、耳と髪に縁ライト、夜景が柔らかく滲む、洗練された MV の歌唱カット
```

### bridge-08

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-river-bridge-stage-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
長い Ah を歌い続ける狐娘シンガーのタイトクローズアップ、唇の形と顎の動きが分かる、金色の瞳、狐耳、背景は夜景の柔らかいボケだけ、リップシンク向けの理想的な MV 歌唱カット
```

### bridge-09

Reference order:
1. `momiji-studio_0014.png`
2. `midnight-memory-ref-protagonist-mouth-close-v01.png`
3. `midnight-memory-ref-env-vocal-booth-night-v01.png`
4. `midnight-memory-ref-style-master-v01.png`

Prompt:
```text
歌い終わった余韻を残して夜景スタジオに立つ狐娘シンガー、顔中心のミディアムクローズ、唇がまだ少し開いている、朝前の青い街、静かなエンディングを感じる MV ラストカット
```

## Final Reminder

- すべてのショットで [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を最優先に入れてください。
- 顔アップと口元可視が崩れたら、そのショットは採用しないほうが安全です。
- Negative には必ず `Common Negative` を足してください。
