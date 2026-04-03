# Midnight Memory Scene Prompts

`assets/ltx-segments` の各セグメントに対して、歌詞とボーカルの温度感に合わせた「1セグメント = 1カット」の静止画案をまとめたメモです。画像生成前提で、同じ主人公・同じ夜・同じ記憶線を通す構成にしています。

## Global Visual Bible

- 主人公: 20代後半の女性。黒髪ボブ、薄いベージュのトレンチコート、深いネイビーの80sワンピース。常に同じシルエットで通す。
- 記憶の相手: 20代後半の男性。ダークコートまたはネイビーグレーの細身スーツ。基本は反射、遠景、半透明の影としてだけ現れる。
- 共通モチーフ: 雨粒、濡れた路面、窓ガラスの反射、橋の欄干、駅のガラス扉、古い時計、カセット/レコードの質感、列車の光跡。
- 共通パレット: 深紺、コバルトブルー、アンバーネオン、くすんだローズを少量。彩度は抑えめ、映画粒子あり。
- カメラ文法: ワイド確立 -> ミディアム観察 -> クローズ感情 -> ワイド余韻。
- 画づくりの制約: `16:9`、シネマティックな静止画、テキストなし、ウォーターマークなし、スマートフォンなし、現代LED広告なし、完全な再会ショットなし。

## Common Prompt Tail

各プロンプトの末尾には、必要に応じて次を足すと揃いやすいです。

`cinematic still, 16:9, 1980s Tokyo city-pop mood, wet street reflections, subtle film grain, restrained romantic melancholy, no text, no watermark, no readable signage logos, no smartphone, no modern cars, no LED billboards`

## Timebase Note

- このファイルの `time_range` は、各 `*.ltx_segments.srt` のクリップ内ローカル時刻をそのまま採用しています。
- `*.main.srt` は歌詞の意味確認用で、`[melody]` を含まないぶん開始時刻が後ろにずれることがあります。
- そのため、カット設計は `ltx_segments.srt` の時間窓を基準にし、`main.srt` は歌詞ニュアンスの参照として使う前提です。

## Nanobanana Pro Note

- `nanobanana pro` で人物を一貫させたい場合、このファイルの各 `image_prompt_ja` をそのまま単発生成に使わず、先に固定の参照画像セットを作ってからショット生成へ入る運用にしてください。
- 参照画像の作り方、推奨ファイル名、セグメントごとの添付マトリクスは [midnight-memory-nanobanana-reference-workflow.ja.md](/D:/midnight-memory/assets/ltx-segments/midnight-memory-nanobanana-reference-workflow.ja.md) に分離しています。
- 実運用では「このファイルの `image_prompt_ja` = カット内容」「参照ワークフロー側の画像 = 顔・髪・衣装・街並み・空気感の固定」と役割を分けるのが安全です。

## Intro - Chorus 1

### Segment 1

