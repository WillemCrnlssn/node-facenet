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
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const nj = require("numjs");
const ndarray = require("ndarray");
const _createCanvas = require('canvas').createCanvas;
const _createImageData = require('canvas').createImageData;
const _loadImage = require('canvas').loadImage;
function bufResizeUint8ClampedRGBA(array) {
    const buf = new Uint8ClampedArray(array.shape[0] * array.shape[1] * 4);
    const newArray = ndarray(buf, array.shape);
    for (let i = 0; i < array.shape[0]; i++) {
        for (let j = 0; j < array.shape[1]; j++) {
            for (let k = 0; k < 4; k++) {
                newArray.set(i, j, k, array.get(i, j, k));
            }
        }
    }
    return newArray;
}
exports.bufResizeUint8ClampedRGBA = bufResizeUint8ClampedRGBA;
function imageMd5(image) {
    if (image.src) { // HTMLImageElement
        image = imageToData(image);
    }
    else {
        image = image;
    }
    const buffer = Buffer.from(image.data.buffer);
    return crypto.createHash('md5')
        .update(buffer)
        .digest('hex');
}
exports.imageMd5 = imageMd5;
function imageToData(image) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('getContext found null');
    }
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    return imageData;
}
exports.imageToData = imageToData;
function dataToImage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('getContext found null');
        }
        ctx.putImageData(data, 0, 0);
        const dataUrl = canvas.toDataURL();
        const image = yield loadImage(dataUrl);
        return image;
    });
}
exports.dataToImage = dataToImage;
function cropImage(imageData, x, y, width, height) {
    const canvas = createCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('getContext found null');
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
    // Issues #12 negative x/y value bug
    ctx.putImageData(imageData, 0, 0);
    const croppedImageData = ctx.getImageData(x, y, width, height);
    return croppedImageData;
}
exports.cropImage = cropImage;
function resizeImage(image, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        if (image.data) { // ImageData
            image = yield dataToImage(image);
        }
        else {
            image = image;
        }
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('getContext found null');
        }
        ctx.drawImage(image, 0, 0, width, height);
        const resizedImage = ctx.getImageData(0, 0, width, height);
        return resizedImage;
    });
}
exports.resizeImage = resizeImage;
function loadImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield _loadImage(url);
        if (!image) {
            throw new Error('no image for url:' + url);
        }
        return image;
    });
}
exports.loadImage = loadImage;
function createCanvas(width, height) {
    const canvas = _createCanvas(width, height);
    return canvas;
}
exports.createCanvas = createCanvas;
function saveImage(imageData, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const ext = path.extname(filename);
        const canvas = createCanvas(imageData.width, imageData.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('no ctx');
        }
        ctx.putImageData(imageData, 0, 0);
        let stream;
        switch (ext) {
            case '.jpg':
                stream = canvas.createJPEGStream({
                    bufsize: 2048,
                    quality: 80,
                });
                break;
            case '.png':
                stream = canvas.createPNGStream();
                break;
            default:
                throw new Error('unsupported type: ' + ext);
        }
        const outFile = fs.createWriteStream(filename);
        stream.pipe(outFile);
        return new Promise((resolve, reject) => {
            outFile.on('close', resolve);
            outFile.on('error', reject);
            stream.on('error', reject);
        });
    });
}
exports.saveImage = saveImage;
function createImageData(array, width, height) {
    return _createImageData(array, width, height);
}
exports.createImageData = createImageData;
function distance(source, // shape: (n)
destination) {
    if (Array.isArray(source)) {
        source = nj.array(source);
    }
    if (Array.isArray(destination)) {
        destination = nj.array(destination);
    }
    if (!source.shape || source.shape.length > 1) {
        throw new Error('source.shape = ' + source.shape + ', which should be shape (n)');
    }
    if (source.shape[0] !== destination.shape[1]) {
        throw new Error('Shape error: ' + source.shape + ' vs ' + destination.shape);
    }
    const broadCastedSource = nj.zeros(destination.shape);
    for (let i = 0; i < destination.shape[0]; i++) {
        broadCastedSource.slice([i, i + 1])
            .assign(source.reshape(1, -1), false);
    }
    const l2 = destination.subtract(broadCastedSource)
        .pow(2)
        .tolist();
    const distList = l2.map(numList => numList.reduce((prev, curr) => prev + curr, 0)) // sum for each row
        .map(Math.sqrt);
    return distList;
}
exports.distance = distance;
function toDataURL(data) {
    const canvas = createCanvas(data.width, data.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('getContext found null');
    }
    ctx.putImageData(data, 0, 0);
    return canvas.toDataURL();
}
exports.toDataURL = toDataURL;
function toBuffer(data) {
    const canvas = createCanvas(data.width, data.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('getContext found null');
    }
    ctx.putImageData(data, 0, 0);
    // https://github.com/Automattic/node-canvas#canvastobuffer
    return canvas.toBuffer();
}
exports.toBuffer = toBuffer;
//# sourceMappingURL=misc.js.map