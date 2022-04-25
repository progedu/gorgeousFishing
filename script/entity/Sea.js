"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sea = void 0;
var constants_1 = require("../constants");
var Fish_1 = require("./Fish");
var AudioPresenter_1 = require("./../AudioPresenter");
/**
 * 出現する魚の種類
 */
var fishInfoList = {
    "dragoncube01": { name: "ドラゴンキューブ01", width: 50, score: 1, direction: "front" },
    "dragoncube02": { name: "ドラゴンキューブ02", width: 50, score: 1, direction: "front" },
    "dragoncube03": { name: "ドラゴンキューブ03", width: 50, score: 1, direction: "front" },
    "fish_freelance": { name: "フリーランス", width: 100, score: 1000, direction: "left" },
    "fish_mixityan": { name: "みぃちゃんザウルス", width: 200, score: 50, speed: "very_slow" },
    "fish_ryouran": { name: "繚乱ちゃん", width: 50, score: 90000, speed: "very_fast", direction: "front" },
    "fish_takarabako": { name: "宝箱", width: 100, score: 0, direction: "left" },
    "fish_mint": { name: "ミント", width: 100, score: -1000, speed: "fast", direction: "left" },
    "fish_gadhirasu": { name: "ガディラス", width: 200, score: 10000, speed: "slow", direction: "front" },
    "fish_gonbirasu": { name: "ゴンビラス", width: 400, score: 99500, speed: "very_fast", direction: "front" },
    "fish_hurora": { name: "フローラ", width: 100, score: 10000, speed: "fast", direction: "left" },
    "fish_mixi": { name: "みぃちゃん", width: 100, score: -99999, direction: "left", shake: "fast", se: "mada" },
    "fish_madagasukaru": { name: "マダガスカル", width: 100, score: 1, speed: "fast", direction: "front" },
    "fish_wakusei": { name: "惑星", width: 100, score: 0, speed: "fast", direction: "front", time: -10 }
};
var firstStageFishKeys = [
    "fish_freelance",
    "fish_mixityan",
    "fish_mixityan",
    "fish_takarabako",
    "fish_takarabako",
    "fish_mint",
    "fish_mint",
    "fish_mint",
    "dragoncube01",
    "dragoncube02",
    "dragoncube03",
    "fish_hurora",
    "fish_mixi",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_wakusei",
    "fish_wakusei"
];
var secondStageFishKeys = [
    "fish_freelance",
    "fish_mixityan",
    "fish_mixityan",
    "fish_takarabako",
    "fish_takarabako",
    "fish_ryouran",
    "fish_mint",
    "fish_mint",
    "fish_mint",
    "dragoncube01",
    "dragoncube02",
    "dragoncube03",
    "fish_mixi",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_wakusei",
    "fish_wakusei",
    "fish_gadhirasu",
    "fish_hurora"
];
var thirdStageFishKeys = [
    "fish_freelance",
    "fish_mixityan",
    "fish_mixityan",
    "fish_takarabako",
    "fish_takarabako",
    "fish_mint",
    "fish_mint",
    "fish_mint",
    "dragoncube01",
    "dragoncube02",
    "dragoncube03",
    "fish_mixi",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_madagasukaru",
    "fish_gadhirasu",
    "fish_gonbirasu",
    "fish_wakusei",
    "fish_wakusei"
];
/**
 * 海クラス
 */
