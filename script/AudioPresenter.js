"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPresenter = void 0;
var Global_1 = require("./Global");
var AudioPresenter = /** @class */ (function () {
    function AudioPresenter(_scene) {
        this._s = null;
        this.bgmPlayer = null;
        this._s = _scene;
    }
    AudioPresenter.initialize = function (_s) {
        AudioPresenter.instance = new AudioPresenter(_s);
    };
    AudioPresenter.prototype.playBGM = function (name, volume) {
        if (volume === void 0) { volume = 0.5; }
        if (Global_1.Global.instance.muteSound) {
            return;
        }
        if (this.bgmPlayer !== null) {
            if (this.bgmPlayer.id === name) {
                return;
            }
            else {
                this.stopBGM();
            }
        }
        this.bgmPlayer = this._s.asset.getAudioById(name);
        this.bgmPlayer.play().changeVolume(volume);
    };
    AudioPresenter.prototype.playRandomBGM = function () {
        var bgms = ["bgm_dm", "bgm_gohands", "bgm_madarasukaru", "bgm_namaon", "bgm_sabaneko"];
        var index = Math.floor(bgms.length * Math.random());
        this.playBGM(bgms[index]);
    };
    AudioPresenter.prototype.stopBGM = function () {
        if (this.bgmPlayer === null) {
            return;
        }
        this.bgmPlayer.stop();
        this.bgmPlayer = null;
    };
    AudioPresenter.prototype.playSE = function (name, volume) {
        if (volume === void 0) { volume = 0.5; }
        if (Global_1.Global.instance.muteSound) {
            return;
        }
        this._s.asset.getAudioById(name).play().changeVolume(volume);
    };
    return AudioPresenter;
}());
exports.AudioPresenter = AudioPresenter;