- `segment_id`: `1`
- `time_range`: `00:00:00,000 --> 00:00:08,300`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-intro-01.png`
- `scene_concept`: 夜明け前のアパート窓辺。主人公がまだ眠らない街を見つめ、これから記憶が動き出す直前の静けさを置く。
- `camera_framing`: 窓内と窓外を同居させたロングワイド。
- `lighting_palette`: 深いインクブルー、外のアンバー街灯、低コントラスト。
- `image_prompt_ja`: `1980年代東京の夜明け前、雨上がりの高架下と住宅街を見下ろす窓辺、黒髪ボブの女性が薄いトレンチコート姿で静かに立つ、窓ガラスにネオン看板と濡れた路面の反射、35mmシネマルック、静かなノスタルジー、ムード重視`
- `avoid_notes`: `モダン家電、スマートフォン、過剰なHDR、派手なネオン演出を避ける`

### Segment 2

- `segment_id`: `2`
- `time_range`: `00:00:08,300 --> 00:00:18,000`
- `lyric_or_vocal_focus`: `変わらない / Ooh / Ooh`
- `filename`: `midnight-memory-intro-02.png`
- `scene_concept`: 主人公が霧雨の残る路地へ一歩出る。変わらない街の反復を、同じ街灯と同じ看板の連なりで見せる。
- `camera_framing`: やや低い位置からの中景。
- `lighting_palette`: コバルトブルー主体、ローズの差し色は控えめ。
- `image_prompt_ja`: `霧雨が残る1980年代東京の路地、黒髪ボブの女性が雨の路面へ歩き出す、同じ街灯が反復する構図、濡れた地面にネオンが薄く映る、映画的シネマスティル、柔らかなグロウ、切ない都市の夜`
- `avoid_notes`: `単なるネオン壁紙にしない、現代的な道路設備や最新車両を入れない`

### Segment 3

- `segment_id`: `3`
- `time_range`: `00:00:18,000 --> 00:00:28,460`
- `lyric_or_vocal_focus`: `[melody] / Ooh / Ooh / 変わらない街は今日も`
- `filename`: `midnight-memory-intro-03.png`
- `scene_concept`: 駅ホール脇のガラスで、街と主人公と記憶が初めて重なる。男性の影はまだ遠景の反射だけ。
- `camera_framing`: 半身ミドルショット、反射を活かした二重構図。
- `lighting_palette`: 青系ベース、信号の赤とネオンの淡いローズ。
- `image_prompt_ja`: `1980年代の駅ホール脇のガラスドア、階段途中で立ち止まる黒髪の女性、雨粒で歪んだガラスに遠くの男性シルエットがほのかに重なる、35mm film grain、ローポートーン、city-pop映画の静止画`
- `avoid_notes`: `相手をはっきりした肖像で見せない、設備を現代的にしない`

### Segment 4

- `segment_id`: `4`
- `time_range`: `00:00:28,460 --> 00:00:40,060`
- `lyric_or_vocal_focus`: `誰かの記憶 / 忘れかけたメロディが / 心を揺らしてる`
- `filename`: `midnight-memory-intro-04.png`
- `scene_concept`: 小さなレコードショップのガラス越しに、忘れかけたメロディが戻る瞬間。記憶は店内の反射で揺れる。
- `camera_framing`: 店内奥行きを使った中景。
- `lighting_palette`: 琥珀ランプ、青い外光、ほんの少しのローズ。
- `image_prompt_ja`: `雨を背にした1980年代の街角レコードショップ、ガラス戸越しの女性の横顔、店内の古いジャケットとターンテーブルが微かな光を放つ、外の冷たいネオンと店内のアンバーが交差する、二重露光気味のシネマ静止画`
- `avoid_notes`: `現代的な店内什器、過剰なネオンボケ、情報過多な小物を避ける`

### Segment 5

- `segment_id`: `5`
- `time_range`: `00:00:40,060 --> 00:00:52,460`
- `lyric_or_vocal_focus`: `ふとした瞬間 浮かんで / 今でもまだ消せなくて / 夜風が頬を撫でたとき`
- `filename`: `midnight-memory-intro-05.png`
- `scene_concept`: 夜風が吹き抜ける分岐路で、髪とコート裾が揺れ、画面の端にだけ男性の背中の記憶が残る。
- `camera_framing`: 側方からのミディアム。
- `lighting_palette`: 青緑主体、白いハイライトは短く。
- `image_prompt_ja`: `風が抜ける繁華街の分岐路、薄いトレンチコートの女性が立ち止まり、夜風に髪が揺れる、濡れた舗道の反射、画面奥に男性の背影が一瞬だけ残像のように浮かぶ、抑制されたノスタルジックな映画静止画`
- `avoid_notes`: `相手を完全にフォーカスさせない、ゴースト演出を派手にしすぎない`

### Segment 6

- `segment_id`: `6`
- `time_range`: `00:00:52,460 --> 00:01:01,460`
- `lyric_or_vocal_focus`: `名前を呼びそうになる / Midnight memory あなたの影が`
- `filename`: `midnight-memory-intro-06.png`
- `scene_concept`: 駅構内で、呼ぼうとして呼べない息の瞬間を切り取る。相手はガラス面の影としてだけ現れる。
- `camera_framing`: 顔寄りのクローズ寄り中景。
- `lighting_palette`: 暗部を残した群青、古い照明の黄、少量のネオンローズ。
- `image_prompt_ja`: `夜の駅構内、反射ガラスの前でほんの一瞬だけ口を開きかける女性、目元と手元のわずかな震え、背景のガラスに男性の影が重なる、古い時計の赤い点灯、湿度を帯びた1980年代東京のシネマフレーム`
- `avoid_notes`: `大きな小道具を足さない、相手を実在の現在形として明確化しない`

### Segment 7

- `segment_id`: `7`
- `time_range`: `00:01:01,460 --> 00:01:12,060`
- `lyric_or_vocal_focus`: `胸の奥で揺れてる / Silent feeling 届かない / まだ感じてるの`
- `filename`: `midnight-memory-intro-07.png`
- `scene_concept`: 屋内の小さな明かりの下で、主人公が胸元に触れながら届かない感情を抱える。
- `camera_framing`: 胸元から顔半分までのタイトなクローズ。
- `lighting_palette`: 群青とアンバーの低彩度ミックス。
- `image_prompt_ja`: `1980年代の小さな部屋、窓際ランプと街の光が斜めに差し込む、女性が静かに胸元へ手を当てる、古い壁時計と小型ラジオ、重く繊細なシネマ写真、都市の赤青の気配をわずかに残す`
- `avoid_notes`: `泣き顔を誇張しない、完全モノクロにしない`

### Segment 8

- `segment_id`: `8`
- `time_range`: `00:01:12,060 --> 00:01:20,060`
- `lyric_or_vocal_focus`: `Stay with me tonight / Stay forever in my heart`
- `filename`: `midnight-memory-intro-08.png`
- `scene_concept`: 歩道橋脇で、主人公が相手の記憶へ静かに祈る最接近カット。鏡面の奥にだけ相手の輪郭が残る。
- `camera_framing`: 正面寄りのミディアム。
- `lighting_palette`: 深い藍、赤みを帯びたネオン、柔らかなキーライト。
- `image_prompt_ja`: `夜の歩道橋脇、黒髪の女性が空を見上げるように静かに立つ、鏡の反射に男性の輪郭が淡く残る、完全な再会ではなく未練を残した構図、1980s city-popの映画的色収差、湿度を帯びた高級感のある静止画`
- `avoid_notes`: `英語フレーズを文字として画面に載せない、相手の顔を完全露出しない`

### Segment 9

- `segment_id`: `9`
- `time_range`: `00:01:20,060 --> 00:01:30,800`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-intro-09.png`
- `scene_concept`: 河川沿いの街景へ引き、主人公だけが小さく歩いていく。記憶は消えず、夜だけが少し薄くなる。
- `camera_framing`: 上空寄りのロングショット。
- `lighting_palette`: 朝前の青、遠景だけアンバー残光。
- `image_prompt_ja`: `夜明け前の東京の河川沿い、濡れた道路に細い光帯、女性が遠景へ歩き去る、雨粒とガラス反射のモチーフを維持、淡いネオンを残したまま静止した街、余韻の強いシリアスな映画的スタイリング`
- `avoid_notes`: `明るい朝焼けにしない、次パートの余韻を切らない`

