"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldScene = void 0;
var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");
var Global_1 = require("./Global");
var AudioPresenter_1 = require("./AudioPresenter");
var AStage_1 = require("./AStage");
var OuterParamReceiver_1 = require("./OuterParamReceiver");
var FishingRod_1 = require("./entity/FishingRod");
var Sea_1 = require("./entity/Sea");
var Resources_1 = require("./Resources");
var constants_1 = require("./constants");
var FieldScore_1 = require("./FieldScore");
var GameTimer_1 = require("./GameTimer");
var ReadyGo_1 = require("./ReadyGo");
var TimeOver_1 = require("./TimeOver");
var GameOver_1 = require("./GameOver");
var FieldPopupLabel_1 = require("./FieldPopupLabel");
// ここで全リアクションのリストを定義
var playerStatusMap = {
    "catch": {
        imageId: getRandomGozyasuAssetId(),
        voiceId: "revo",
        time: 2000
    },
    "zirai": {
        imageId: getRandomGozyasuAssetId(),
        voiceId: "mada",
        time: 2000
    }
};
var FieldScene = /** @class */ (function (_super) {
    __extends(FieldScene, _super);
    function FieldScene(_scene) {
        var _this = _super.call(this) || this;
        _this.isPlaying = false;
        /**
         * ドラゴンキューブ
         */
        _this.isDragoncube01Got = false;
        _this.isDragoncube02Got = false;
        _this.isDragoncube03Got = false;
        _this.score = 0;
        _this.readyGo = null;
        _this.scene = _scene;
        Resources_1.setResources({
            timeline: new akashic_timeline_1.Timeline(_scene),
            font: createFont(),
        });
        return _this;
    }
    FieldScene.prototype.activate = function (_scene) {
        var _this = this;
        /**
         * 釣り部分を作成
         */
        this.root = new g.E({ scene: _scene });
        this.scene.append(this.root);
        // アツマール環境の時だけ背景を出す
        if (Global_1.Global.instance.isAtsumaru) {
            createStage(this.root);
        }
        this.boatSprite = createBoatSprite(this.root);
        this.sea = createSea(this.root);
        this.fishingRod = createFishingRod(this.root);
        this.scene.onUpdate.add(function () {
            _this.step();
        });
        this.scene.onPointDownCapture.add(function () {
            _this.onPointDown();
        });
        /**
         * スコア部分を作成
         */
        var _sv = new FieldScore_1.FieldScore(_scene);
        _sv.init(_scene);
        this.scene.append(_sv.rootEntity);
        _sv.show(_scene, FieldScene.FIELDSCORE_POS_X, FieldScene.FIELDSCORE_POS_Y);
        _sv.value = this.score;
        this.scoreView = _sv;
        /**
         * タイマー部分を作成
         */
        var gt = Global_1.Global.instance.totalTimeLimit - FieldScene.TIMER_MERGIN;
        if (FieldScene.TIMER_MAX < gt) {
            gt = FieldScene.TIMER_MAX;
        }
        var t = new GameTimer_1.GameTimer(_scene);
        t.show(FieldScene.GAMETIMER_POS_X, FieldScene.GAMETIMER_POS_Y, gt);
        this.scene.append(t.rootEntity);
        this.timer = t;
        this.sea.setTimer(t);
        var _readygo = new ReadyGo_1.ReadyGo(_scene);
        this.readyGo = _readygo;
        this.scene.append(_readygo.rootEntity);
        _readygo.show().finishCallback.push(this.gameStartInit.bind(this));
    };
    FieldScene.prototype.gameStartInit = function () {
        var _this = this;
        var t = this.timer;
        this.start();
        t.start()
            .finishCallback.push(function () {
            if (!Global_1.Global.instance.DEBUG) {
                var _eff = new TimeOver_1.TimeOver(_this.scene);
                _this.scene.append(_eff.rootEntity);
                _eff.show(250, 500).finishCallback.push(function () {
                    _this.finish();
                });
            }
        });
        AudioPresenter_1.AudioPresenter.instance.playRandomBGM();
    };
    /**
     * ゲームを開始する
     */
    FieldScene.prototype.start = function () {
        this._startGame();
    };
    /**
     * ゲームを1フレーム進める
     */
    FieldScene.prototype.step = function () {
        if (!this.isPlaying)
            return;
        this.sea.checkFishOnHook(this.fishingRod);
    };
    /**
     * ゲーム終了
     */
    FieldScene.prototype.finish = function () {
        this.isPlaying = false;
        this.finishStage();
    };
    /**
     * タップしたときの処理
     */
    FieldScene.prototype.onPointDown = function () {
        var _this = this;
        if (!this.isPlaying)
            return;
        this.fishingRod.catchUp(function () {
            var pattern = _this.fishingRod.getFishingPattern(_this.sea.capturedFishList);
            var addScore = _this.calcScore(_this.sea.capturedFishList);
            // 時間が減る処理
            var changedTime = 0;
            // ドラゴンキューブ
            _this.sea.capturedFishList.forEach(function (fish) {
                if (fish.name == "ドラゴンキューブ01") {
                    _this.isDragoncube01Got = true;
                    displayDragonCube01(_this.root);
                }
                if (fish.name == "ドラゴンキューブ02") {
                    _this.isDragoncube02Got = true;
                    displayDragonCube02(_this.root);
                }
                if (fish.name == "ドラゴンキューブ03") {
                    _this.isDragoncube03Got = true;
                    displayDragonCube03(_this.root);
                }
            });
            if (_this.isDragoncube01Got && _this.isDragoncube02Got && _this.isDragoncube03Got) {
                addScore = 10000;
            }
            _this.sea.capturedFishList.forEach(function (fish) {
                if (fish.name == "宝箱") {
                    // 釣り針を増やす
                    _this.fishingRod.addHooks();
                }
            });
            // スコア表示処理
            _this.addScore(addScore);
            _this.sea.capturedFishList.forEach(function (fish) {
                // 一番時間が減るものを優先する
                if (fish.time !== 0 && fish.time < changedTime)
                    changedTime = fish.time;
            });
            _this.timer.changeTime(changedTime);
            // 時間に変更がある場合は減るもしくは増える時間の表示でそれ以外はスコア加算減算の表示
            var popupLabel, popupValue;
            if (changedTime !== 0 && changedTime > -99999) {
                popupLabel = new FieldPopupLabel_1.FieldPopupLabel(_this.scene, "red");
                popupValue = changedTime;
            }
            else if (addScore != 0) {
                popupLabel = new FieldPopupLabel_1.FieldPopupLabel(_this.scene);
                popupValue = addScore;
            }
            if (popupLabel) {
                popupLabel.init(_this.scene);
                _this.scene.append(popupLabel.rootEntity);
                popupLabel.value = popupValue;
                popupLabel.show(_this.scene, FieldScene.FIELD_POPUP_LABEL_POS_X, FieldScene.FIELD_POPUP_LABEL_POS_Y);
            }
            // ゲームオーバー判定
            var isGameOver = _this.sea.capturedFishList.filter(function (fish) { return fish.isGameOver; }).length > 0 ? true : false;
            if (isGameOver) {
                var gameOverEffect = new GameOver_1.GameOver(_this.scene);
                _this.scene.append(gameOverEffect.rootEntity);
                gameOverEffect.show(250, 500).finishCallback.push(function () {
                    _this.finish();
                    _this.timer.finishCallback.pop();
                    _this.timer.destroy();
                });
            }
            _this.reflectStatus(_this.getStatus(_this.sea.capturedFishList, addScore));
            _this.fishingRod.fishing(pattern);
            _this.sea.destroyCapturedFish();
        });
    };
    /**
     * ゲーム本編開始
     */
    FieldScene.prototype._startGame = function () {
        this.isPlaying = true;
        this.sea.startFishTimer();
    };
    FieldScene.prototype.dispose = function () {
        if (this.scene.destroyed()) {
            return;
        }
        this.scene.remove(this.root);
        this.scene.remove(this.timer.rootEntity);
        this.scene.remove(this.scoreView.rootEntity);
    };
    /**
     * スコアをセットする
     */
    FieldScene.prototype.setScore = function (score) {
        score = Math.min(score, 99999);
        this.score = score;
        Global_1.Global.instance.score = score;
    };
    /**
     * スコアの加算
     */
    FieldScene.prototype.addScore = function (score) {
        var newScore = this.score + score;
        // スコアがマイナスになると結果発表ページがバグるのでマイナスにならないようにする
        if (newScore < 0) {
            newScore = 0;
        }
        this.setScore(newScore);
        this.scoreView.value = this.score;
        OuterParamReceiver_1.OuterParamReceiver.setGlobalScore(this.score);
    };
    /**
     * 釣った魚からスコアを計算
     */
    FieldScene.prototype.calcScore = function (capturedFishList) {
        return capturedFishList.reduce(function (score, fish) { return score += fish.score; }, 0);
    };
    // リアクションリストのキーを返す。スコア等から取るべきリアクションを決める。
    FieldScene.prototype.getStatus = function (list, score) {
        return score >= 0 && list.length > 0 ? "catch" : null;
        // switch(fishingPattern) {
        // 	case "Stuck":
        // 		return "miss";
        // 	case "Default":
        // 		return score >= 10000 ? "big-catch" : null;
        // }
    };
    // 釣った時のリアクション
    FieldScene.prototype.reflectStatus = function (status) {
        var _this = this;
        if (status === null || !playerStatusMap[status]) {
            return;
        }
        // その状態に合ったボイスを出す
        AudioPresenter_1.AudioPresenter.instance.playSE(playerStatusMap[status].voiceId);
        return; // 画像の大きさ合わせが難しいのでいったん音声だけ
        // その状態に合った画像を出す
        var assetId = playerStatusMap[status].imageId;
        var beforeSurface = this.boatSprite._surface;
        this.boatSprite._surface = g.SurfaceUtil.asSurface(this.scene.asset.getImageById(assetId));
        this.boatSprite.modified();
        // 一定時間後に画像を戻す
        this.scene.setTimeout(function () {
            _this.boatSprite._surface = beforeSurface;
            _this.boatSprite.modified();
        }, playerStatusMap[status].time);
    };
    FieldScene.TIMER_MERGIN = 32;
    FieldScene.TIMER_MAX = 30;
    FieldScene.FIELDSCORE_POS_X = 552;
    FieldScene.FIELDSCORE_POS_Y = 0;
    FieldScene.FIELD_POPUP_LABEL_POS_X = 150;
    FieldScene.FIELD_POPUP_LABEL_POS_Y = 80;
    FieldScene.GAMETIMER_POS_X = 82;
    FieldScene.GAMETIMER_POS_Y = 4;
    return FieldScene;
}(AStage_1.AStage));
exports.FieldScene = FieldScene;
/**
 * フォントを作成
 */
