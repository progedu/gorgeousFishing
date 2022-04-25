import { FISH_INTERVAL, SWIMMING_TIME_RANGE, WATERSURFACE_POS } from "../constants";
import { GameTimer } from "../GameTimer";
import { Fish } from "./Fish";
import { FishingRod } from "./FishingRod";
import { AudioPresenter } from "./../AudioPresenter";

/**
 * 魚情報インターフェース
 */
interface FishInfo {
	/**
	 * 魚の名前
	 */
	readonly name: string;

	/**
	 * 画像描画サイズ
	 */
	 readonly width: number
	 readonly height?: number

	/**
	 * 獲得できるスコア
	 */
	readonly score: number;

	/**
	 * 泳ぐ速度を5段階で指定できます
	 */
	readonly speed?: "very_fast" | "fast" | "normal" | "slow" | "very_slow";

	/**
	 * 泳ぐ深さを指定できます
	 * 今の所、海底のワカメ用
	 */
	readonly depth?: "normal" | "deep";

	/**
	 * 画像の向きを指定できます(デフォルトはright)
	 */
	readonly direction?: "left" | "front" | "right";

	/**
	 * 泳ぐ時の揺れを指定します
	 */
	readonly shake?: "fast" | "slow";

	/**
	 * 隕石みたいに動くかどうかを指定します
	 */
	readonly isInseki?: boolean;

	/**
	 * 釣った時のSEを指定できます
	 */
	 readonly se?: string;

	/**
	 * 釣ったらゲームオーバーになるかを指定します
	 */
	readonly isGameOver?: boolean;

	/**
	 * 釣ったらこの値分だけ制限時間が変更される
	 */
	readonly time?: number;
}

/**
 * 出現する魚の種類
 */
const fishInfoList: {[key: string]: FishInfo} = {
	"dragoncube01": { name: "ドラゴンキューブ01", width: 50, score: 1, direction: "front" },
	"dragoncube02": { name: "ドラゴンキューブ02", width: 50, score: 1, direction: "front" },
	"dragoncube03": { name: "ドラゴンキューブ03", width: 50, score: 1, direction: "front" },
	"fish_freelance": { name: "フリーランス", width: 100, score: 1000, direction: "left" },
	"fish_mixityan": { name: "みぃちゃんザウルス", width: 200, score: 50, speed: "very_slow" },
	"fish_ryouran": { name: "繚乱ちゃん", width: 50, score: 90000, speed: "very_fast", direction: "front" },
	"fish_takarabako": { name: "宝箱", width: 100, score: 0, direction: "left" },
	"fish_mint": { name: "ミント", width: 100, score: -1000, speed: "fast", direction: "left" },
	"fish_gadhirasu": { name: "ガディラス", width: 200, score: 10000, speed: "slow", direction: "front" },
	"fish_gonbirasu": { name: "ゴンビラス", width: 400, score: 99500, speed: "very_fast", direction: "front" },
	"fish_hurora": { name: "フローラ", width: 100, score: 10000, speed: "fast", direction: "left" },
	"fish_mixi": { name: "みぃちゃん", width: 100, score: -99999, direction: "left", shake: "fast", se: "mada" },
	"fish_madagasukaru": { name: "マダガスカル", width: 100, score: 1, speed: "fast", direction: "front" },
	"fish_wakusei": { name: "惑星", width: 100, score: 0, speed: "fast", direction: "front", time: -10 }
};

const firstStageFishKeys = [
	"fish_freelance",
	"fish_mixityan",
	"fish_mixityan",
	"fish_takarabako",
	"fish_takarabako",
	"fish_mint",
	"fish_mint",
	"fish_mint",
	"dragoncube01",
	"dragoncube02",
	"dragoncube03",
	"fish_hurora",
	"fish_mixi",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_wakusei",
	"fish_wakusei"
];
const secondStageFishKeys = [
	"fish_freelance",
	"fish_mixityan",
	"fish_mixityan",
	"fish_takarabako",
	"fish_takarabako",
	"fish_ryouran",
	"fish_mint",
	"fish_mint",
	"fish_mint",
	"dragoncube01",
	"dragoncube02",
	"dragoncube03",
	"fish_mixi",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_wakusei",
	"fish_wakusei",
	"fish_gadhirasu",
	"fish_hurora"
];
const thirdStageFishKeys = [
	"fish_freelance",
	"fish_mixityan",
	"fish_mixityan",
	"fish_takarabako",
	"fish_takarabako",
	"fish_mint",
	"fish_mint",
	"fish_mint",
	"dragoncube01",
	"dragoncube02",
	"dragoncube03",
	"fish_mixi",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_madagasukaru",
	"fish_gadhirasu",
	"fish_gonbirasu",
	"fish_wakusei",
	"fish_wakusei"
];

/**
 * 海クラス生成時のパラメータ
 */
export interface SeaParameterObject {
	/**
	 * 親エンティティ
	 */
	readonly parent: g.E;
}

/**
 * 海クラス
 */
export class Sea {
	/**
	 * 残り時間を管理するタイマー(FieldSceneからもらう)
	 */
	private _timer: GameTimer;
	private _maxTimeValue: number;

	/**
	 * 現在のステージ
	 */
	private _stage: string;

	/**
	 * 釣られた魚リスト
	 */
	capturedFishList: Fish[];

	private _parent: g.E;

	/**
	 * 作成した魚リスト
	 */
	private _fishList: Fish[];

