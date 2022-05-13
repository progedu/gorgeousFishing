# 超ゴージャス魚つり

[超会議2022 N予備校特別番組「ゴー☆ジャスPのゲーム開発レボリューション!!」](https://live.nicovideo.jp/watch/lv336228628)で制作した魚釣りゲームです。
こちらのゲームは、[Akashicサンプルカタログ](https://akashic-contents.github.io/samples/)の[つりっくま風ゲーム](https://akashic-contents.github.io/samples/game/tsurikkuma-style-game-ts.html)
をベースに制作されました。

# ニコニコ生放送
https://live.nicovideo.jp/watch/lv336228628

# ゲームアツマール
https://game.nicovideo.jp/atsumaru/games/gm25468

# ゲームアツマール・ニコ生向けにzip出力

```
yarn zip
```

# 画像利用の方法
1. 画像ファイルをimage下に保存
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

# 音声利用の方法
1. 音声ファイルがmp3, mp4, wav形式のいずれかであれば、[complet-audio](https://github.com/akashic-games/complete-audio)を用いて、ogg形式とaac形式の2ファイルに変換します※1
1. 変換済みの2ファイルをaudio下に保存
1. `akashic scan asset` を実行し、音声を `game.json` に登録

1. 呼び出し方

```
// BGMの場合
AudioPresenter_1.AudioPresenter.instance.playBGM("bgm_130");
// SEの場合
AudioPresenter.instance.playSE("se_001a");
```

※1: mp3, mp4, wav以外の形式には対応していないため、その場合は別途手段でogg形式とaac形式の2ファイルに変換する必要があります

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

# 利用規約
下記内容に同意の上、公開されたデータをご利用ください。

- 本サイトで公開するゲームの素材（画像・音声）及びプログラムの著作権は、株式会社ドワンゴならびにゴー☆ジャスに帰属します。
- 本サイトで公開するゲームの素材及びプログラムを利用して作成されたゲームを投稿することは、ご遠慮ください。
- ただし、ニコニコ超会議2022で寄せられた素材については、素材の作者本人の許可があれば、利用をすることが可能です。

