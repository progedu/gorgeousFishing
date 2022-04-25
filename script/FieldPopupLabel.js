"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldPopupLabel = void 0;
var NumberValue_1 = require("./NumberValue");
var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");
var FieldPopupLabel = /** @class */ (function () {
    function FieldPopupLabel(_s, textColor) {
        this.rootEntity = new g.E({ scene: _s, x: 0, y: 0 });
        this.textColor = textColor;
    }
    Object.defineProperty(FieldPopupLabel.prototype, "value", {
        set: function (_v) {
            this.label.text = _v.toString();
            if (_v > 0) {
                this.label.text = "+" + this.label.text;
            }
            this.label.invalidate();
            this.label.modified();
        },
        enumerable: false,
        configurable: true
    });
    FieldPopupLabel.prototype.init = function (_s) {
        var _f = NumberValue_1.NumberFont.instance;
        var _l = _f.genelateLabel28(_s, this.textColor);
        this.label = _l;
        this.font = _f;
        this.rootEntity.append(_l);
    };
    FieldPopupLabel.prototype.dispose = function () {
        if (this.label.destroyed()) {
            return;
        }
        this.label.destroy();
        this.font.destroy();
    };
    FieldPopupLabel.prototype.show = function (_s, sx, sy) {
        var tl = new akashic_timeline_1.Timeline(_s);
        tl.create(this.rootEntity).fadeIn(100, akashic_timeline_1.Easing.easeInQuad).moveTo(sx, sy - 10, 300).fadeOut(1500, akashic_timeline_1.Easing.easeOutQuad);
        this.rootEntity.x = sx;
        this.rootEntity.y = sy;
        this.rootEntity.modified();
    };
    return FieldPopupLabel;
}());
exports.FieldPopupLabel = FieldPopupLabel;
