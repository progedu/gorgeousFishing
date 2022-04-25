"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var Global_1 = require("./Global");
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.shuffle = function (array) {
        var length = array == null ? 0 : array.length;
        if (!length) {
            return [];
        }
        if (length === 1) {
            return array.slice(0);
        }
        var index = -1;
        var lastIndex = length - 1;
        var result = [];
        result = array.slice(0);
        while (++index < length) {
            var rand = index + (Global_1.Global.instance.random.get(0, (lastIndex - index)) | 0);
            var value = result[rand];
            result[rand] = result[index];
            result[index] = value;
        }
        return result;
    };
    Util.readJSON = function (_s, name) {
        return JSON.parse(_s.asset.getTextById(name).data);
    };
    Util.lerp = function (a, b, t, matchThreshold) {
        if (matchThreshold === void 0) { matchThreshold = 0; }
        var r = (1 - t) * a + t * b;
        if (0 < matchThreshold) {
            if (Math.abs(r - a) < matchThreshold) {
                r = b;
            }
        }
        return r;
    };
    Util.range = function (start, count, step) {
        if (step === void 0) { step = 1; }
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push(start + i * step);
        }
        return result;
    };
    Util.repeat = function (obj, count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push(obj);
        }
        return result;
    };
    return Util;
}());
exports.Util = Util;
