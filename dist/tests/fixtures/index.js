"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("../../src/misc");
function fixtureImageData3x3() {
    const canvas = misc_1.createCanvas(3, 3);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('no ctx');
    }
    const imageData = ctx.createImageData(3, 3);
    let val = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        val++;
        imageData.data[i + 0] = val;
        imageData.data[i + 1] = val;
        imageData.data[i + 2] = val;
        imageData.data[i + 3] = 255;
    }
    /**
     * 1 2 3
     * 4 5 6
     * 7 8 9
     */
    return imageData;
}
exports.fixtureImageData3x3 = fixtureImageData3x3;
//# sourceMappingURL=index.js.map