## Bridge - Final Chorus

### Segment 1

- `segment_id`: `1`
- `time_range`: `00:00:00,000 --> 00:00:08,793`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-bridge-01.png`
- `scene_concept`: 前半ラストと呼応するように、同じ街の橋へ戻る導入。主人公は小さく、夜景の光だけが波のように流れている。
- `camera_framing`: 低い位置からのワイドショット。
- `lighting_palette`: シアン反射、黒いコンクリート、遠景のアンバー。
- `image_prompt_ja`: `1980年代東京の川沿いの橋、雨上がりの濡れたアスファルト、黒髪の女性が欄干近くに小さく立つ、遠くの列車の光跡と都市ネオンが波のように流れる、抑制されたロマンティックノスタルジー、16mm film grain`
- `avoid_notes`: `高層ビルを現代的にしすぎない、派手なSF感を出さない`

### Segment 2

- `segment_id`: `2`
- `time_range`: `00:00:08,793 --> 00:00:17,585`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-bridge-02.png`
- `scene_concept`: 橋の路面に伸びる光と影を追い、記憶が届く直前の空気を見せる。主人公の顔はまだはっきり見せない。
- `camera_framing`: 足元と反射を拾う中望遠。
- `lighting_palette`: 蒼白いバックライト、濡れた路面のコバルト、赤い信号の点。
- `image_prompt_ja`: `雨を含んだ橋の路面、女性の足元から逆光で長い影が伸びる、ガラス面にぼんやりとした横顔、1980年代レトロネオンの夜、ビンテージ写真質感、静かな緊張感`
- `avoid_notes`: `俯瞰地図のような説明的構図、派手なエフェクト、顔の明るい正面写しを避ける`

