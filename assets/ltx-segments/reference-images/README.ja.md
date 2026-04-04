# Reference Images

このフォルダは `nanobanana pro` 用の固定参照画像置き場です。

- 主役固定の最優先参照: [momiji-studio_0014.png](/D:/midnight-memory/assets/ltx-segments/reference-images/character/momiji-studio_0014.png)
- 運用詳細: [midnight-memory-nanobanana-reference-workflow.ja.md](/D:/midnight-memory/assets/ltx-segments/midnight-memory-nanobanana-reference-workflow.ja.md)
- 参照 pack 管理: [reference-pack.manifest.json](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-pack.manifest.json)
- 参照画像ログ: [reference-parameter-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/reference-parameter-log.template.csv)
- セグメント出力ログ: [segment-render-log.template.csv](/D:/midnight-memory/assets/ltx-segments/reference-images/segment-render-log.template.csv)
- ロケーション固定マスター保存先: [location-masters/README.ja.md](/D:/midnight-memory/assets/ltx-segments/reference-images/location-masters/README.ja.md)

この版では `character`、`environment`、`style`、`location-masters` の 4 層で参照を管理します。  
通常運用では、まず `画像1 = character`、`画像2 = environment`、`画像3 = style-master` から `location-master` を作り、その後 `画像1 = character` と `画像2 = location-master` で最終ショットを作ります。
