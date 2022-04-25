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
exports.FishingRod = void 0;
var constants_1 = require("../constants");
var Resources_1 = require("../Resources");
/**
 * 釣り竿クラス
 */
var FishingRod = /** @class */ (function () {
    function FishingRod(param) {
        /**
         * スタック時のトリガー
         */
        this.onStuck = new g.Trigger();
        this._parent = param.parent;
        this._isCatching = false;
        this._isFishing = false;
        this._createRod();
        this._createRodString();
        this._hooks = [];
        var firstHook = this._createHook(0);
        this._parent.append(firstHook);
        this._hooks.push(firstHook);
    }
    Object.defineProperty(FishingRod.prototype, "isCatching", {
        get: function () {
            return this._isCatching;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FishingRod.prototype, "hooksArea", {
        get: function () {
            return this._hooks.map(function (hook) {
                return {
                    width: hook.width,
                    height: hook.height,
                    x: hook.x,
                    y: hook.y
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 釣り上げる
     */
    FishingRod.prototype.catchUp = function (finished) {
        var _this = this;
        if (this._isFishing || this._isCatching)
            return;
        this._isCatching = true;
        this._isFishing = true;
        var timeline = Resources_1.getResources().timeline;
        timeline.create(this._rodString).to({ height: constants_1.ROD_STRING_HEIGHT_WHEN_UP }, constants_1.FISHING_DURATION).wait(constants_1.FISHING_WAIT_DURATION);
        var isFinished = false;
        for (var i = 0; i < this._hooks.length; i++) {
            var hook = this._hooks[i];
            var pos = this._calcHookPositionWhenUp(i);
            timeline.create(hook).moveTo(pos.x, pos.y, constants_1.FISHING_DURATION).wait(constants_1.FISHING_WAIT_DURATION)
                .call(function () {
                if (isFinished)
                    return;
                isFinished = true;
                _this._isCatching = false;
                finished();
            });
        }
    };
    /**
     * 釣った魚からパターンを判定
     */
    FishingRod.prototype.getFishingPattern = function (capturedFishList) {
        var pattern = "Default";
        capturedFishList.forEach(function (fish) {
            if (pattern !== "Default")
                return;
            switch (fish.name) {
                case "くらげ":
                    pattern = "Stuck";
                    break;
            }
        });
        return pattern;
    };
    /**
     * パターンに従って釣りをする
     */
    FishingRod.prototype.fishing = function (pattern) {
        switch (pattern) {
            case "Default":
                this._swingDown();
                break;
            case "Stuck":
                this._stuck();
                break;
        }
    };
    /**
     * スコアに合わせて針の数を増減させる
     */
    FishingRod.prototype.addHooks = function () {
        var currentCount = this._hooks.length;
        var nextCount = currentCount + 1;
        if (nextCount > currentCount) {
            for (var i = currentCount; i < nextCount; i++) {
                var hook = this._createHook(i);
                this._hooks.push(hook);
                var pos = this._calcHookPositionWhenUp(i);
                hook.y = pos.y;
                this._parent.insertBefore(hook, this._hooks[i - 1]);
            }
        }
        else {
            for (var i = currentCount - 1; i >= nextCount; i--) {
                var hook = this._hooks.pop();
                this._parent.scene.remove(hook);
            }
        }
    };
    // 釣り上げ時の釣り針の位置を計算
    FishingRod.prototype._calcHookPositionWhenUp = function (index) {
        return {
            x: this._hooks[index] !== undefined ? this._hooks[index].x : 0,
            // 5で割っているのは適当。最大5本針でも自然に映ればそれでOK。あとなぜか若干糸と離れてしまっているため-3するという謎処理もしてしまっている。。
            y: constants_1.ROD_POS.y + constants_1.ROD_STRING_HEIGHT_WHEN_UP - Math.round(index * (constants_1.HOOKS_INTERVAL / 5)) - 3
        };
    };
    /**
     * 振り下ろす
     */
    FishingRod.prototype._swingDown = function () {
        var _this = this;
        var timeline = Resources_1.getResources().timeline;
        timeline.create(this._rodString).to({ height: constants_1.ROD_STRING_SIZE.height }, constants_1.FISHING_DURATION);
        for (var i = 0; i < this._hooks.length; i++) {
            var hook = this._hooks[i];
            timeline.create(hook).moveTo(hook.x, constants_1.HOOK_POS.y - constants_1.HOOKS_INTERVAL * i, constants_1.FISHING_DURATION).call(function () {
                _this._isFishing = false;
            });
        }
    };
    /**
     * スタックさせる
     */
    FishingRod.prototype._stuck = function () {
        var _this = this;
        this.onStuck.fire();
        // ${STUCK_DURATION} ミリ秒後に、スタックを解除し、釣竿を振り下ろす
        var timeline = Resources_1.getResources().timeline;
        timeline.create(this._rodString).wait(constants_1.STUCK_DURATION);
        var fnishWaiting = false;
        for (var _i = 0, _a = this._hooks; _i < _a.length; _i++) {
            var hook = _a[_i];
            timeline.create(hook).wait(constants_1.STUCK_DURATION).call(function () {
                if (fnishWaiting)
                    return;
                fnishWaiting = true;
                _this._swingDown();
            });
        }
    };
    /**
     * 釣竿を作成する
     */
    FishingRod.prototype._createRod = function () {
        new g.FilledRect(__assign(__assign(__assign({ scene: this._parent.scene, cssColor: constants_1.ROD_COLOR }, constants_1.ROD_SIZE), constants_1.ROD_POS), { anchorX: null, anchorY: null, angle: constants_1.ROD_ANGLE, parent: this._parent }));
    };
    /**
     * 釣り糸を作成する
     */
    FishingRod.prototype._createRodString = function () {
        this._rodString = new g.FilledRect(__assign(__assign(__assign({ scene: this._parent.scene, cssColor: constants_1.ROD_STRING_COLOR }, constants_1.ROD_STRING_SIZE), constants_1.ROD_STRING_POS), { parent: this._parent }));
    };
    /**
     * 釣り針を作成する
     */
    FishingRod.prototype._createHook = function (index) {
        var scene = this._parent.scene;
        var hook = new g.E(__assign(__assign({ scene: scene }, constants_1.HOOK_SIZE), { x: constants_1.HOOK_POS.x, y: constants_1.HOOK_POS.y - index * constants_1.HOOKS_INTERVAL }));
        var rect1 = new g.FilledRect({
            scene: scene,
            cssColor: constants_1.HOOK_COLOR,
            width: hook.width,
            height: constants_1.HOOK_BOLD,
            y: hook.height - constants_1.HOOK_BOLD,
            parent: hook
        });
        var rect2 = new g.FilledRect({
            scene: scene,
            cssColor: constants_1.HOOK_COLOR,
            width: constants_1.HOOK_BOLD,
            height: hook.height,
            parent: hook
        });
        if (index % 2 === 1) {
            hook.x += (constants_1.HOOK_SIZE.width - constants_1.ROD_STRING_SIZE.width);
            rect2.x = hook.width - constants_1.HOOK_BOLD;
        }
        return hook;
    };
    return FishingRod;
}());
exports.FishingRod = FishingRod;
