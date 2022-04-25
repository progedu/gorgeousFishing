"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fish = void 0;
var constants_1 = require("../constants");
var Resources_1 = require("../Resources");
/**
 * 魚クラス
 */
var Fish = /** @class */ (function () {
    function Fish(param) {
        /**
         * 泳ぐアニメーション用の Tween
         */
        this._swimTween = null;
        this._parent = param.parent;
        this._sprite = this._createSprite(param);
        this._parent.append(this._sprite);
        this._isCaptured = false;
        this._score = param.score;
        this._swimmingStyle = param.swimmingStyle;
        this._name = param.name;
        this._direction = param.direction;
        this._shake = param.shake;
        this._isInseki = param.isInseki;
        this._isGameOver = param.isGameOver;
        this._se = param.se;
        this._time = param.time;
    }
    Object.defineProperty(Fish.prototype, "isCaptured", {
        get: function () {
            return this._isCaptured;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fish.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fish.prototype, "score", {
        get: function () {
            return this._score;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fish.prototype, "isGameOver", {
        get: function () {
            return this._isGameOver;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fish.prototype, "se", {
        get: function () {
            return this._se;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fish.prototype, "time", {
        get: function () {
            return this._time;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fish.prototype, "area", {
        /**
         * 魚の当たり判定を返す
         */
        get: function () {
            return {
                width: this._sprite.width,
                height: this._sprite.height,
                x: this._sprite.x,
                y: this._sprite.y
            };
        },
        enumerable: false,
        configurable: true
    });
    Fish.prototype.destroy = function () {
        this._sprite.destroy();
    };
    /**
     * 釣られる
     */
    Fish.prototype.followHook = function (fishingRod, index) {
        var _this = this;
        // 魚の向きを回転
        this._sprite.anchorX = 0.5;
        this._sprite.anchorY = 0.5;
        if (this._direction == "right") {
            this._sprite.angle = 80;
        }
        if (this._direction == "left") {
            this._sprite.angle = -80;
        }
        if (this._sprite.scaleX >= 0) {
            this._sprite.angle *= -1;
        }
        this._sprite.modified();
        // 釣られる場所まで移動
        this._sprite.onUpdate.add(function () {
            var hooksArea = fishingRod.hooksArea;
            _this._sprite.x = index % 2 === 0 ? hooksArea[index].x : hooksArea[index].x + constants_1.HOOK_SIZE.width;
            _this._sprite.y = Math.min(hooksArea[index].y, _this._sprite.y);
            _this._sprite.modified();
        });
    };
    /**
     * 泳ぐ
     */
    Fish.prototype.swim = function () {
        var _this = this;
        var timeline = Resources_1.getResources().timeline;
        var toX = this._sprite.x < g.game.width / 2 ? g.game.width : -this._sprite.width;
        var toY = this._sprite.y;
        if (this._swimTween) {
            timeline.remove(this._swimTween);
        }
        if (this._isInseki) {
            this._sprite.scaleX = -1;
            this._sprite.x = g.game.width;
            this._sprite.y = Math.floor(Math.random() * 300) - 300;
            toX = Math.floor(Math.random() * 300) - 250;
            toY = g.game.height;
        }
        this._swimTween = timeline
            .create(this._sprite)
            .moveTo(toX, toY, this._swimmingStyle.swimTime)
            .call(function () { return _this._sprite.destroy(); });
        // 揺れ
        if (this._shake == "fast") {
            timeline
                .create(this._sprite, { loop: true })
                .rotateBy(10, 100)
                .rotateBy(-10, 100);
        }
        if (this._shake == "slow") {
            timeline
                .create(this._sprite, { loop: true })
                .rotateBy(20, 1000)
                .rotateBy(-20, 1000);
        }
    };
    /**
     * 泳ぎをやめる
     */
    Fish.prototype.stop = function () {
        this._isCaptured = true;
        if (this._swimTween) {
            Resources_1.getResources().timeline.remove(this._swimTween);
            this._swimTween = null;
        }
    };
    /**
     * 魚作成
     */
    Fish.prototype._createSprite = function (param) {
        var scaleX = 1;
        if (param.direction == "left") {
            scaleX *= -1;
        }
        if (param.swimmingStyle.pattern == "right_to_left") {
            scaleX *= -1;
        }
        if (param.direction == "front") {
            scaleX = 1;
        }
        var asset = param.parent.scene.asset.getImageById(param.resourceName);
        return new g.Sprite(__assign({ scene: param.parent.scene, src: asset, anchorX: null, anchorY: null, width: param.width, height: param.height ? param.height : param.width * asset.height / asset.width, srcWidth: asset.width, srcHeight: asset.height, scaleX: scaleX }, this._initialPos(param)));
    };
    /**
     * 初期位置生成
     */
    Fish.prototype._initialPos = function (param) {
        switch (param.swimmingStyle.pattern) {
            case "left_to_right":
                return { x: -constants_1.FISH_FONT_SIZE, y: param.swimmingStyle.depth };
            case "right_to_left":
                return { x: g.game.width, y: param.swimmingStyle.depth };
        }
    };
    return Fish;
}());
exports.Fish = Fish;
