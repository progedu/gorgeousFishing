import { NumberFont } from "./NumberValue";
import { Timeline, Easing } from "@akashic-extension/akashic-timeline";

export class FieldPopupLabel {
	rootEntity: g.E;

	private label: g.Label;
	private font: NumberFont;
	private textColor: string;

	set value(_v: number) {
		this.label.text =  _v.toString();
		if (_v > 0) {
			this.label.text = "+" + this.label.text;
		}
		this.label.invalidate();

		this.label.modified();
	}

	constructor(_s: g.Scene, textColor?: string) {
		this.rootEntity = new g.E({scene: _s, x: 0, y: 0});
		this.textColor = textColor;
	}

	init(_s: g.Scene) {
		const _f = NumberFont.instance;
		const _l = _f.genelateLabel28(_s, this.textColor);
		this.label = _l;
		this.font = _f;
		this.rootEntity.append(_l);
	}

	dispose() {
		if (this.label.destroyed()) {
			return;
		}
		this.label.destroy();
		this.font.destroy();
	}

	show(_s: g.Scene, sx: number, sy: number) {
		const tl = new Timeline(_s);
		tl.create(this.rootEntity).fadeIn(100, Easing.easeInQuad).moveTo(sx, sy - 10, 300).fadeOut(1500, Easing.easeOutQuad);
		this.rootEntity.x = sx;
		this.rootEntity.y = sy;

		this.rootEntity.modified();
	}
}