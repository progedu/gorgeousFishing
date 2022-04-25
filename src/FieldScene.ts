import { Timeline } from "@akashic-extension/akashic-timeline";
import { Global } from "./Global";
import { AudioPresenter } from "./AudioPresenter";
import { AStage } from "./AStage";
import { OuterParamReceiver } from "./OuterParamReceiver";
import { FishingPattern, FishingRod } from "./entity/FishingRod";
import { Sea } from "./entity/Sea";
import { getResources, setResources } from "./Resources";
import {
	BEAR_POS,
	BEAR_SIZE,
	FONT_FAMILY,
	FONT_SIZE,
	STUCK_DURATION
} from "./constants";
import { FieldScore } from "./FieldScore";
import { Fish } from "./entity/Fish";
import { GameTimer } from "./GameTimer";
import { ReadyGo } from "./ReadyGo";
import { TimeOver } from "./TimeOver";
import { GameOver } from "./GameOver";
import { FieldPopupLabel } from "./FieldPopupLabel";

interface PlayerStatusObject {
	imageId: string; // リアクション時に表示したい画像のアセットID
	voiceId: string; // リアクション時に出力したい音声のアセットID
	time: number; // 画像を表示し続ける時間
}
// ここで全リアクションのリストを定義
const playerStatusMap: {[key: string]: PlayerStatusObject} = {
	"catch": {
		imageId: getRandomGozyasuAssetId(),
		voiceId: "revo",
		time: 2000
	},
	"zirai": {
		imageId: getRandomGozyasuAssetId(),
		voiceId: "mada",
		time: 2000
	}
}

export class FieldScene extends AStage {
	private scene: g.Scene;
	private root: g.E;
	private sea: Sea;
	private fishingRod: FishingRod;
	private isPlaying: boolean = false;
	private static readonly TIMER_MERGIN: number = 32;
	private static readonly TIMER_MAX: number = 30;
	private static readonly FIELDSCORE_POS_X: number = 552;
	private static readonly FIELDSCORE_POS_Y: number = 0;
	private static readonly FIELD_POPUP_LABEL_POS_X: number = 150;
	private static readonly FIELD_POPUP_LABEL_POS_Y: number = 80;
	private static readonly GAMETIMER_POS_X: number = 82;
	private static readonly GAMETIMER_POS_Y: number = 4;
	
	/**
	 * ドラゴンキューブ
	 */
	 private isDragoncube01Got = false;
	 private isDragoncube02Got = false;
	 private isDragoncube03Got = false;

	private timer: GameTimer;
	
	private scoreView: FieldScore;
	private score: number = 0;

	private readyGo: ReadyGo = null;

	private boatSprite: g.Sprite;

	constructor(_scene: g.Scene) {
		super();
		this.scene = _scene;
		setResources({
			timeline: new Timeline(_scene),
			font: createFont(),
		});
	}

	activate(_scene: g.Scene) {

		/**
		 * 釣り部分を作成
		 */
		this.root = new g.E({ scene: _scene });
		this.scene.append(this.root);
		// アツマール環境の時だけ背景を出す
		if (Global.instance.isAtsumaru) {
			createStage(this.root);
		}
		this.boatSprite = createBoatSprite(this.root);
		this.sea = createSea(this.root);
		this.fishingRod = createFishingRod(this.root);
		this.scene.onUpdate.add(() => {
			this.step();
		});
		this.scene.onPointDownCapture.add(() => {
			this.onPointDown();
		});

		/**
		 * スコア部分を作成
		 */
		const _sv = new FieldScore(_scene);
		_sv.init(_scene);
		this.scene.append(_sv.rootEntity);
		_sv.show(_scene, FieldScene.FIELDSCORE_POS_X, FieldScene.FIELDSCORE_POS_Y);
		_sv.value = this.score;
		this.scoreView = _sv;

		/**
		 * タイマー部分を作成
		 */
		let gt = Global.instance.totalTimeLimit - FieldScene.TIMER_MERGIN;
		if (FieldScene.TIMER_MAX < gt) {
			gt = FieldScene.TIMER_MAX;
		}
		const t = new GameTimer(_scene);
		t.show(
			FieldScene.GAMETIMER_POS_X,
			FieldScene.GAMETIMER_POS_Y,
			gt
		);
		this.scene.append(t.rootEntity);
		this.timer = t;
		this.sea.setTimer(t);

		const _readygo = new ReadyGo(_scene);
		this.readyGo = _readygo;
		this.scene.append(_readygo.rootEntity);
		_readygo.show().finishCallback.push(this.gameStartInit.bind(this));
	}

