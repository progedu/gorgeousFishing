import { NumberFont } from "./NumberValue";
import { SpriteFactory } from "./SpriteFactory";

export class FieldScore {
	rootEntity: g.E;

	private label: g.Label;
	private font: NumberFont;
	private pt: g.Sprite;

	set value(_v: number) {
		this.label.text = _v.toString();
		this.label.invalidate();

		const px = this.label.text.length * 28;
		this.label.x = this.pt.x - this.label.width;
		this.label.y = 5;
		this.label.modified();
	}

	constructor(_s: g.Scene) {
		this.rootEntity = new g.E({scene: _s, x: 0, y: 0});
	}

	init(_s: g.Scene) {
		const _f = NumberFont.instance;
		const _l = _f.genelateLabel28(_s);
		this.label = _l;
		this.font = _f;

		const _pt = SpriteFactory.createPtImage(_s);
		_pt.x = -(_pt.width);
		_pt.y = 10;
		_pt.modified();
		this.pt = _pt;
		this.rootEntity.append(_pt);
		this.rootEntity.append(_l);
	}

	dispose() {
		if (this.label.destroyed()) {
			return;
		}
		this.label.destroy();
		this.font.destroy();
		this.pt.destroy();
	}

	show(_s: g.Scene, sx: number, sy: number) {
		this.rootEntity.x = sx;
		this.rootEntity.y = sy;

		this.rootEntity.modified();
	}
}
