import { SpriteFactory } from "./SpriteFactory";
import { Timeline } from "@akashic-extension/akashic-timeline";
import { AudioPresenter } from "./AudioPresenter";

export class GameOver {

	rootEntity: g.E;
	finishCallback: Array<() => void> = new Array<() => void>();

	private _s: g.Scene;
	private gameOver: g.Sprite;

	constructor(_s: g.Scene) {
		this._s = _s;
		this.rootEntity = new g.E({scene: _s});

		const _t = SpriteFactory.createGameOver(_s);

		_t.x = (_s.game.width - _t.width) / 2;
		_t.y = (_s.game.height - _t.height) / 2;
		_t.modified();
		_t.hide();

		this.gameOver = _t;

		this.rootEntity.append(_t);
	}

	show(intime: number, wait: number): GameOver {
		const tt = new Timeline(this._s);

		AudioPresenter.instance.stopBGM();
		AudioPresenter.instance.playSE("se_explosion");

		const _tu = this.gameOver;
		_tu.scale(1.5);
		_tu.opacity = 0;
		_tu.modified();
		_tu.show();

		tt.create(this.gameOver, { modified: this.gameOver.modified, destroyed: this.gameOver.destroyed})
			.scaleTo(1, 1, intime)
			.con()
			.fadeIn(intime)
			.wait(wait)
			.every(
				(e, p) => {
					if (1 <= p) {
						tt.destroy();
						this.finishCallback.forEach(c => c());
						_tu.hide();
					}
				},
				(intime + wait)
			);

		return this;
	}
}
