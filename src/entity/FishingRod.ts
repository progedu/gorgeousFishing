import {
	FISHING_DURATION,
	FISHING_WAIT_DURATION,
	HOOKS_INTERVAL,
	HOOKS_LEVELS,
	HOOK_BOLD,
	HOOK_COLOR,
	HOOK_POS,
	HOOK_SIZE,
	ROD_ANGLE,
	ROD_COLOR,
	ROD_POS,
	ROD_SIZE,
	ROD_STRING_COLOR,
	ROD_STRING_HEIGHT_WHEN_UP,
	ROD_STRING_POS,
	ROD_STRING_SIZE,
	STUCK_DURATION
} from "../constants";
import { getResources } from "../Resources";
import { Fish } from "./Fish";

/**
 * 釣りのパターン
 */
export type FishingPattern = "Default" | "Stuck";

/**
 * 釣り竿クラス生成時のパラメータ
 */
export interface FishingRodParameterObject {
	/**
	 * 親エンティティ
	 */
	readonly parent: g.E;
}

/**
 * 釣り竿クラス
 */
export class FishingRod {
	/**
	 * スタック時のトリガー
	 */
	readonly onStuck: g.Trigger<void> = new g.Trigger();

	private _parent: g.E;
	private _rodString: g.FilledRect;
	private _hooks: g.E[];

	/**
	 * 釣り上げ中（魚との当たり判定がある状態）かどうか
	 */
	private _isCatching: boolean;
	/**
	 * 釣り中かどうか
	 */
	private _isFishing: boolean;

	constructor(param: FishingRodParameterObject) {
		this._parent = param.parent;
		this._isCatching = false;
		this._isFishing = false;
		this._createRod();
		this._createRodString();
		this._hooks = [];
		const firstHook = this._createHook(0);
		this._parent.append(firstHook);
		this._hooks.push(firstHook);
	}

	get isCatching(): boolean {
		return this._isCatching;
	}

	get hooksArea(): g.CommonArea[] {
		return this._hooks.map(hook => {
			return {
				width: hook.width,
				height: hook.height,
				x: hook.x,
				y: hook.y
			};
		});
	}

	/**
	 * 釣り上げる
	 */
	catchUp(finished: () => void): void {
		if (this._isFishing || this._isCatching) return;
		this._isCatching = true;
		this._isFishing = true;

		const timeline = getResources().timeline;
		timeline.create(this._rodString).to({height:ROD_STRING_HEIGHT_WHEN_UP}, FISHING_DURATION).wait(FISHING_WAIT_DURATION);
		let isFinished = false;
		for (let i = 0; i < this._hooks.length; i++) {
			const hook = this._hooks[i];
			const pos = this._calcHookPositionWhenUp(i);
			timeline.create(hook).moveTo(pos.x, pos.y, FISHING_DURATION).wait(FISHING_WAIT_DURATION)
			.call(() => {
				if (isFinished) return;
				isFinished = true;
				this._isCatching = false;
				finished();
			});
		}
	}

	/**
	 * 釣った魚からパターンを判定
	 */
	getFishingPattern(capturedFishList: Fish[]): FishingPattern {
		let pattern: FishingPattern = "Default";
		capturedFishList.forEach(fish => {
			if (pattern !== "Default") return;
			switch (fish.name){
				case "くらげ":
					pattern = "Stuck";
					break;
			}
		});
		return pattern;
	}

	/**
	 * パターンに従って釣りをする
	 */
	fishing(pattern: FishingPattern): void {
		switch (pattern){
			case "Default":
				this._swingDown();
				break;
			case "Stuck":
				this._stuck();
				break;
		}
	}

	/**
	 * スコアに合わせて針の数を増減させる
	 */
	addHooks(): void {
		const currentCount = this._hooks.length;
		const nextCount = currentCount + 1;
		if (nextCount > currentCount) {
			for (let i = currentCount; i < nextCount; i++) {
				const hook = this._createHook(i);
				this._hooks.push(hook);
				const pos = this._calcHookPositionWhenUp(i);
				hook.y = pos.y;
				this._parent.insertBefore(hook, this._hooks[i - 1]);
			}
		} else {
			for (let i = currentCount - 1; i >= nextCount; i--) {
				const hook = this._hooks.pop();
				this._parent.scene.remove(hook);
			}
		}
	}

	// 釣り上げ時の釣り針の位置を計算
	private _calcHookPositionWhenUp(index :number): g.CommonOffset {
		return {
			x: this._hooks[index] !== undefined ? this._hooks[index].x : 0,
			// 5で割っているのは適当。最大5本針でも自然に映ればそれでOK。あとなぜか若干糸と離れてしまっているため-3するという謎処理もしてしまっている。。
			y: ROD_POS.y + ROD_STRING_HEIGHT_WHEN_UP - Math.round(index * (HOOKS_INTERVAL / 5)) - 3
		}
	}

	/**
	 * 振り下ろす
	 */
	private _swingDown(): void {
		const timeline = getResources().timeline;

		timeline.create(this._rodString).to({height: ROD_STRING_SIZE.height}, FISHING_DURATION);
		for (let i = 0; i < this._hooks.length; i++) {
			const hook = this._hooks[i];
			timeline.create(hook).moveTo(hook.x, HOOK_POS.y - HOOKS_INTERVAL * i, FISHING_DURATION).call(() => {
				this._isFishing = false;
			});
		}
	}

	/**
	 * スタックさせる
	 */
	private _stuck(): void {
		this.onStuck.fire();
		// ${STUCK_DURATION} ミリ秒後に、スタックを解除し、釣竿を振り下ろす
		const timeline = getResources().timeline;
		timeline.create(this._rodString).wait(STUCK_DURATION);
		let fnishWaiting = false;
		for (let hook of this._hooks) {
			timeline.create(hook).wait(STUCK_DURATION).call(() => {
				if (fnishWaiting) return;
				fnishWaiting = true;
				this._swingDown();
			});
		}
	}

	/**
	 * 釣竿を作成する
	 */
	private _createRod(): void {
		new g.FilledRect({
			scene: this._parent.scene,
			cssColor: ROD_COLOR,
			...ROD_SIZE,
			...ROD_POS,
			anchorX: null,
			anchorY: null,
			angle: ROD_ANGLE,
			parent: this._parent
		});
	}

	/**
	 * 釣り糸を作成する
	 */
	private _createRodString(): void {
		this._rodString = new g.FilledRect({
			scene: this._parent.scene,
			cssColor: ROD_STRING_COLOR,
			...ROD_STRING_SIZE,
			...ROD_STRING_POS,
			parent: this._parent
		});
	}

	/**
	 * 釣り針を作成する
	 */
	private _createHook(index: number): g.E {
		const scene = this._parent.scene;

		const hook = new g.E({
			scene: scene,
			...HOOK_SIZE,
			x: HOOK_POS.x,
			y: HOOK_POS.y - index * HOOKS_INTERVAL
		});

		const rect1 = new g.FilledRect({
			scene: scene,
			cssColor: HOOK_COLOR,
			width : hook.width,
			height: HOOK_BOLD,
			y: hook.height - HOOK_BOLD,
			parent: hook
		});

		const rect2 = new g.FilledRect({
			scene: scene,
			cssColor: HOOK_COLOR,
			width: HOOK_BOLD,
			height: hook.height,
			parent: hook
		});

		if (index % 2 === 1) {
			hook.x += (HOOK_SIZE.width - ROD_STRING_SIZE.width);
			rect2.x = hook.width - HOOK_BOLD;
		}

		return hook;
	}
}