function createFont() {
    return new g.DynamicFont({
        game: g.game,
        fontFamily: constants_1.FONT_FAMILY,
        size: constants_1.FONT_SIZE
    });
}
/**
 * 背景を作成
 */
function createStage(parent) {
    var imageAsset = parent.scene.asset.getImageById("bg_space");
    new g.Sprite({
        scene: parent.scene,
        src: imageAsset,
        width: g.game.width,
        height: g.game.height,
        parent: parent,
    });
}
/**
 * 舟のスプライトを作成
 */
function createBoatSprite(parent) {
    var asset = parent.scene.asset.getImageById(getRandomGozyasuAssetId());
    var width = 160;
    return new g.Sprite({
        scene: parent.scene,
        src: asset,
        width: width,
        height: width * asset.height / asset.width,
        srcWidth: asset.width,
        srcHeight: asset.height,
        x: 0,
        y: 60,
        parent: parent
    });
}
function getRandomGozyasuAssetId() {
    var gozyasuList = [
        "gozyasu_dm", "gozyasu_masakichi", "gozyasu_muxutube_danball", "gozyasu_muxutube_rocket",
        "gozyasu_nyanu", "gozyasu_odu", "gozyasu_ringomarknoa", "gozyasu_shinkeya", "gozyasu_ss"
    ];
    var index = Math.floor(gozyasuList.length * Math.random());
    return gozyasuList[index];
}
/**
 * 海を作成
 */
