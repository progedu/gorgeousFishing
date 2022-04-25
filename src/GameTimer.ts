import { SpriteFactory } from "./SpriteFactory";
import { NumberFont } from "./NumberValue";

export class GameTimer {

	private static readonly DISPLAY_MAX: number = 99;

	rootEntity: g.E;
	finishCallback: Array<() => void> = [];

	set Pause(v: boolean) {
		this.pause = v;
	}

	get Pause() {
		return this.pause;
	}

	private _s: g.Scene;
	private clockIcon: g.Sprite;
	private timer: g.Label;

	private numberValue: NumberFont;

	private timerValue: number;
	private timerEventIdentifier: g.TimerIdentifier;

	private countdownFinishCallback: () => void;

	private pause: boolean = false;

	private set tv(value: number) {
		let v = value;
		if (GameTimer.DISPLAY_MAX < v ) {
			v = GameTimer.DISPLAY_MAX;
		}

		this.timer.text = (v | 0).toString();
	}

	get now() {
		return this.timerValue | 0;
	}

	constructor(_s: g.Scene) {
		const ci = SpriteFactory.createClockIcon(_s);

		const nv = NumberFont.instance;

		const ti = nv.genelateLabel28(_s);

		const r = new g.E({
			scene: _s,
			x: 0,
			y: 0
		});
		r.append(ci);
		ti.x = ci.width;
		ti.y = 4;
		ti.modified();
		r.append(ti);

		r.hide();
		_s.append(r);

		this.clockIcon = ci;
		this.timer = ti;
		this.rootEntity = r;

		this._s = _s;
	}

	destroy() {
		if (!this.clockIcon.destroyed()) {
			this.clockIcon.destroy();
		}
	}

	show(px: number, py: number, startSecond: number) {
		this.clockIcon.show();
		this.tv = startSecond;
		this.timer.invalidate();

		this.rootEntity.x = px;
		this.rootEntity.y = py;
		this.rootEntity.modified();

		this.rootEntity.show();

		this.timerValue = startSecond;
	}

	changeTime(diff: number) {
		let changed = this.timerValue + diff;
		if (changed < 0) {
			changed = 0;
		}
		this.tv = changed;
		this.timer.invalidate();
		this.timerValue = changed;
	}

	start(): GameTimer {
		const _s = this._s;
		if (this.timerEventIdentifier != null) {
			_s.clearInterval(this.timerEventIdentifier);
		}
		const ev = _s.setInterval(
			() => {
				if (this.pause) {
					return;
				}
				this.timerValue--;
				if (0 <= this.timerValue) {
					this.tv = this.timerValue;
				}
				this.timer.invalidate();

				if (this.timerValue < 0) {
					if (this.timerEventIdentifier != null) {
						_s.clearInterval(this.timerEventIdentifier);
					}

					this.finishCallback.forEach(e => e());
				}
			},
			1000,
			this
		);
		this.timerEventIdentifier = ev;

		return this;
	}
}
