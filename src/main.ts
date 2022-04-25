import { AssetConfigurationMap } from "@akashic/akashic-engine";
import { AudioPresenter } from "./AudioPresenter";
import { FieldScene } from "./FieldScene";
import { Global } from "./Global";
import { NumberFont } from "./NumberValue";
import { OuterParamReceiver } from "./OuterParamReceiver";
import { ResultScene } from "./ResultScene";
import { TitleScene } from "./TitleScene";

interface RPGAtsumaruWindow {
	RPGAtsumaru?: any;
}

declare const window: RPGAtsumaruWindow;

function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({game: g.game, assetIds: getAssetIds()});
	Global.init();
	Global.instance.isAtsumaru = typeof window !== "undefined" && typeof window.RPGAtsumaru !== "undefined";
	
	OuterParamReceiver.receiveParamFromMessage(scene);
	OuterParamReceiver.paramSetting();

	scene.onLoad.add(() => {
		AudioPresenter.initialize(scene);
		NumberFont.instance.initialize(scene);

		const title = new TitleScene(scene);
		const field = new FieldScene(scene);
		const result = new ResultScene(scene);

		title.finishCallback.push(() => {
			title.dispose();
			field.activate(scene);
		});
		field.finishCallback.push(() => {
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
	const assetIds = [];
	const assets = g.game._configuration.assets as AssetConfigurationMap;
	for (let assetId of Object.keys(assets)) {
		if (assets[assetId].type == "image" || assets[assetId].type == "audio" || assets[assetId].type == "text") {
			assetIds.push(assetId.toString())
		}
	}
	return assetIds;
}

export = main;
