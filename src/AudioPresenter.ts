import { Global } from "./Global";

export class AudioPresenter {
	static instance: AudioPresenter;

	public static initialize(_s: g.Scene) {
		AudioPresenter.instance = new AudioPresenter(_s);
	}

	_s: g.Scene = null;
	bgmPlayer: g.AudioAsset = null;

	constructor(_scene: g.Scene) {
		this._s = _scene;
	}

	playBGM(name: string, volume: number = 0.5)  {
		if (Global.instance.muteSound) {
			return;
		}
		if (this.bgmPlayer !== null) {
			if (this.bgmPlayer.id === name) {
				return;
			} else {
				this.stopBGM();
			}
		}

		this.bgmPlayer = this._s.asset.getAudioById(name);
		this.bgmPlayer.play().changeVolume(volume);
	}

	playRandomBGM() {
		const bgms = ["bgm_dm", "bgm_gohands", "bgm_madarasukaru", "bgm_namaon", "bgm_sabaneko"];
		const index = Math.floor(bgms.length * Math.random());
		this.playBGM(bgms[index]);
	}

	stopBGM() {
		if (this.bgmPlayer === null) {
			return;
		}

		this.bgmPlayer.stop();
		this.bgmPlayer = null;
	}

	playSE(name: string, volume: number = 0.5) {
		if (Global.instance.muteSound) {
			return;
		}
		this._s.asset.getAudioById(name).play().changeVolume(volume);
	}
}
