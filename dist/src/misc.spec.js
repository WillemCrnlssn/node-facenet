#!/usr/bin/env ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const test = require("blue-tape"); // tslint:disable:no-shadowed-variable
const ndarray = require("ndarray");
const nj = require("numjs");
const misc_1 = require("./misc");
const fixtures_1 = require("../tests/fixtures/");
test('bufResizeUint8ClampedRGBA()', (t) => __awaiter(this, void 0, void 0, function* () {
    const UINT8_CLAMPED_ARRAY = new Uint8ClampedArray([
        1, 1, 1, 255,
        2, 2, 2, 255,
        3, 3, 3, 255,
        4, 4, 4, 255,
    ]);
    const ARRAY = ndarray(UINT8_CLAMPED_ARRAY, [2, 2, 4]);
    const EXPECTED_LENGTH = 4;
    const array = ARRAY.hi(1, 1).lo(0, 0);
    const resizedArray = misc_1.bufResizeUint8ClampedRGBA(array);
    t.equal(resizedArray.data.length, EXPECTED_LENGTH, 'should get small buffer');
}));
test('resizeImage()', (t) => __awaiter(this, void 0, void 0, function* () {
    const UINT8_CLAMPED_ARRAY = new Uint8ClampedArray([
        0, 0, 0, 255,
        0, 0, 0, 255,
        100, 100, 100, 255,
        100, 100, 100, 255,
    ]);
    const EXPECTED_DATA = new Uint8ClampedArray([
        50, 50, 50, 255,
    ]);
    const imageData = misc_1.createImageData(UINT8_CLAMPED_ARRAY, 2, 2);
    const resizedData = yield misc_1.resizeImage(imageData, 1, 1);
    t.deepEqual(resizedData.data, EXPECTED_DATA, 'should get resized data');
}));
test('imageMd5()', (t) => __awaiter(this, void 0, void 0, function* () {
    const IMAGE_FILE = path.join(__dirname, '..', 'tests', 'fixtures', 'aligned-face.png');
    const EXPECTED_MD5 = '26f0d74e9599b7dec3fe10e8f12b063e';
    const image = yield misc_1.loadImage(IMAGE_FILE);
    const md5Text = misc_1.imageMd5(image);
    // console.log(md5Text)
    t.equal(md5Text, EXPECTED_MD5, 'should calc md5 right');
}));
test('cropImage()', (t) => __awaiter(this, void 0, void 0, function* () {
    const imageData = fixtures_1.fixtureImageData3x3();
    /**
     * 1 2 3
     * 4 5 6
     * 7 8 9
     */
    const EXPECTED_DATA_CROP_0_0_1_1 = [
        1, 1, 1, 255,
    ];
    const EXPECTED_DATA_CROP_1_1_1_1 = [
        5, 5, 5, 255,
    ];
    const EXPECTED_DATA_CROP_0_0_3_2 = [
        1, 1, 1, 255,
        2, 2, 2, 255,
        3, 3, 3, 255,
        4, 4, 4, 255,
        5, 5, 5, 255,
        6, 6, 6, 255,
    ];
    t.test('should get right for rect[0, 0, 1, 1]', (t) => __awaiter(this, void 0, void 0, function* () {
        const croppedImage = misc_1.cropImage(imageData, 0, 0, 1, 1);
        t.deepEqual(croppedImage.data, EXPECTED_DATA_CROP_0_0_1_1, 'should get cropped image data right for [0 0 1 1]');
    }));
    t.test('should get right for rect[1, 1, 1, 1]', (t) => __awaiter(this, void 0, void 0, function* () {
        const croppedImage = misc_1.cropImage(imageData, 1, 1, 1, 1);
        t.deepEqual(croppedImage.data, EXPECTED_DATA_CROP_1_1_1_1, 'should get cropped image data right for [1 1 1 1]');
    }));
    t.test('should get right for rect[0, 0, 3, 2]', (t) => __awaiter(this, void 0, void 0, function* () {
        const croppedImage = misc_1.cropImage(imageData, 0, 0, 3, 2);
        t.deepEqual(croppedImage.data, EXPECTED_DATA_CROP_0_0_3_2, 'should get cropped image data right for [0 0 3 2]');
    }));
}));
test('Image/Data convert', (t) => __awaiter(this, void 0, void 0, function* () {
    const IMAGE_DATA = fixtures_1.fixtureImageData3x3();
    // tslint:disable-next-line:max-line-length
    const IMAGE = yield misc_1.loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABmJLR0QA/wD/AP+gvaeTAAAAHElEQVQImWNkZGT8z8jIyMDIyMjAwszMzICVAwAmtQEw+Y/4igAAAABJRU5ErkJggg==');
    t.test('dataToImage()', (t) => __awaiter(this, void 0, void 0, function* () {
        const canvas = misc_1.createCanvas(3, 3);
        const ctx = canvas.getContext('2d');
        const image = yield misc_1.dataToImage(IMAGE_DATA);
        if (!ctx) {
            throw new Error('no ctx');
        }
        ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(0, 0, 3, 3);
        t.deepEqual(data, IMAGE_DATA, 'should conver data to image right');
    }));
    t.test('imageToData', (t) => __awaiter(this, void 0, void 0, function* () {
        const data = misc_1.imageToData(IMAGE);
        t.deepEqual(data, IMAGE_DATA, 'should conver image to data right');
    }));
}));
test('distance()', (t) => __awaiter(this, void 0, void 0, function* () {
    t.test('embedding list contains 1 row', (t) => __awaiter(this, void 0, void 0, function* () {
        const a = nj.array([0, 3]);
        const b = nj.array([4, 0]).reshape(1, 2);
        const c = misc_1.distance(a, b);
        t.equal(c[0], 5, 'should get 5 for triangle 3&4&5');
        const d = misc_1.distance(a.tolist(), b.tolist());
        t.equal(d[0], 5, 'should get 5 for triangle 3&4&5, with array param');
    }));
    t.test('embedding list contains 3 row', (t) => __awaiter(this, void 0, void 0, function* () {
        const a = nj.array([0, 3]);
        const b = nj.array([
            4, 0,
            0, 8,
            0, -2,
        ]).reshape(3, 2);
        const c = misc_1.distance(a, b);
        t.deepEqual(c, [5, 5, 5], 'should get 5 for all three rows');
        const d = misc_1.distance(a.tolist(), b.tolist());
        t.deepEqual(d, [5, 5, 5], 'should get 5 for all three rows, with array param');
    }));
    t.test('embedding list of array', (t) => __awaiter(this, void 0, void 0, function* () {
        const a = [0, 3];
        const b = [[4, 0]];
        const c = misc_1.distance(a, b);
        t.deepEqual(c, [5], 'should get 5 for all three rows');
    }));
}));
test('Data Convertions', (t) => __awaiter(this, void 0, void 0, function* () {
    const IMAGE_DATA = fixtures_1.fixtureImageData3x3();
    const EXPECTED_DATA_URL = 'data:image/png;base64,'
        + 'iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAABmJLR0QA/wD/AP+gvaeTAA'
        + 'AAHElEQVQImWNkZGT8z8jIyMDIyMjAwszMzICVAwAmtQEw+Y/4igAAAABJRU5ErkJggg==';
    const EXPECTED_BUFFER = Buffer.from(EXPECTED_DATA_URL.split(',')[1], 'base64');
    t.test('toDataURL()', (t) => __awaiter(this, void 0, void 0, function* () {
        const dataURL = yield misc_1.toDataURL(IMAGE_DATA);
        t.equal(dataURL, EXPECTED_DATA_URL, 'should convert image data to data url right');
    }));
    t.test('toBuffer()', (t) => __awaiter(this, void 0, void 0, function* () {
        const buffer = misc_1.toBuffer(IMAGE_DATA);
        t.ok(buffer.equals(EXPECTED_BUFFER), 'should convert image data to buffer right');
    }));
}));
//# sourceMappingURL=misc.spec.js.map