function createSea(parent) {
    return new Sea_1.Sea({ parent: parent });
}
/**
 * 釣竿を作成
 */
function createFishingRod(parent) {
    var fishingRod = new FishingRod_1.FishingRod({ parent: parent });
    return fishingRod;
}
function displayDragonCube01(parent) {
    var dragoncube01Asset = parent.scene.asset.getImageById("dragoncube01");
    var width = 30;
    new g.Sprite({
        scene: parent.scene,
        src: dragoncube01Asset,
        width: width,
        height: width * dragoncube01Asset.height / dragoncube01Asset.width,
        srcWidth: dragoncube01Asset.width,
        srcHeight: dragoncube01Asset.height,
        x: 200,
        y: 5,
        parent: parent
    });
}
function displayDragonCube02(parent) {
    var dragoncube02Asset = parent.scene.asset.getImageById("dragoncube02");
    var width = 30;
    new g.Sprite({
        scene: parent.scene,
        src: dragoncube02Asset,
        width: width,
        height: width * dragoncube02Asset.height / dragoncube02Asset.width,
        srcWidth: dragoncube02Asset.width,
        srcHeight: dragoncube02Asset.height,
        x: 250,
        y: 5,
        parent: parent
    });
}
function displayDragonCube03(parent) {
    var dragoncube03Asset = parent.scene.asset.getImageById("dragoncube03");
    var width = 30;
    new g.Sprite({
        scene: parent.scene,
        src: dragoncube03Asset,
        width: width,
        height: width * dragoncube03Asset.height / dragoncube03Asset.width,
        srcWidth: dragoncube03Asset.width,
        srcHeight: dragoncube03Asset.height,
        x: 300,
        y: 5,
        parent: parent
    });
}