### Segment 3

- `segment_id`: `3`
- `time_range`: `00:00:17,585 --> 00:00:28,555`
- `lyric_or_vocal_focus`: `Midnight memory 光の波が / 遠く離れていても / Silent yearning 胸の奥で`
- `filename`: `midnight-memory-bridge-03.png`
- `scene_concept`: 光の波と距離の痛みを1枚にまとめる。手前に主人公、遠くの列車窓や川面の反射に男性の影が揺れる。
- `camera_framing`: 遠景を圧縮する中望遠。
- `lighting_palette`: ネオンブルー、アンバー、白い雨粒ハイライト。
- `image_prompt_ja`: `夜の橋で手前に立つ黒髪の女性、遠景の列車窓と川面の反射の中に男性の影が揺れる、街灯の光が水面のような波紋を作る、1980年代日本のcity-popシネマスチル、距離の切なさ`
- `avoid_notes`: `相手を現実の同一空間に立たせない、強すぎるゴーストエフェクトを避ける`

### Segment 4

- `segment_id`: `4`
- `time_range`: `00:00:28,555 --> 00:00:37,525`
- `lyric_or_vocal_focus`: `今もあなたを呼んでる / Midnight memory あなたの影が`
- `filename`: `midnight-memory-bridge-04.png`
- `scene_concept`: ガラス扉の前で、声にならない呼びかけを止めた瞬間。男性の影だけが扉に重なる。
- `camera_framing`: 肩越しの中景。
- `lighting_palette`: 冷たい白色灯、コバルトネオン、反射面だけ少し明るく。
- `image_prompt_ja`: `雨で光る駅のガラス扉の前に立つ女性、扉に重なる男性の薄い輪郭、喉元に触れる手、車線の光が背景で流れる、静かで切迫した1980年代MVの1フレーム`
- `avoid_notes`: `文字入れ、過度なCG、説明的な感情アイコンを入れない`

### Segment 5

- `segment_id`: `5`
- `time_range`: `00:00:37,525 --> 00:00:48,515`
- `lyric_or_vocal_focus`: `胸の奥で揺れてる / Silent feeling 届かない / まだ感じてるの`
- `filename`: `midnight-memory-bridge-05.png`
- `scene_concept`: 届かない感情を身体に落とす。胸元に触れる手と、ガラスの外に残る相手の影だけで切なさを描く。
- `camera_framing`: 腰上のクローズ寄り。
- `lighting_palette`: 暗い群青、アンバー、金属的な青白いハイライト。
- `image_prompt_ja`: `駅アーケード下の夜、女性が胸元を押さえるクローズアップ、濡れた手すりとガラス面、外側に残る男性のぼやけた影、古い時計、ロマンティックノワール調の1980s東京`
- `avoid_notes`: `露骨な悲嘆演出、怪我や涙の誇張、デジタル表示の主張を避ける`

### Segment 6

