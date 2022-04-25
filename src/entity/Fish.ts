import { Tween } from "@akashic-extension/akashic-timeline";
import { FISH_FONT_SIZE, HOOK_SIZE } from "../constants";
import { getResources } from "../Resources";
import { FishingRod } from "./FishingRod";

/**
 * 魚クラス生成時のパラメータ
 */
export interface FishParameterObject {
	/**
	 * 親エンティティ
	 */
	readonly parent: g.E;
	/**
	 * 魚の名前(文字列)
	 */
	readonly name: string;
	/**
	 * 魚のリソース名(文字列)
	 */
	 readonly resourceName: string;

	/**
	 * 魚の画像幅
	 */
	 readonly width: number;
	 readonly height?: number;

	/**
	 * 魚を釣ったときのスコア
	 */
	readonly score: number;

	/**
	 * 画像の向き
	 */
	readonly direction: string;

	/**
	 * 泳ぎの揺れ
	 */
	readonly shake: string;

	/**
	 * 隕石かどうか
	 */
	readonly isInseki: boolean;

	 /**
	 * ゲームオーバーになるかどうか
	 */
	readonly isGameOver: boolean;

	/**
	 * 釣った時のSE
	 */
	readonly se: string;

	/**
	 * 泳ぎ方
	 */
	readonly swimmingStyle: SwimmingStyle;

	/**
	 * 釣ったらこの値分だけ制限時間が変更される
	 */
	readonly time: number;
}

/**
 * 泳ぎ方インターフェース
 */
export interface SwimmingStyle {
	/**
	 * 魚が動く方向
	 */
	readonly pattern: "left_to_right" | "right_to_left";
	/**
	 * 魚が泳いでいる深さ (y座標)
	 */
	readonly depth: number;
	/**
	 * 魚の移動時間 (ミリ秒)
	 */
	readonly swimTime: number;
}

/**
 * 魚クラス
 */
export class Fish {
	private _parent: g.E;
	private _sprite: g.Sprite;
	private _score: number;
	private _swimmingStyle: SwimmingStyle;
	private _name: string;
	private _direction: string
	private _shake: string
	private _isInseki: boolean
	private _isGameOver: boolean
	private _se: string
	private _time: number;

	/**
	 * 泳ぐアニメーション用の Tween
	 */
	private _swimTween: Tween | null = null;
	/**
	 *  既に釣り上げられたかどうか
	 */
	private _isCaptured: boolean;

	constructor(param: FishParameterObject) {
		this._parent = param.parent;
		this._sprite = this._createSprite(param);
		this._parent.append(this._sprite);
		this._isCaptured = false;
		this._score = param.score;
		this._swimmingStyle = param.swimmingStyle;
		this._name = param.name;
		this._direction = param.direction;
		this._shake = param.shake;
		this._isInseki = param.isInseki;
		this._isGameOver = param.isGameOver;
		this._se = param.se;
		this._time = param.time;
	}

	get isCaptured(): boolean {
		return this._isCaptured;
	}

	get name(): string {
		return this._name;
	}

	get score(): number {
		return this._score;
	}

	get isGameOver(): boolean {
		return this._isGameOver;
	}

	get se(): string {
		return this._se;
	}

	get time(): number {
		return this._time;
	}

	/**
	 * 魚の当たり判定を返す
	 */
	get area(): g.CommonArea {
		return {
			width: this._sprite.width,
			height: this._sprite.height,
			x: this._sprite.x,
			y: this._sprite.y
		};
	}

	destroy(): void {
		this._sprite.destroy();
	}

	/**
	 * 釣られる
	 */
	followHook(fishingRod: FishingRod, index: number): void {
		// 魚の向きを回転
		this._sprite.anchorX = 0.5;
		this._sprite.anchorY = 0.5;
		if (this._direction == "right") {
			this._sprite.angle = 80;
		}
		if (this._direction == "left") {
			this._sprite.angle = -80;
		}
		if (this._sprite.scaleX >= 0) {
			this._sprite.angle *= -1;
		}
		this._sprite.modified();
		// 釣られる場所まで移動
		this._sprite.onUpdate.add(() => {
			const hooksArea = fishingRod.hooksArea;
			this._sprite.x = index % 2 === 0 ? hooksArea[index].x : hooksArea[index].x + HOOK_SIZE.width;
			this._sprite.y = Math.min(hooksArea[index].y, this._sprite.y);
			this._sprite.modified();
		});
	}

	/**
	 * 泳ぐ
	 */
	swim(): void {
		const timeline = getResources().timeline;
		let toX = this._sprite.x < g.game.width / 2 ? g.game.width : -this._sprite.width;
		let toY = this._sprite.y;
		if (this._swimTween) {
			timeline.remove(this._swimTween);
		}
		if (this._isInseki) {
			this._sprite.scaleX = -1;
			this._sprite.x = g.game.width;
			this._sprite.y = Math.floor(Math.random() * 300) - 300;
			toX = Math.floor(Math.random() * 300) - 250;
			toY = g.game.height;
		}
		this._swimTween = timeline
			.create(this._sprite)
			.moveTo(toX, toY, this._swimmingStyle.swimTime)
			.call(() => this._sprite.destroy());

		// 揺れ
		if (this._shake == "fast") {
			timeline
			.create(this._sprite, {loop: true})
			.rotateBy(10, 100)
			.rotateBy(-10, 100)
		}
		if (this._shake == "slow") {
			timeline
			.create(this._sprite, {loop: true})
			.rotateBy(20, 1000)
			.rotateBy(-20, 1000)
		}
	}

	/**
	 * 泳ぎをやめる
	 */
	stop(): void {
		this._isCaptured = true;
		if (this._swimTween) {
			getResources().timeline.remove(this._swimTween);
			this._swimTween = null;
		}
	}

	/**
	 * 魚作成
	 */
	private _createSprite(param: FishParameterObject): g.Sprite {
		let scaleX = 1;
		if (param.direction == "left") {
			scaleX *= -1;
		}
		if (param.swimmingStyle.pattern == "right_to_left") {
			scaleX *= -1;
		}
		if (param.direction == "front") {
			scaleX = 1;
		}

		const asset: g.ImageAsset = param.parent.scene.asset.getImageById(param.resourceName);

		return new g.Sprite({
			scene: param.parent.scene,
			src: asset,
			anchorX: null,
			anchorY: null,
			width: param.width,
			height: param.height? param.height : param.width * asset.height / asset.width,
			srcWidth: asset.width,
			srcHeight: asset.height,
			scaleX: scaleX,
			...this._initialPos(param)
		});
	}

	/**
	 * 初期位置生成
	 */
	private _initialPos(param: FishParameterObject): g.CommonOffset {
		switch (param.swimmingStyle.pattern) {
			case "left_to_right":
				return { x: -FISH_FONT_SIZE, y: param.swimmingStyle.depth };
			case "right_to_left":
				return { x: g.game.width, y: param.swimmingStyle.depth };
		}
	}
}
