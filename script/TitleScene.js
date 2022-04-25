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
exports.TitleScene = void 0;
var AudioPresenter_1 = require("./AudioPresenter");
var AStage_1 = require("./AStage");
var TitleScene = /** @class */ (function (_super) {
    __extends(TitleScene, _super);
    function TitleScene(scene) {
        var _this = _super.call(this) || this;
        _this.scene = scene;
        return _this;
    }
    TitleScene.prototype.activate = function (_s) {
        var _this = this;
        var titleImageAsset = _s.asset.getImageById("title_mitta");
        var width = 480;
        var height = width * titleImageAsset.height / titleImageAsset.width;
        var title = new g.Sprite({
            scene: _s,
            src: titleImageAsset,
            width: width,
            height: height,
            srcWidth: titleImageAsset.width,
            srcHeight: titleImageAsset.height,
            x: (g.game.width - width) / 2,
            y: (g.game.height - height) / 2
        });
        this.title = title;
        AudioPresenter_1.AudioPresenter.instance.playRandomBGM();
        _s.onPointDownCapture.add(function () {
            _s.onPointDownCapture.removeAll();
            AudioPresenter_1.AudioPresenter.instance.playSE("se_002c");
            _s.setTimeout(function () {
                // 次のシーンへ行く
                _this.finishStage();
            }, 1000);
        });
        _s.append(title);
        this.scene = _s;
    };
    TitleScene.prototype.dispose = function () {
        if (!this.title.destroyed()) {
            this.title.destroy();
        }
    };
    return TitleScene;
}(AStage_1.AStage));
exports.TitleScene = TitleScene;
