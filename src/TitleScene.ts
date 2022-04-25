import { AudioPresenter } from "./AudioPresenter";
import { AStage } from "./AStage";

export class TitleScene extends AStage {
	private scene: g.Scene;
	private title: g.Sprite;
	private start: g.Sprite;

	constructor(scene: g.Scene) {
		super();
		this.scene = scene;
	}

	activate(_s: g.Scene): void {
		const titleImageAsset = _s.asset.getImageById("title_mitta");
		const width = 480;
		const height = width * titleImageAsset.height / titleImageAsset.width;
		const title = new g.Sprite({
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

		AudioPresenter.instance.playRandomBGM();

		_s.onPointDownCapture.add(() => {
			_s.onPointDownCapture.removeAll();
			AudioPresenter.instance.playSE("se_002c");
			_s.setTimeout(
				() => {
					// 次のシーンへ行く
					this.finishStage();
				},
				1000
			);
		});
		_s.append(title);
		this.scene = _s;
	}

	dispose() {
		if (!this.title.destroyed()) {
			this.title.destroy();
		}
	}
}