	gameStartInit(): void {
		const t = this.timer;
		this.start()
		t.start()
			.finishCallback.push(
				() => {
					if (!Global.instance.DEBUG) {
						const _eff = new TimeOver(this.scene);

						this.scene.append(_eff.rootEntity);
						_eff.show(250, 500).finishCallback.push(
							() => {
								this.finish();
						});
					}
				}
			);
		AudioPresenter.instance.playRandomBGM();
	}

	/**
	 * ゲームを開始する
	 */
	start(): void {
		this._startGame();
	}

	/**
	 * ゲームを1フレーム進める
	 */
	step(): void {
		if (!this.isPlaying) return;
		this.sea.checkFishOnHook(this.fishingRod);
	}

	/**
	 * ゲーム終了
	 */
	finish(): void {
		this.isPlaying = false;
		this.finishStage();
	}

	/**
	 * タップしたときの処理
	 */
	onPointDown(): void {
		if (!this.isPlaying) return;
		this.fishingRod.catchUp(() => {
			const pattern = this.fishingRod.getFishingPattern(this.sea.capturedFishList);
			let addScore = this.calcScore(this.sea.capturedFishList);
			// 時間が減る処理
			let changedTime = 0;

			// ドラゴンキューブ
			this.sea.capturedFishList.forEach(fish => {
				if (fish.name == "ドラゴンキューブ01") {
					this.isDragoncube01Got = true;
					displayDragonCube01(this.root);
				}
				if (fish.name == "ドラゴンキューブ02") {
					this.isDragoncube02Got = true;
					displayDragonCube02(this.root);
				}
				if (fish.name == "ドラゴンキューブ03") {
					this.isDragoncube03Got = true;
					displayDragonCube03(this.root);
				}
			});
			if (this.isDragoncube01Got && this.isDragoncube02Got && this.isDragoncube03Got) {
				addScore = 10000;
			}
			this.sea.capturedFishList.forEach(fish => {
				if (fish.name == "宝箱") {
					// 釣り針を増やす
					this.fishingRod.addHooks();
				}
			});
			// スコア表示処理
			this.addScore(addScore);
			this.sea.capturedFishList.forEach(fish => {
				// 一番時間が減るものを優先する
				if (fish.time !== 0 && fish.time < changedTime) changedTime = fish.time;
			});
			this.timer.changeTime(changedTime);

			// 時間に変更がある場合は減るもしくは増える時間の表示でそれ以外はスコア加算減算の表示
			let popupLabel, popupValue;
			if (changedTime !== 0 && changedTime > -99999) {
				popupLabel = new FieldPopupLabel(this.scene, "red");
				popupValue = changedTime;
			} else if (addScore != 0) {
				popupLabel = new FieldPopupLabel(this.scene);
				popupValue = addScore;
			}
			if (popupLabel) {
				popupLabel.init(this.scene);
				this.scene.append(popupLabel.rootEntity);
				popupLabel.value = popupValue;
				popupLabel.show(this.scene, FieldScene.FIELD_POPUP_LABEL_POS_X, FieldScene.FIELD_POPUP_LABEL_POS_Y);
			}
			// ゲームオーバー判定
			const isGameOver = this.sea.capturedFishList.filter((fish: Fish) => { return fish.isGameOver }).length > 0 ? true : false;
			if(isGameOver) {
				const gameOverEffect = new GameOver(this.scene);
				this.scene.append(gameOverEffect.rootEntity);
				gameOverEffect.show(250, 500).finishCallback.push(() => {
					this.finish();
					this.timer.finishCallback.pop();
					this.timer.destroy();
				});
			}
			this.reflectStatus(this.getStatus(this.sea.capturedFishList, addScore));
			this.fishingRod.fishing(pattern);
			this.sea.destroyCapturedFish();
		});
	}

	/**
	 * ゲーム本編開始
	 */
	private _startGame(): void {
		this.isPlaying = true;
		this.sea.startFishTimer();
	}

	dispose() {
		if (this.scene.destroyed()) {
			return;
		}
		this.scene.remove(this.root);
		this.scene.remove(this.timer.rootEntity);
		this.scene.remove(this.scoreView.rootEntity);
	}

	/**
	 * スコアをセットする
	 */
	 setScore(score: number): void {
		score = Math.min(score, 99999);
		this.score = score;
		Global.instance.score = score;
	}

	/**
	 * スコアの加算
	 */
	 addScore(score: number): void {
		let newScore = this.score + score;
		// スコアがマイナスになると結果発表ページがバグるのでマイナスにならないようにする
		if (newScore < 0) {
			newScore = 0;
		}
		this.setScore(newScore);
		this.scoreView.value = this.score;
		OuterParamReceiver.setGlobalScore(this.score);
	}

