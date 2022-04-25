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
exports.ResultScene = void 0;
var SpriteFactory_1 = require("./SpriteFactory");
var NumberValue_1 = require("./NumberValue");
var Global_1 = require("./Global");
var AudioPresenter_1 = require("./AudioPresenter");
var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");
var AStage_1 = require("./AStage");
var OuterParamReceiver_1 = require("./OuterParamReceiver");
var ResultScene = /** @class */ (function (_super) {
    __extends(ResultScene, _super);
    function ResultScene(scene) {
        var _this = _super.call(this) || this;
        _this.scoreValue = 12;
        _this.scene = scene;
        return _this;
    }
    Object.defineProperty(ResultScene.prototype, "val", {
        set: function (v) {
            var _l = this.text;
            if (_l != null) {
                _l.text = v.toString();
                _l.invalidate();
                _l.x = 404 + (72) - (_l.width);
                _l.y = 162;
                _l.modified();
            }
        },
        enumerable: false,
        configurable: true
    });
    ResultScene.prototype.activate = function (scene) {
        var _this = this;
        // アツマール環境の時だけ背景を設定
        if (Global_1.Global.instance.isAtsumaru) {
            var bg = new g.FilledRect({
                scene: scene,
                width: scene.game.width,
                height: scene.game.height,
                cssColor: "#FFFFFF",
            });
            scene.append(bg);
            var imageAsset = scene.asset.getImageById("bg_space");
            var bg2 = new g.Sprite({
                scene: scene,
                src: imageAsset,
                width: g.game.width,
                height: g.game.height,
            });
            scene.append(bg2);
        }
        AudioPresenter_1.AudioPresenter.instance.stopBGM();
        var r = new g.E({
            scene: scene,
            width: scene.game.width,
            height: scene.game.height
        });
        OuterParamReceiver_1.OuterParamReceiver.setClearThreashold(1);
        var s = SpriteFactory_1.SpriteFactory.createSCOREFrame(scene);
        s.touchable = true;
        s.x = (scene.game.width - s.width) / 2;
        s.y = (scene.game.height - s.height) / 2;
        s.modified();
        var l = this.createScoreText(scene);
        r.append(s);
        r.append(l);
        l.text = Global_1.Global.instance.score.toString();
        l.invalidate();
        l.x = 404 + (72) - (l.width);
        l.y = 162;
        l.modified();
        this.text = l;
        this.val = this.scoreValue = Global_1.Global.instance.score;
        var _tl = new akashic_timeline_1.Timeline(scene);
        _tl.create(l, { modified: l.modified, destroyed: l.destroyed })
            .every(function (e, p) {
            if (1 <= p) {
                _tl.destroy();
                _this.val = Global_1.Global.instance.score;
                return;
            }
            var _min = Math.pow(10, (_this.text.text.length - 1)); // **は べき乗との事
            var _max = Math.pow(10, (_this.text.text.length)) - 1;
            var _v = Global_1.Global.instance.random.get(_min, _max);
            _this.val = _v | 0;
        }, 1500);
        r.onPointUp.add(function () {
            _this.finishStage();
        }, this);
        this.frame = s;
        scene.append(r);
        this.scene = scene;
        this.root = r;
        AudioPresenter_1.AudioPresenter.instance.playSE("jin_000");
    };
    ResultScene.prototype.dispose = function () {
        if (this.frame.destroyed()) {
            return;
        }
        this.frame.destroy();
        this.root.destroy();
    };
    ResultScene.prototype.createScoreText = function (_s) {
        var nv = NumberValue_1.NumberFont.instance;
        return nv.genelateLabel72(_s);
    };
    return ResultScene;
}(AStage_1.AStage));
exports.ResultScene = ResultScene;
