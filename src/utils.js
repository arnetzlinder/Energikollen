"use strict";
exports.__esModule = true;
exports.shuffle = void 0;
function shuffle(array) {
    return array.sort(function () { return 0.5 - Math.random(); });
}
exports.shuffle = shuffle;
