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
const __1 = require("../");
const misc_1 = require("../src/misc");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.log.info('CLI', `Facenet v${__1.VERSION}`);
        const f = new __1.Facenet();
        __1.log.info('CLI', 'Facenet Initializing...');
        let start = Date.now();
        yield f.init();
        __1.log.info('CLI', 'Facenet Initialized after %f seconds', (Date.now() - start) / 1000);
        try {
            const imageFile = args.image_file;
            const image = yield misc_1.loadImage(imageFile);
            const imageData = misc_1.imageToData(image);
            start = Date.now();
            const faceList = yield f.align(imageData);
            __1.log.info('CLI', 'Facenet Align(%fs): found %d faces', (Date.now() - start) / 1000, faceList.length);
            for (const face of faceList) {
                start = Date.now();
                const embedding = yield f.embedding(face);
                __1.log.info('CLI', 'Facenet Embeding(%fs)', (Date.now() - start) / 1000);
                console.log(JSON.stringify(embedding.tolist()));
            }
        }
        catch (e) {
            __1.log.error('CLI', e);
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
        description: 'Face Embedding CLI Tool',
    });
    parser.addArgument(['image_file'], {
        help: 'image file to align',
    });
    // parser.addArgument(
    //   [ '-f', '--foo' ],
    //   {
    //     help: 'foo bar'
    //   }
    // )
    return parser.parseArgs();
}
main(parseArguments());
//# sourceMappingURL=embedding.js.map