	/**
	 * 魚作成タイマー
	 */
	private _fishTimerIdentifier: g.TimerIdentifier;

	constructor(param: SeaParameterObject){
		this.capturedFishList = [];
		this._parent = param.parent;
		this._fishList = [];
	}

	/**
	 * 残り時間を管理するタイマー(FieldSceneからもらう)
	 */
	setTimer(timer: GameTimer) {
		this._timer = timer;
		this._maxTimeValue = timer.now;
	}

	/**
	 * 定期的に魚を作成する
	 */
	startFishTimer(): void {
		this._fishTimerIdentifier = this._parent.scene.setInterval(() => {
			let count = 2; // 出す魚の数
			for(let i = 1; i <= count; i++) {
				const fish = this._createRandomFish(this._parent);
				fish.swim();
				this._fishList.push(fish);
			}
		}, FISH_INTERVAL);
	}

	/**
	 * タイマーをクリアする
	 */
	clearFishTimer(): void {
		if (!this._fishTimerIdentifier) return;
		this._parent.scene.clearInterval(this._fishTimerIdentifier);
		this._fishTimerIdentifier = null;
	}

	/**
	 * 釣り針と魚の当たり判定をチェックする
	 */
	checkFishOnHook(fishingRod: FishingRod): void {
		if (!this._fishList.length) return;
		if (!fishingRod.isCatching) return;
		this._fishList.forEach(fish => {
			// 釣り針と魚が当たっていた場合は釣り上げる
			const hooksArea = fishingRod.hooksArea; 
			for (let i = 0; i < hooksArea.length; i++) {
				const area = hooksArea[i];
				if (g.Collision.intersectAreas(area, fish.area)) {
					if (fish.isCaptured) return;
					fish.stop();
					fish.followHook(fishingRod, i);
					this._fishList = this._fishList.filter(item => item !== fish);
					this.capturedFishList.push(fish);
				}
			}
		});
	};

	/**
	 * 捕まえた魚たちを destroy する
	 */
	destroyCapturedFish(): void {
		this.capturedFishList.forEach((capturedFish) => {
			if (capturedFish.se) {
				AudioPresenter.instance.playSE(capturedFish.se);
			}
		});
		this.capturedFishList.forEach(capturedFish => capturedFish.destroy());
		this.capturedFishList = [];
	}

	/**
	 * ランダムな魚を作成
	 */
	private _createRandomFish(parent: g.E): Fish {
		// 作成する魚の種類
		const fishKeys = this.getFishKeys();
		const fishIdx = Math.floor(g.game.random.generate() * fishKeys.length);
		const fishKey = fishKeys[fishIdx]
		const fishInfo = fishInfoList[fishKey];
		// 魚の泳ぎ方のパターン
		const pattern = Math.round(g.game.random.generate()) ? "right_to_left" : "left_to_right";
		// 魚が泳ぐ水深
		const asset: g.ImageAsset = parent.scene.asset.getImageById(fishKey);
		const fishHeight = fishInfo.height? fishInfo.height : fishInfo.width * asset.height / asset.width;
		let depth;
		if (fishInfo.depth == "deep") {
			// deepの場合は海底固定
			depth = g.game.height - fishHeight;
		} else {
			depth = WATERSURFACE_POS.y + Math.floor(g.game.random.generate() * (g.game.height - WATERSURFACE_POS.y - fishHeight + 1));
		}
		// 魚が泳ぐ速度(5段階)
		let speed = fishInfo.speed || "normal";
		// 魚が泳ぐ時間
		const swimTime =  Math.floor(g.game.random.generate() * (SWIMMING_TIME_RANGE[speed].max + 1)) + SWIMMING_TIME_RANGE[speed].min;
		// 魚の向き
		const direction = fishInfo.direction || "right";
		// 隕石みたいに動くか
		const isInseki = fishInfo.isInseki || false;
		// 釣ったらゲームオーバーになるか
		const isGameOver = fishInfo.isGameOver || false;
		const time = fishInfo.time || 0;
		return new Fish({
			parent: parent,
			name: fishInfo.name,
			resourceName: fishKey,
			width: fishInfo.width,
			height: fishInfo.height,
			score: fishInfo.score,
			direction: direction,
			shake: fishInfo.shake,
			isInseki: isInseki,
			isGameOver: isGameOver,
			se: fishInfo.se,
			time: time,
			swimmingStyle: {
				pattern: pattern,
				depth: depth,
				swimTime: swimTime
			}
		});
	}

	/**
	 * 現在のステージに合わせた魚のキー一覧を返します
	 */
	private getFishKeys() {
		const stage = this.calcStage();
		this._stage = stage;
		if (stage == "firstStage") {
			return firstStageFishKeys;
		}
		if (stage == "secondStage") {
			return secondStageFishKeys;
		}
		if (stage == "thirdStage") {
			return thirdStageFishKeys;
		}
	}

	/**
	 * 現在の残り時間から今のステージを計算します
	 * 現在は序盤(ファーストステージ)、中盤(セカンドステージ)、終盤（サードステージ）の3ステージ
	 */
	private calcStage(): string {
		if (this._timer.now >= Math.floor(this._maxTimeValue * 2 / 3)) {
			return "firstStage";
		}
		if (this._timer.now >= Math.floor(this._maxTimeValue * 1 / 3)) {
			return "secondStage";
		}
		return "thirdStage"
	}
}
