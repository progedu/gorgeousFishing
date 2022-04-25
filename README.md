# 超ゴージャス魚つり

つりっくまのような制限時間内に魚を釣るゲームを改造することで、オリジナルのゲームを作りました。

# ニコニコ生放送
https://live.nicovideo.jp/watch/lv336228628

# ゲームアツマール・ニコ生向けにzip出力

```
yarn zip
```

# 画像利用の方法
1. image下に保存
1. `akashic scan asset` を実行し、画像を `game.json` に登録

1. 呼び出し方

```
new g.Sprite({
    scene: scene, // sceneのオブジェクト
    src: scene.getImageById("fish_freelance"), // sceneのオブジェクトからassetsという形で呼び出します
    width: 100, // 表示サイズ(横)
    height: 100, // 表示サイズ(縦)
    srcWidth: 200, // 画像サイズ(横)
    srcHeight: 200, // 画像サイズ(縦)
    x: 10, // 表示座標
    y: 10, // 表示座標
    scaleX: -1, // 画像の拡大縮小 / ここをマイナスにすると画像が反転する
    scaleY: -1, // 画像の拡大縮小 / ここをマイナスにすると画像が反転する
    angle: 180 // 画像の傾き / ここで指定した角度に画像が回転する
});
```

# 音声収録・利用の方法
1. iPhoneのボイスレコーダーアプリで音声を収録(m4a形式)
1. https://convertio.co/ja/ にアクセスし、m4a形式のファイルをアップロード。ogg形式とaac形式に変換する
1. ogg形式とaac形式の2ファイルをダウンロードし、audio下に保存
1. `akashic scan asset` を実行し、音声を `game.json` に登録

1. 呼び出し方

```
// BGMの場合
AudioPresenter_1.AudioPresenter.instance.playBGM("bgm_130");
// SEの場合
AudioPresenter.instance.playSE("se_001a");
```

## 実行方法

以下のコマンドで実行できます。

```
npm install
npm run build
akashic-sandbox .
```

## ソースコード

- `script/main.ts`: 最初に実行されるコードです。
- `script/constants.ts`: ゲームで利用する定数がまとめられています。
- `script/entity/Sea.ts`: 海のエンティティです。次の機能が実装されています。
  - 出現する魚の管理
  - 一定間隔で魚を生成する処理
  - 生成した魚の管理
  - 魚と釣り針の当たり判定
- `script/entity/Fish.ts`: 魚のエンティティです。次の機能が実装されています。
  - 魚の描画
  - 泳ぐアニメーション
  - 釣られるアニメーション
- `script/entity/FishingRod.ts`: 釣り竿のエンティティです。次の機能が実装されています。
  - 釣り竿の描画
  - 釣るアニメーション
- `script/HUDManager.ts`: スコアや制限時間に関する機能が実装されています。
- `script/Resource.ts`: フォントや Timeline などゲーム全体で利用するリソースを保存します。
