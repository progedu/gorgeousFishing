export class Global {

	static instance: Global;

	static init() {
		Global.instance = new Global();
	}

	/**
	 * ゲームプレイの点数
	 */
	score: number;

	/**
	 * ゲームプレイ可能時間
	 */
	totalTimeLimit: number;

	/**
	 * 音の再生/非再生
	 */
	muteSound: boolean;

	/**
	 * 難易度の初期値
	 */
	difficulty: number;

	/**
	 * random生成器
	 */
	random: g.RandomGenerator;

	/**
	 * アツマール環境かどうか
	 */
	isAtsumaru: boolean;

	/**
	 * debug...
	 */
	DEBUG: boolean;

	constructor() {
		this.score = 0;
		this.totalTimeLimit = 62;
		this.muteSound = false;
		this.difficulty = 1;
		this.random = g.game.random;
		this.DEBUG = false;
		this.isAtsumaru = false;
	}

	log(l: string) {
		if (this.DEBUG) {
			console.log(l);
		}
	}
}
