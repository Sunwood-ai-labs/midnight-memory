# Midnight Memory Scene Prompts

`assets/ltx-segments` の各セグメントに対して、`nanobanana pro` で使うことを前提にした MV 風の歌唱カット案です。今回の版では、[momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘キャラクターを主役に固定し、後段のリップシンクを想定して「顔が大きく写る」「口元が見える」「実際に歌っているように見える」ことを優先しています。

## Global Visual Bible

- 主役: [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) の狐娘。琥珀寄りの長い髪、狐耳、ふわっとした尾、金色の瞳、和柄寄りの衣装、黒金系ヘッドホン。
- キャラクター固定要素: 顔立ち、耳の形、髪色、前髪、瞳色、尾の色、衣装の和モダン感、ヘッドホンの質感。
- MV の方向: 物語説明より「深夜の city-pop バラードを狐娘シンガーが歌う」パフォーマンス MV。
- 場所の方向: 録音スタジオ、夜景の見えるボーカルブース、ネオンの見える屋上ステージ、川沿いブリッジステージ、ガラス越しの都会空間。
- 感情の運び方: 歌詞の切なさは、表情、口元、視線、光、夜景、湿度感で表現する。別キャラを無理に出さなくてもよい。
- 共通パレット: 深紺、コバルトブルー、アンバー、温かいスタジオ光、少量のローズ。彩度は高すぎず、映画粒子あり。

## MV Camera Rules

- 基本は `ミディアムクローズ` から `クローズアップ` を主軸にします。
- リップシンク想定のため、顔は画面の `35% 以上` を目安に写します。
- 口元は前髪、マイク、ポップガード、手、袖で隠しすぎないようにします。
- 角度は正面寄りか 3/4 までに留め、極端な真横顔は避けます。
- `[melody]` 区間でも、ハミング直前・息継ぎ・余韻として口元が読める絵を優先します。

## Lip Sync Note

- 口の形が追いやすいように、顎先から上唇までのラインを見せる構図を優先します。
- ポップガードを使う場合でも、唇にかからない位置へずらします。
- ハンドマイクを持つ場合は、マイクヘッドで口を完全に隠さない角度にします。
- 長い髪は口元にかけすぎないようにします。
- 目線は `カメラ寄り` または `少し外す` 程度にして、歌唱中の自然さを保ちます。

## Common Prompt Tail

各プロンプトの末尾には、必要に応じて次を足すと揃いやすいです。

`cinematic music video still, 16:9, close face performance shot, visible mouth for lip sync, singing expression, 1980s Tokyo city-pop mood, subtle film grain, no text, no watermark, no readable signage logos, no smartphone, no modern cars, no LED billboards, do not block the lips with microphone or hair`

## Timebase Note

- このファイルの `time_range` は、各 `*.ltx_segments.srt` のクリップ内ローカル時刻です。
- `*.main.srt` は歌詞の意味確認用で、`[melody]` を含まないぶん開始時刻が後ろにずれることがあります。
- カット設計は `ltx_segments.srt` の時間窓を基準にし、`main.srt` は歌詞ニュアンスの参照として使います。

## Nanobanana Pro Note

- このファイルの `image_prompt_ja` は「カット内容」の指示です。
- キャラ、スタジオ、街並み、テイストの固定は [midnight-memory-nanobanana-reference-workflow.ja.md](/D:/midnight-memory/assets/ltx-segments/midnight-memory-nanobanana-reference-workflow.ja.md) 側の参照画像セットで行います。
- 特に [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) は主役固定の最優先参照です。

## Intro - Chorus 1

### Segment 1

- `segment_id`: `1`
- `time_range`: `00:00:00,000 --> 00:00:08,300`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-intro-01.png`
- `scene_concept`: 夜景の見えるボーカルブースで、狐娘が歌い出す直前に息を整える導入カット。もう声が始まりそうな口元を見せる。
- `camera_framing`: 正面寄りのミディアムクローズ。
- `lighting_palette`: スタジオの温かい光、外の深いネイビー夜景、少量のアンバー。
- `image_prompt_ja`: `夜景の見える録音スタジオ、狐耳の少女シンガーがコンデンサーマイクの前で歌い出す直前、顔が大きく写るミディアムクローズ、口元がよく見える、黒金のヘッドホン、和モダン衣装、東京の夜景ボケ、静かな導入のMVカット`
- `avoid_notes`: `ポップガードで唇を隠さない、顔を小さくしない`

### Segment 2

- `segment_id`: `2`
- `time_range`: `00:00:08,300 --> 00:00:18,000`
- `lyric_or_vocal_focus`: `変わらない / Ooh / Ooh`
- `filename`: `midnight-memory-intro-02.png`
- `scene_concept`: スタジオで実際に歌い始める最初の歌唱カット。Ooh の母音が読みやすい口元を優先。
- `camera_framing`: 正面 3/4 のクローズアップ。
- `lighting_palette`: 温かいキーライト、夜景ブルー、耳と髪にアンバー。
- `image_prompt_ja`: `狐耳の少女シンガーがスタジオで歌っているクローズアップ、Ooh の口の形が分かる、金色の瞳、琥珀色の長い髪、黒金のヘッドホン、マイクは脇に寄せて唇が見える、夜の東京の窓景色、city-pop MVの冒頭`
- `avoid_notes`: `真横顔にしない、マイクを顔の中心に置かない`

### Segment 3

- `segment_id`: `3`
- `time_range`: `00:00:18,000 --> 00:00:28,460`
- `lyric_or_vocal_focus`: `[melody] / Ooh / Ooh / 変わらない街は今日も`
- `filename`: `midnight-memory-intro-03.png`
- `scene_concept`: 窓越しに都会を背負いながら歌う。スタジオと街が1カットで繋がる、MVらしい歌唱絵。
- `camera_framing`: 上半身までのタイトなミディアム。
- `lighting_palette`: 深紺、コバルト、やわらかいスタジオ光。
- `image_prompt_ja`: `夜景が大きく見えるスタジオ窓の前で歌う狐娘シンガー、上半身のミディアムショット、口元が見える、東京の街の光が背後で滲む、歌唱中の自然な表情、MVらしい上質なシネマカット`
- `avoid_notes`: `景色だけを主役にしない、顔が遠くならない`

### Segment 4

- `segment_id`: `4`
- `time_range`: `00:00:28,460 --> 00:00:40,060`
- `lyric_or_vocal_focus`: `誰かの記憶 / 忘れかけたメロディが / 心を揺らしてる`
- `filename`: `midnight-memory-intro-04.png`
- `scene_concept`: レコーディングブースで感情が入ってくる区間。歌詞の余韻が目元と口元に乗る繊細な歌唱カット。
- `camera_framing`: 顔中心のクローズアップ。
- `lighting_palette`: 温かいブース光、少量のローズ、夜景ブルー。
- `image_prompt_ja`: `録音ブースの中で切なく歌う狐娘の顔アップ、唇の動きがはっきり分かる、ヘッドホン、和柄衣装の肩口が少し見える、スタジオ機材のボケ、city-pop バラードMVの感情的な歌唱カット`
- `avoid_notes`: `涙を誇張しすぎない、口元を髪で隠さない`

### Segment 5

- `segment_id`: `5`
- `time_range`: `00:00:40,060 --> 00:00:52,460`
- `lyric_or_vocal_focus`: `ふとした瞬間 浮かんで / 今でもまだ消せなくて / 夜風が頬を撫でたとき`
- `filename`: `midnight-memory-intro-05.png`
- `scene_concept`: 夜風に当たる屋上ステージへ切り替わる。狐耳と髪が揺れる、外ロケの歌唱カット。
- `camera_framing`: 3/4 のミディアムクローズ。
- `lighting_palette`: 夜風の青、街灯アンバー、濡れた床の反射。
- `image_prompt_ja`: `夜景の見える屋上ステージで歌う狐娘シンガー、風に揺れる髪と狐耳、口元がしっかり見えるミディアムクローズ、手持ちマイクは口を隠さない角度、濡れた床にネオンが反射する、MVらしい外ロケ歌唱カット`
- `avoid_notes`: `風演出で前髪が口にかからないようにする`

### Segment 6

- `segment_id`: `6`
- `time_range`: `00:00:52,460 --> 00:01:01,460`
- `lyric_or_vocal_focus`: `名前を呼びそうになる / Midnight memory あなたの影が`
- `filename`: `midnight-memory-intro-06.png`
- `scene_concept`: ガラスの多い都会空間で、カメラへ寄りながら歌う。都会の反射が切なさを乗せる。
- `camera_framing`: 正面寄りクローズアップ。
- `lighting_palette`: 白色灯、青いネオン、やわらかい頬のハイライト。
- `image_prompt_ja`: `ガラスに都会の反射が入る夜の空間で歌う狐娘のクローズアップ、カメラ寄りの目線、唇が見える、ヘッドホンまたはイヤーモニタ風、ネオンの滲み、Midnight memory に合う都会的なMVカット`
- `avoid_notes`: `ガラス反射で顔が二重化しすぎない、唇をぼかさない`

### Segment 7

- `segment_id`: `7`
- `time_range`: `00:01:01,460 --> 00:01:12,060`
- `lyric_or_vocal_focus`: `胸の奥で揺れてる / Silent feeling 届かない / まだ感じてるの`
- `filename`: `midnight-memory-intro-07.png`
- `scene_concept`: ブース内の最も親密な歌唱カット。囁くように歌う口元を正確に見せる。
- `camera_framing`: 顔と口元重視のタイトクローズ。
- `lighting_palette`: 暗めの群青、温かい口元ライト。
- `image_prompt_ja`: `ボーカルブースで囁くように歌う狐娘シンガーの超クローズアップ、唇と顎のラインがきれいに見える、静かな痛みを含んだ表情、映画粒子、スタジオの柔らかい暗さ、リップシンク向けのMVカット`
- `avoid_notes`: `極端な被写界深度で口元をぼかさない`

### Segment 8

- `segment_id`: `8`
- `time_range`: `00:01:12,060 --> 00:01:20,060`
- `lyric_or_vocal_focus`: `Stay with me tonight / Stay forever in my heart`
- `filename`: `midnight-memory-intro-08.png`
- `scene_concept`: サビ入りのヒーローショット。夜景を背負って正面気味に歌い上げる。
- `camera_framing`: 正面寄りのヒロイックなクローズアップ。
- `lighting_palette`: 深い藍、アンバー、少量のローズ。
- `image_prompt_ja`: `夜景を背にしてサビを歌う狐娘シンガー、正面寄りのクローズアップ、口元が明確、金色の瞳、狐耳、ヘッドホン、city-pop バラードMVのヒーローカット、切なくも華やか`
- `avoid_notes`: `過剰なライブ照明にしない、表情を強くしすぎない`

### Segment 9

- `segment_id`: `9`
- `time_range`: `00:01:20,060 --> 00:01:30,800`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-intro-09.png`
- `scene_concept`: 歌い終わりの余韻を顔に残したまま視線を落とす。まだ完全には曲が終わっていないブレスカット。
- `camera_framing`: 顔中心のミディアムクローズ。
- `lighting_palette`: 深い青、アンバーの残光。
- `image_prompt_ja`: `歌い終わりの余韻を残して静かに息を吐く狐娘シンガー、顔中心のミディアムクローズ、唇が見える、夜景スタジオの残光、次の展開へつながるMVの余韻カット`
- `avoid_notes`: `完全な無表情にしない、顔を暗く沈めすぎない`

## Bridge - Final Chorus

### Segment 1

- `segment_id`: `1`
- `time_range`: `00:00:00,000 --> 00:00:08,793`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-bridge-01.png`
- `scene_concept`: 後半導入は夜景スタジオへ戻り、集中した表情で次の歌唱に入る直前を切る。
- `camera_framing`: ミディアムクローズ。
- `lighting_palette`: スタジオの暖色、外の夜明け前ブルー。
- `image_prompt_ja`: `後半の始まり、夜景スタジオで集中した表情の狐娘シンガー、歌い出す直前のミディアムクローズ、口元が見える、黒金ヘッドホン、city-pop MVの後半導入カット`
- `avoid_notes`: `導入だからといって人物を小さくしすぎない`

### Segment 2

- `segment_id`: `2`
- `time_range`: `00:00:08,793 --> 00:00:17,585`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-bridge-02.png`
- `scene_concept`: 川沿いブリッジステージで、ハミングのように息を含んで歌う。夜景と水面がMV感を作る。
- `camera_framing`: 3/4 のタイトミディアム。
- `lighting_palette`: 川面の青、ネオンのアンバー、薄い白い湿気。
- `image_prompt_ja`: `川沿いのブリッジステージでハミング気味に歌う狐娘シンガー、口元が読めるタイトミディアム、濡れた床、水面の反射、夜景のボケ、ロマンティックなMVパフォーマンスカット`
- `avoid_notes`: `欄干やマイクスタンドで口元を隠さない`

### Segment 3

- `segment_id`: `3`
- `time_range`: `00:00:17,585 --> 00:00:28,555`
- `lyric_or_vocal_focus`: `Midnight memory 光の波が / 遠く離れていても / Silent yearning 胸の奥で`
- `filename`: `midnight-memory-bridge-03.png`
- `scene_concept`: ブリッジステージで感情を乗せて歌う本格サビ前カット。光の波を背景の水面反射で見せる。
- `camera_framing`: 正面寄りのクローズアップ。
- `lighting_palette`: コバルト、水面アンバー、少量のローズ。
- `image_prompt_ja`: `川沿いの夜景ステージで歌い上げる狐娘シンガーのクローズアップ、口元が明確、背景に水面と都市の光の波、金色の瞳に感情が乗る、Midnight memory のサビ前MVカット`
- `avoid_notes`: `背景エフェクトを強くしすぎて顔を負けさせない`

### Segment 4

- `segment_id`: `4`
- `time_range`: `00:00:28,555 --> 00:00:37,525`
- `lyric_or_vocal_focus`: `今もあなたを呼んでる / Midnight memory あなたの影が`
- `filename`: `midnight-memory-bridge-04.png`
- `scene_concept`: ガラス越しの都会空間で、呼びかけるようにカメラへ向かって歌う。
- `camera_framing`: 正面クローズアップ。
- `lighting_palette`: 白色灯、青ネオン、ガラスハレーション。
- `image_prompt_ja`: `ガラス越しの都会空間でカメラへ向かって歌う狐娘シンガー、正面クローズアップ、唇がよく見える、ガラスにネオンの滲み、切ない呼びかけの感情、上質なMVの歌唱ショット`
- `avoid_notes`: `反射が強すぎて目と口を見失わないようにする`

### Segment 5

- `segment_id`: `5`
- `time_range`: `00:00:37,525 --> 00:00:48,515`
- `lyric_or_vocal_focus`: `胸の奥で揺れてる / Silent feeling 届かない / まだ感じてるの`
- `filename`: `midnight-memory-bridge-05.png`
- `scene_concept`: 後半でもっとも内省的な歌唱カット。顔を寄せ、静かに強い感情を見せる。
- `camera_framing`: タイトクローズ。
- `lighting_palette`: 深紺、アンバー、柔らかな肌ライト。
- `image_prompt_ja`: `感情を抑えながら歌う狐娘シンガーの顔アップ、唇の形が読みやすい、目元に切なさ、ネオンの反射が少し頬に乗る、静かな痛みのあるcity-pop MVカット`
- `avoid_notes`: `強い泣き演技にしない、被写界深度で口元を消さない`

### Segment 6

- `segment_id`: `6`
- `time_range`: `00:00:48,515 --> 00:01:00,225`
- `lyric_or_vocal_focus`: `[melody] / Stay forever in my heart x3`
- `filename`: `midnight-memory-bridge-06.png`
- `scene_concept`: サビ本体はスタジオのヒーロー歌唱。曲の代表カットになるように真正面から歌わせる。
- `camera_framing`: 正面のクローズアップ。
- `lighting_palette`: スタジオアンバー、夜景ブルー、ほんの少しのローズ。
- `image_prompt_ja`: `スタジオでサビを真正面から歌う狐娘シンガー、顔が大きく写るクローズアップ、口元が明確、黒金ヘッドホン、夜の東京の窓景色、Stay forever in my heart に合う王道MVヒーローショット`
- `avoid_notes`: `ポップガードを中央に置かない、顔を傾けすぎない`

### Segment 7

- `segment_id`: `7`
- `time_range`: `00:01:00,225 --> 00:01:10,500`
- `lyric_or_vocal_focus`: `[melody] / Stay forever in my heart / Ah / Ah / Ah`
- `filename`: `midnight-memory-bridge-07.png`
- `scene_concept`: Ah に向けて余韻を伸ばす。少し横に振りつつも、唇はしっかり見える歌唱カット。
- `camera_framing`: 3/4 クローズアップ。
- `lighting_palette`: 深い青、温かい縁ライト、夜景ボケ。
- `image_prompt_ja`: `サビの余韻を伸ばして歌う狐娘シンガー、3/4のクローズアップ、口元は隠さない、耳と髪に縁ライト、夜景が柔らかく滲む、洗練されたMVの歌唱カット`
- `avoid_notes`: `真横顔に寄せすぎない、髪で唇を隠さない`

### Segment 8

- `segment_id`: `8`
- `time_range`: `00:01:10,500 --> 00:01:21,000`
- `lyric_or_vocal_focus`: `Ah x7`
- `filename`: `midnight-memory-bridge-08.png`
- `scene_concept`: Ah の持続をそのままリップシンクに使えるよう、口の開きが読みやすい超主役カットにする。
- `camera_framing`: 正面寄りのタイトクローズ。
- `lighting_palette`: コバルト、白い湿気、薄いアンバー。
- `image_prompt_ja`: `長い Ah を歌い続ける狐娘シンガーのタイトクローズアップ、唇の形と顎の動きが分かる、金色の瞳、狐耳、背景は夜景の柔らかいボケだけ、リップシンク向けの理想的なMV歌唱カット`
- `avoid_notes`: `マイク、手、髪、尾などで顔周りをにぎやかにしすぎない`

### Segment 9

- `segment_id`: `9`
- `time_range`: `00:01:21,000 --> 00:01:33,720`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-bridge-09.png`
- `scene_concept`: 曲の最後はスタジオの窓辺で歌い終えた余韻を残す。まだMVの世界の中にいる終幕ショット。
- `camera_framing`: 顔中心のミディアムクローズ。
- `lighting_palette`: 夜明け前ブルー、温かいスタジオ残光。
- `image_prompt_ja`: `歌い終わった余韻を残して夜景スタジオに立つ狐娘シンガー、顔中心のミディアムクローズ、唇がまだ少し開いている、朝前の青い街、静かなエンディングを感じるMVラストカット`
- `avoid_notes`: `人物を引きすぎない、無表情で終わらせない`

## Usage Notes

- まずは [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/momiji-studio_0014.png) を主役固定の最優先参照として使ってください。
- 口パク重視なら、最初に `intro-02`, `intro-07`, `bridge-06`, `bridge-08` を作ると、使える顔アップの基準が掴みやすいです。
- 外ロケ感を出しても、歌唱主体であることは崩さず「マイクがある」「歌っている」「口元が見える」を優先してください。
- 曲に合う場所は、スタジオ、夜景窓、屋上、川沿いブリッジ、ガラス越し都会空間の5種類に絞ると MV 全体が散りにくいです。
