"use strict";
var AudioPresenter_1 = require("./AudioPresenter");
var FieldScene_1 = require("./FieldScene");
var Global_1 = require("./Global");
var NumberValue_1 = require("./NumberValue");
var OuterParamReceiver_1 = require("./OuterParamReceiver");
var ResultScene_1 = require("./ResultScene");
var TitleScene_1 = require("./TitleScene");
function main(param) {
    var scene = new g.Scene({ game: g.game, assetIds: getAssetIds() });
    Global_1.Global.init();
    Global_1.Global.instance.isAtsumaru = typeof window !== "undefined" && typeof window.RPGAtsumaru !== "undefined";
    OuterParamReceiver_1.OuterParamReceiver.receiveParamFromMessage(scene);
    OuterParamReceiver_1.OuterParamReceiver.paramSetting();
    scene.onLoad.add(function () {
        AudioPresenter_1.AudioPresenter.initialize(scene);
        NumberValue_1.NumberFont.instance.initialize(scene);
        var title = new TitleScene_1.TitleScene(scene);
        var field = new FieldScene_1.FieldScene(scene);
        var result = new ResultScene_1.ResultScene(scene);
        title.finishCallback.push(function () {
            title.dispose();
            field.activate(scene);
        });
        field.finishCallback.push(function () {
            field.dispose();
            result.activate(scene);
        });
        title.activate(scene);
    });
    g.game.pushScene(scene);
}
/**
 * ゲームが最初に読み込むべきアセットID一覧を返します
 */
function getAssetIds() {
    var assetIds = [];
    var assets = g.game._configuration.assets;
    for (var _i = 0, _a = Object.keys(assets); _i < _a.length; _i++) {
        var assetId = _a[_i];
        if (assets[assetId].type == "image" || assets[assetId].type == "audio" || assets[assetId].type == "text") {
            assetIds.push(assetId.toString());
        }
    }
    return assetIds;
}
module.exports = main;