	/**
	 * 釣った魚からスコアを計算
	 */
	calcScore(capturedFishList: Fish[]): number {
		return capturedFishList.reduce((score, fish) => score += fish.score, 0);
	}

	// リアクションリストのキーを返す。スコア等から取るべきリアクションを決める。
	private getStatus(list: any[], score: number): string | null {
		return score >= 0 && list.length > 0 ? "catch" : null;
		// switch(fishingPattern) {
		// 	case "Stuck":
		// 		return "miss";
		// 	case "Default":
		// 		return score >= 10000 ? "big-catch" : null;
		// }
	}

	// 釣った時のリアクション
	private reflectStatus(status: string | null): void {
		if (status === null || !playerStatusMap[status]) {
			return;
		}

		// その状態に合ったボイスを出す
		AudioPresenter.instance.playSE(playerStatusMap[status].voiceId);

		return; // 画像の大きさ合わせが難しいのでいったん音声だけ


		// その状態に合った画像を出す
		const assetId = playerStatusMap[status].imageId;
		const beforeSurface = this.boatSprite._surface;
		this.boatSprite._surface = g.SurfaceUtil.asSurface(this.scene.asset.getImageById(assetId));
		this.boatSprite.modified();
		// 一定時間後に画像を戻す
		this.scene.setTimeout(() => {
			this.boatSprite._surface = beforeSurface;
			this.boatSprite.modified();
		}, playerStatusMap[status].time);
	}
}

/**
 * フォントを作成
 */
function createFont(): g.DynamicFont {
	return new g.DynamicFont({
		game: g.game,
		fontFamily: FONT_FAMILY,
		size: FONT_SIZE
	});
}

/**
 * 背景を作成
 */
function createStage(parent: g.E): void {
	const imageAsset = parent.scene.asset.getImageById("bg_space");
	new g.Sprite({
		scene: parent.scene,
		src: imageAsset,
		width: g.game.width,
		height: g.game.height,
		parent: parent,
	});
}

/**
 * 舟のスプライトを作成
 */
function createBoatSprite(parent: g.E): g.Sprite {
	const asset: g.ImageAsset = parent.scene.asset.getImageById(getRandomGozyasuAssetId());
	const width = 160;
	return new g.Sprite({
		scene: parent.scene,
		src: asset,
		width: width,
		height: width * asset.height / asset.width,
		srcWidth: asset.width,
		srcHeight: asset.height,
		x: 0,
		y: 60,
		parent: parent
	});
}

function getRandomGozyasuAssetId(): string {
	const gozyasuList = [
		"gozyasu_dm", "gozyasu_masakichi", "gozyasu_muxutube_danball", "gozyasu_muxutube_rocket",
		"gozyasu_nyanu", "gozyasu_odu", "gozyasu_ringomarknoa", "gozyasu_shinkeya", "gozyasu_ss"
	];
	const index = Math.floor(gozyasuList.length * Math.random());
	return gozyasuList[index];
}

/**
 * 海を作成
 */
function createSea(parent: g.E): Sea {
	return new Sea({ parent });
}

/**
 * 釣竿を作成
 */
function createFishingRod(parent: g.E): FishingRod {
	const fishingRod = new FishingRod({ parent: parent });
	return fishingRod;
}

function displayDragonCube01(parent: g.E): void {
	const dragoncube01Asset = parent.scene.asset.getImageById("dragoncube01");
	const width = 30;
	new g.Sprite({
		scene: parent.scene,
		src: dragoncube01Asset,
		width: width,
		height: width * dragoncube01Asset.height / dragoncube01Asset.width,
		srcWidth: dragoncube01Asset.width,
		srcHeight: dragoncube01Asset.height,
		x: 200,
		y: 5,
		parent: parent
	});
}

function displayDragonCube02(parent: g.E): void {
	const dragoncube02Asset = parent.scene.asset.getImageById("dragoncube02");
	const width = 30;
	new g.Sprite({
		scene: parent.scene,
		src: dragoncube02Asset,
		width: width,
		height: width * dragoncube02Asset.height / dragoncube02Asset.width,
		srcWidth: dragoncube02Asset.width,
		srcHeight: dragoncube02Asset.height,
		x: 250,
		y: 5,
		parent: parent
	});
}

function displayDragonCube03(parent: g.E): void {
	const dragoncube03Asset = parent.scene.asset.getImageById("dragoncube03");
	const width = 30;
	new g.Sprite({
		scene: parent.scene,
		src: dragoncube03Asset,
		width: width,
		height: width * dragoncube03Asset.height / dragoncube03Asset.width,
		srcWidth: dragoncube03Asset.width,
		srcHeight: dragoncube03Asset.height,
		x: 300,
		y: 5,
		parent: parent
	});
}
