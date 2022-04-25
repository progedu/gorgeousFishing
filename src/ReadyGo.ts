import { SpriteFactory } from "./SpriteFactory";
import { Timeline, Easing } from "@akashic-extension/akashic-timeline";
import { AudioPresenter } from "./AudioPresenter";

export class ReadyGo {

	rootEntity: g.E;
	finishCallback: Array<() => void> = new Array<() => void>();

	private _s: g.Scene;
	private ready: g.Sprite;
	private go: g.Sprite;

	constructor(scene: g.Scene) {
		this.rootEntity = new g.E({scene: scene});
		this._s = scene;
		const _r = SpriteFactory.createReady(this._s);
		_r.x = (scene.game.width - _r.width) / 2;
		_r.y = (scene.game.height - _r.height) / 2;
		_r.modified();
		_r.hide();
		const _g = SpriteFactory.createStart(this._s);
		_g.x = (scene.game.width - _g.width) / 2;
		_g.y = (scene.game.height - _g.height) / 2;
		_g.modified();
		_g.hide();

		this.rootEntity.append(_r);
		this.rootEntity.append(_g);

		this.ready = _r;
		this.go = _g;
	}

	show(): ReadyGo {
		AudioPresenter.instance.playSE("estar");
		this.ready.show();
		this.fadeAction(
			this._s,
			this.ready,
			500,
			250,
			() => {
				this.go.show();
				this.fadeAction(
					this._s,
					this.go,
					500,
					250,
					() => {
						this.finishCallback.forEach(x => x());
					});
			});
		return this;
	}

	fadeAction(_s: g.Scene, _es: g.Sprite, delay: number, stop: number, cb: () => void) {
		const tt = new Timeline(this._s);
		const _hdelay = delay / 2;
		_es.scale(0);
		_es.modified();

		if (0 < stop) {
			tt.create(_es, {modified: _es.modified, destroyed: _es.destroyed})
				.scaleTo(1, 1, _hdelay)
				.wait(stop)
				.fadeOut(_hdelay, Easing.easeOutQuad)
				.con()
				.scaleTo(1.5, 1.5, _hdelay)
				.every(
					(e, p) => {
						if (p <= 1) {
							if (cb != null) {
								cb.bind(this)();
							}
							if (!tt.destroyed()) {
								tt.destroy(); // 呼べる？
							}
						}
					},
					delay + stop
				);
		} else {
			tt.create(_es, {modified: _es.modified, destroyed: _es.destroyed})
				.scaleTo(1, 1, _hdelay)
				.fadeOut(_hdelay, Easing.easeOutQuad)
				.con()
				.scaleTo(1.5, 1.5, _hdelay)
				.every(
					(e, p) => {
						if (p <= 1) {
							if (cb != null) {
								cb.bind(this)();
							}
							tt.destroy(); // 呼べる？
						}
					},
					delay + stop
				);
		}
	}

	fadeInAction(_s: g.Scene, _es: g.Sprite, delay: number, cb: () => void) {
		const tt = new Timeline(this._s);
		tt.create(_es, {modified: _es.modified, destroyed: _es.destroyed})
		.fadeOut(delay, Easing.easeOutQuad)
		.every(
			(e, p) => {
				if (1 <= p) {
					if (cb != null) {
						cb.bind(this)();
					}
				}
			},
			delay
		);
	}

	fadeOutAction(_s: g.Scene, _es: g.Sprite, delay: number, cb: () => void) {
		const tt = new Timeline(this._s);
		tt.create(_es, {modified: _es.modified, destroyed: _es.destroyed})
		.fadeOut(delay, Easing.easeOutQuad)
		.every(
			(e, p) => {
				if (p <= 1) {
					if (cb != null) {
						cb.bind(this)();
					}
				}
			},
			delay
		);
	}

	destroy() {
		const arr = [ this.ready, this.go, this.rootEntity ];
		arr.forEach(x => {
			if (!x.destroyed()) {
				x.destroy();
			}
		});
	}
}
