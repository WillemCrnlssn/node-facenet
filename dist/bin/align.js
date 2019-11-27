#!/usr/bin/env node
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
const argparse_1 = require("argparse");
const gm = require("gm");
const __1 = require("../");
const misc_1 = require("../src/misc");
function randomColor() {
    const hexStr = ['r', 'g', 'b'].map(_ => {
        return Math.floor(Math.random() * 256)
            .toString(16)
            .toUpperCase();
    }).reduce((prev, curr) => {
        if (curr.length > 1) {
            return prev + curr;
        }
        else {
            return prev + '0' + curr;
        }
    }, '');
    return `#${hexStr}`;
}
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.log.info('CLI', `Facenet v${__1.VERSION}`);
        // console.dir(args)
        const f = new __1.Facenet();
        __1.log.info('CLI', 'MTCNN Initializing...');
        let start = Date.now();
        yield f.initMtcnn();
        __1.log.info('CLI', 'Facenet Initialized after %f seconds', (Date.now() - start) / 1000);
        try {
            const imageFile = args.input;
            __1.log.info('CLI', 'Opening image', args.input);
            const image = yield misc_1.loadImage(imageFile);
            const imageData = misc_1.imageToData(image);
            __1.log.info('CLI', 'MTCNN Aligning...');
            start = Date.now();
            const faceList = yield f.align(imageData);
            __1.log.info('CLI', 'Aligned after %f seconds', (Date.now() - start) / 1000);
            __1.log.info('CLI', 'Found %d faces', faceList.length);
            // console.log(faceList)
            const newImage = gm(imageFile);
            for (const face of faceList) {
                const mark = face.landmark;
                const color = randomColor();
                const { x, y, w, h } = face.location || { x: 0, y: 0, w: 0, h: 0 };
                const base = Math.floor(w + h) / 50 + 1;
                newImage.fill('none')
                    .stroke(color, base * 1)
                    .drawRectangle(x, y, x + w, y + h, base * 5);
                if (mark) {
                    Object.keys(mark).forEach((k) => {
                        const p = mark[k];
                        newImage.fill(color)
                            .stroke('none', 0)
                            .drawCircle(p.x, p.y, p.x + base, p.y + base);
                    });
                }
            }
            newImage.noProfile().write(args.output, err => {
                if (err) {
                    throw err;
                }
                __1.log.info('CLI', 'Saved aligned image to', args.output);
                __1.log.info('CLI', 'Have a nice day!');
            });
        }
        catch (e) {
            console.error(e);
        }
        finally {
            f.quit();
        }
    });
}
function parseArguments() {
    const parser = new argparse_1.ArgumentParser({
        version: __1.VERSION,
        addHelp: true,
        description: 'Face Alignment CLI Tool',
    });
    parser.addArgument(['input'], {
        help: 'input image file to align',
    });
    parser.addArgument(['output'], {
        help: 'output aligned image file',
    });
    return parser.parseArgs();
}
__1.log.level('silly');
main(parseArguments());
//# sourceMappingURL=align.js.map