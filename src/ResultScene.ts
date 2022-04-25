import { SpriteFactory } from "./SpriteFactory";
import { NumberFont } from "./NumberValue";
import { Global } from "./Global";
import { AudioPresenter } from "./AudioPresenter";
import { Timeline } from "@akashic-extension/akashic-timeline";
import { AStage } from "./AStage";
import { OuterParamReceiver } from "./OuterParamReceiver";

export class ResultScene extends AStage {
	private scene: g.Scene;
	private frame: g.Sprite;
	private text: g.Label;

	private root: g.E;

	private scoreValue: number = 12;

	private animationTimer: g.TimerIdentifier;

	set val(v: number) {
		const _l = this.text;
		if (_l != null) {
			_l.text = v.toString();
			_l.invalidate();
			_l.x = 404 + (72) - (_l.width);
			_l.y = 162;
			_l.modified();
		}
	}

	constructor(scene: g.Scene) {
		super();
		this.scene = scene;
	}

	activate(scene: g.Scene) {

		// アツマール環境の時だけ背景を設定
		if (Global.instance.isAtsumaru) {
			const bg = new g.FilledRect(
				{
					scene: scene,
					width: scene.game.width,
					height: scene.game.height,
					cssColor: "#FFFFFF",
				});
			scene.append(bg);
			const imageAsset = scene.asset.getImageById("bg_space");
			const bg2 = new g.Sprite({
				scene: scene,
				src: imageAsset,
				width: g.game.width,
				height: g.game.height,
			});
			scene.append(bg2);
		}

		AudioPresenter.instance.stopBGM();

		const r = new g.E({
			scene: scene,
			width: scene.game.width,
			height: scene.game.height
		});

		OuterParamReceiver.setClearThreashold(1);
		const s = SpriteFactory.createSCOREFrame(scene);
		s.touchable = true;
		s.x = (scene.game.width - s.width) / 2;
		s.y = (scene.game.height - s.height) / 2;
		s.modified();

		const l = this.createScoreText(scene);
		r.append(s);
		r.append(l);

		l.text = Global.instance.score.toString();
		l.invalidate();
		l.x = 404 + (72) - (l.width);
		l.y = 162;
		l.modified();
		this.text = l;

		this.val = this.scoreValue = Global.instance.score;

		const _tl = new Timeline(scene);
		_tl.create(l, {modified: l.modified, destroyed: l.destroyed})
			.every(
				(e, p) => {
					if (1 <= p) {
						_tl.destroy();
						this.val = Global.instance.score;
						return;
					}

					const _min = 10 ** (this.text.text.length - 1); // **は べき乗との事
					const _max = 10 ** (this.text.text.length) - 1;
					const _v = Global.instance.random.get(_min, _max);
					this.val = _v | 0;
				},
				1500
			);

		r.onPointUp.add(
			() => {
				this.finishStage();
			},
			this
		);

		this.frame = s;
		scene.append(r);
		this.scene = scene;
		this.root = r;

		AudioPresenter.instance.playSE("jin_000");
	}

	dispose() {
		if (this.frame.destroyed()) {
			return;
		}
		this.frame.destroy();
		this.root.destroy();
	}

	private createScoreText(_s: g.Scene): g.Label {
		const nv = NumberFont.instance;
		return nv.genelateLabel72(_s);
	}
}