var Sea = /** @class */ (function () {
    function Sea(param) {
        this.capturedFishList = [];
        this._parent = param.parent;
        this._fishList = [];
    }
    /**
     * 残り時間を管理するタイマー(FieldSceneからもらう)
     */
    Sea.prototype.setTimer = function (timer) {
        this._timer = timer;
        this._maxTimeValue = timer.now;
    };
    /**
     * 定期的に魚を作成する
     */
    Sea.prototype.startFishTimer = function () {
        var _this = this;
        this._fishTimerIdentifier = this._parent.scene.setInterval(function () {
            var count = 2; // 出す魚の数
            for (var i = 1; i <= count; i++) {
                var fish = _this._createRandomFish(_this._parent);
                fish.swim();
                _this._fishList.push(fish);
            }
        }, constants_1.FISH_INTERVAL);
    };
    /**
     * タイマーをクリアする
     */
    Sea.prototype.clearFishTimer = function () {
        if (!this._fishTimerIdentifier)
            return;
        this._parent.scene.clearInterval(this._fishTimerIdentifier);
        this._fishTimerIdentifier = null;
    };
    /**
     * 釣り針と魚の当たり判定をチェックする
     */
    Sea.prototype.checkFishOnHook = function (fishingRod) {
        var _this = this;
        if (!this._fishList.length)
            return;
        if (!fishingRod.isCatching)
            return;
        this._fishList.forEach(function (fish) {
            // 釣り針と魚が当たっていた場合は釣り上げる
            var hooksArea = fishingRod.hooksArea;
            for (var i = 0; i < hooksArea.length; i++) {
                var area = hooksArea[i];
                if (g.Collision.intersectAreas(area, fish.area)) {
                    if (fish.isCaptured)
                        return;
                    fish.stop();
                    fish.followHook(fishingRod, i);
                    _this._fishList = _this._fishList.filter(function (item) { return item !== fish; });
                    _this.capturedFishList.push(fish);
                }
            }
        });
    };
    ;
    /**
     * 捕まえた魚たちを destroy する
     */
    Sea.prototype.destroyCapturedFish = function () {
        this.capturedFishList.forEach(function (capturedFish) {
            if (capturedFish.se) {
                AudioPresenter_1.AudioPresenter.instance.playSE(capturedFish.se);
            }
        });
        this.capturedFishList.forEach(function (capturedFish) { return capturedFish.destroy(); });
        this.capturedFishList = [];
    };
    /**
     * ランダムな魚を作成
     */
    Sea.prototype._createRandomFish = function (parent) {
        // 作成する魚の種類
        var fishKeys = this.getFishKeys();
        var fishIdx = Math.floor(g.game.random.generate() * fishKeys.length);
        var fishKey = fishKeys[fishIdx];
        var fishInfo = fishInfoList[fishKey];
        // 魚の泳ぎ方のパターン
        var pattern = Math.round(g.game.random.generate()) ? "right_to_left" : "left_to_right";
        // 魚が泳ぐ水深
        var asset = parent.scene.asset.getImageById(fishKey);
        var fishHeight = fishInfo.height ? fishInfo.height : fishInfo.width * asset.height / asset.width;
        var depth;
        if (fishInfo.depth == "deep") {
            // deepの場合は海底固定
            depth = g.game.height - fishHeight;
        }
        else {
            depth = constants_1.WATERSURFACE_POS.y + Math.floor(g.game.random.generate() * (g.game.height - constants_1.WATERSURFACE_POS.y - fishHeight + 1));
        }
        // 魚が泳ぐ速度(5段階)
        var speed = fishInfo.speed || "normal";
        // 魚が泳ぐ時間
        var swimTime = Math.floor(g.game.random.generate() * (constants_1.SWIMMING_TIME_RANGE[speed].max + 1)) + constants_1.SWIMMING_TIME_RANGE[speed].min;
        // 魚の向き
        var direction = fishInfo.direction || "right";
        // 隕石みたいに動くか
        var isInseki = fishInfo.isInseki || false;
        // 釣ったらゲームオーバーになるか
        var isGameOver = fishInfo.isGameOver || false;
        var time = fishInfo.time || 0;
        return new Fish_1.Fish({
            parent: parent,
            name: fishInfo.name,
            resourceName: fishKey,
            width: fishInfo.width,
            height: fishInfo.height,
            score: fishInfo.score,
            direction: direction,
            shake: fishInfo.shake,
            isInseki: isInseki,
            isGameOver: isGameOver,
            se: fishInfo.se,
            time: time,
            swimmingStyle: {
                pattern: pattern,
                depth: depth,
                swimTime: swimTime
            }
        });
    };
    /**
     * 現在のステージに合わせた魚のキー一覧を返します
     */
    Sea.prototype.getFishKeys = function () {
        var stage = this.calcStage();
        this._stage = stage;
        if (stage == "firstStage") {
            return firstStageFishKeys;
        }
        if (stage == "secondStage") {
            return secondStageFishKeys;
        }
        if (stage == "thirdStage") {
            return thirdStageFishKeys;
        }
    };
    /**
     * 現在の残り時間から今のステージを計算します
     * 現在は序盤(ファーストステージ)、中盤(セカンドステージ)、終盤（サードステージ）の3ステージ
     */
    Sea.prototype.calcStage = function () {
        if (this._timer.now >= Math.floor(this._maxTimeValue * 2 / 3)) {
            return "firstStage";
        }
        if (this._timer.now >= Math.floor(this._maxTimeValue * 1 / 3)) {
            return "secondStage";
        }
        return "thirdStage";
    };
    return Sea;
}());
exports.Sea = Sea;
