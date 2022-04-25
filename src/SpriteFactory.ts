export class SpriteFactory {
	static createTitle(_scene: g.Scene): g.Sprite {
		return SpriteFactory.createSpriteCore(_scene, "ui", 1, 289, 321, 519);
	}

	static createManual(_scene: g.Scene): g.Sprite {
		return SpriteFactory.createSpriteCore(_scene, "ui", 1, 614, 453, 866);
	}

	static createPictureFrame(_s: g.Scene) {
		return SpriteFactory.createSpriteCore(_s, "ui", 2, 2, 288, 288);
	}

	static createRemainPieceFrame(s: g.Scene): g.Sprite {
		return SpriteFactory.createSpriteCore(s, "ui", 289, 1, 489, 65);
	}

	static createSelectFrameL(s: g.Scene): g.Sprite {
		return SpriteFactory.createSpriteCore(s, "ui", 289, 66, 487, 264);
	}

	static createSelectFrameM(s: g.Scene): g.Sprite {
		return SpriteFactory.createSpriteCore(s, "ui", 490, 1, 656, 167);
	}

	static createSelectFrameS(s: g.Scene): g.Sprite {
		return SpriteFactory.createSpriteCore(s, "ui", 657, 1, 787, 131);
	}

	static createMaskL(s: g.Scene): g.Sprite[] {
		const uv: g.CommonRect[] = [
			{left:  87, top: 571, right: 129, bottom: 613},
			{left:   1, top: 571, right:  43, bottom: 613},
			{left: 130, top: 571, right: 172, bottom: 613},
			{left:  44, top: 571, right:  86, bottom: 613}
		];

		const sprT: g.Sprite[] = [];

		uv.forEach(x => {
			sprT.push(
				SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom)
			);
		});

		return sprT;
	}

	static createMaskM(s: g.Scene): g.Sprite[] {
		const uv: g.CommonRect[] = [
			{left:  1, top: 542, right:  29, bottom: 570},
			{left: 30, top: 542, right:  58, bottom: 570},
			{left: 88, top: 542, right: 116, bottom: 570},
			{left: 59, top: 542, right:  87, bottom: 570}
		];

		const sprT: g.Sprite[] = [];

		uv.forEach(x => {
			sprT.push(
				SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom)
			);
		});

		return sprT;
	}

	static createMaskS(s: g.Scene): g.Sprite[] {
		const uv: g.CommonRect[] = [
			{left: 23, top: 520, right: 44, bottom: 541},
			{left:  1, top: 520, right: 22, bottom: 541},
			{left: 67, top: 520, right: 88, bottom: 541},
			{left: 45, top: 520, right: 66, bottom: 541}
		];

		const sprT: g.Sprite[] = [];

		uv.forEach(x => {
			sprT.push(
				SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom)
			);
		});

		return sprT;
	}

	static createGuideL(s: g.Scene): g.Sprite[] {
		const uv: g.CommonRect[] = [
			{left: 621, top: 330, right: 747, bottom: 415},
			{left: 322, top: 289, right: 407, bottom: 415},
			{left: 494, top: 330, right: 620, bottom: 415},
			{left: 408, top: 289, right: 493, bottom: 415}
		];

		const sprT: g.Sprite[] = [];

		uv.forEach(x => {
			sprT.push(
				SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom)
			);
		});

		return sprT;
	}

	static createGuideM(s: g.Scene): g.Sprite[] {
		const uv: g.CommonRect[] = [
			{left: 523, top: 416, right: 607, bottom: 473},
			{left: 322, top: 416, right: 379, bottom: 500},
			{left: 438, top: 416, right: 522, bottom: 473},
			{left: 380, top: 416, right: 437, bottom: 500}
		];

		const sprT: g.Sprite[] = [];

		uv.forEach(x => {
			sprT.push(
				SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom)
			);
		});

		return sprT;
	}

	static createGuideS(s: g.Scene): g.Sprite[] {
		const uv: g.CommonRect[] = [
			{left: 501, top: 501, right: 564, bottom: 544},
			{left: 349, top: 501, right: 392, bottom: 564},
			{left: 437, top: 501, right: 500, bottom: 544},
			{left: 393, top: 501, right: 436, bottom: 564}
		];

		const sprT: g.Sprite[] = [];

		uv.forEach(x => {
			sprT.push(
				SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom)
			);
		});

		return sprT;
	}

	static createAnimationSprite(
		_scene: g.Scene,
		srow: number, scolumn: number, row: number, column: number,
		show: boolean = true): g.Sprite[] {
		const spriteTable: g.Sprite[] = [];
		const sw = 76;
		const sh = 78;

		const bx = 1 + (srow * sw);
		const by = 538 + (scolumn * sh) + 1;

		let spr = null;

		for (let y = 0, ymax = column; y < ymax; ++y) {
			for (let x = 0, xmax = row; x < xmax; ++x) {
				const nbx = bx + (x * sw) + x;
				const nby = by + (y * sh) + y;
				spr = SpriteFactory.createSpriteCore(_scene, "ui", nbx, nby, nbx + sw, nby + sh);
				if ( !show ) {
					spr.hide();
				}
				spriteTable.push(spr);
			}
		}

		return spriteTable;
	}

	static createRestNUMFrame(_s: g.Scene): g.Sprite {
		return SpriteFactory.createSprite(_s, 784, 1, 944, 47);
	}

	static createSCOREFrame(_s: g.Scene): g.Sprite {
		return SpriteFactory.createSprite(_s, 1, 188, 446, 356);
	}

	static createClockIcon(_s: g.Scene): g.Sprite {
		return SpriteFactory.createSprite(_s, 1, 524, 37, 560);
	}

	static createPtImage(_s: g.Scene): g.Sprite {
		return SpriteFactory.createSprite(_s, 38, 524, 66, 552);
	}

	static createComboRedBase(_s: g.Scene) {
		return SpriteFactory.createSprite(_s, 67, 524, 173, 554);
	}

	static createComboYellowBase(_s: g.Scene) {
		return SpriteFactory.createSprite(_s, 174, 524, 297, 562);
	}

	static createReady(_s: g.Scene) {
		return SpriteFactory.createSprite(_s, 447, 188, 691, 284);
	}

	static createStart(_s: g.Scene) {
		return SpriteFactory.createSprite(_s, 447, 285, 733, 364);
	}

	static createGameOver(_s: g.Scene) {
		return SpriteFactory.createSprite(_s, 1, 444, 426, 523);
	}

	static createTimeUp(_s: g.Scene) {
		return SpriteFactory.createSprite(_s, 478, 444, 826, 539);
	}

	static createSprite(_scene: g.Scene, sx: number, sy: number, ex: number, ey: number): g.Sprite {
		return this.createSpriteCore(_scene, "ui_common", sx, sy, ex, ey);
	}

	static createSpriteCore(_s: g.Scene, name: string, sx: number, sy: number, ex: number, ey: number) {
		const sw = ex - sx;
		const sh = ey - sy;
		const imageAsset = _s.asset.getImageById(name);
		return new g.Sprite({
			scene: _s,
			src: imageAsset,
			anchorX: null,
			anchorY: null,
			srcX: sx,
			srcY: sy,
			srcWidth: sw,
			srcHeight: sh,

			width: sw,
			height: sh
		});
	}
}