- `segment_id`: `6`
- `time_range`: `00:00:48,515 --> 00:01:00,225`
- `lyric_or_vocal_focus`: `[melody] / Stay forever in my heart x3`
- `filename`: `midnight-memory-bridge-06.png`
- `scene_concept`: 感情のピーク。橋上に立つ主人公の周囲を、列車の光跡と雨粒が永遠の反復線のように取り囲む。
- `camera_framing`: 少し引いたワイド。
- `lighting_palette`: シアン、アンバー、薄い白いフォグ。
- `image_prompt_ja`: `橋の上で立ち尽くす黒髪の女性、背景を横切る列車の帯状光、対角線上に男性の残像がぼやけて重なる、長く尾を引く雨粒、1980年代歌謡バラードMVのような濡れた街の静止画`
- `avoid_notes`: `祝祭的に明るくしすぎない、LED広告を目立たせない`

### Segment 7

- `segment_id`: `7`
- `time_range`: `00:01:00,225 --> 00:01:10,500`
- `lyric_or_vocal_focus`: `[melody] / Stay forever in my heart / Ah / Ah / Ah`
- `filename`: `midnight-memory-bridge-07.png`
- `scene_concept`: 感情がほどけ始めるハーフクローズ。主人公は風に耐えるように肩を落とし、背後の光線だけが伸びる。
- `camera_framing`: 3/4アングルのハーフクローズ。
- `lighting_palette`: 深い藍、古い街灯の黄、少量のローズ。
- `image_prompt_ja`: `かすかな雨風の中、橋の欄干前で肩を落とす女性、斜め上から捉えた横顔、背景にはぼけた地下鉄入口と看板光、男性の記憶はガラスで半透明、レトロ写真フィルム調`
- `avoid_notes`: `大げさな涙エフェクト、コミカルな表情、鮮やかすぎる服色を避ける`

### Segment 8

- `segment_id`: `8`
- `time_range`: `00:01:10,500 --> 00:01:21,000`
- `lyric_or_vocal_focus`: `Ah x7`
- `filename`: `midnight-memory-bridge-08.png`
- `scene_concept`: 言葉が消え、音だけが残る時間。橋全体の距離感で二人の隔たりを見せ、相手は遠景のネオンへ溶けていく。
- `camera_framing`: 俯瞰寄りの中望遠。
- `lighting_palette`: 冷たい白、群青、遠景の金色。
- `image_prompt_ja`: `雨に濡れた夜の橋を上から見下ろす構図、画面中央下に小さく立つ女性、対岸のネオン群に男性の幻影が溶ける、ノイズとややソフトフォーカス、静止したAhの余韻を持つcity-popシネマフレーム`
- `avoid_notes`: `相手を実体化しすぎない、接触シーンにしない`

### Segment 9

- `segment_id`: `9`
- `time_range`: `00:01:21,000 --> 00:01:33,720`
- `lyric_or_vocal_focus`: `[melody]`
- `filename`: `midnight-memory-bridge-09.png`
- `scene_concept`: セグメント1と呼応するラスト。場所は同じだが少しだけ明るく、主人公が一歩だけ前に進む。
- `camera_framing`: ロングショット。
- `lighting_palette`: 深藍から薄白へ寄る夜明け直前、遠景だけ赤橙を残す。
- `image_prompt_ja`: `同じ橋の夜景に戻るラストフレーム、黒髪の女性が静かに歩き出す、男性の残像はほとんど透明、濡れたアスファルトが鏡のように街路灯を反射、夜明け前のわずかな明るさ、静かなエンディング`
- `avoid_notes`: `完全なハッピーエンドにしない、セグメント1の構図をそのままコピーしない`

## Usage Notes

- 最初に `Segment 1` か `Segment 2` を生成し、主人公の顔・髪型・衣装をリファレンス固定すると全体が崩れにくいです。
- 後半は前半より「橋」「ガラス扉」「列車の光跡」を増やすと、感情が外へ漏れていく感じが出ます。
- `[melody]` セグメントは説明的にせず、情景と距離感だけで感情を運ぶと楽曲に馴染みます。
- `Stay forever in my heart` の区間は、人物を増やすより光の反復と余白で見せるほうが上品です。
