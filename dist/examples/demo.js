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
const __1 = require("../"); // from 'facenet'
const misc_1 = require("../src/misc");
// import { log }      from '../'
// log.level('silly')
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Instanciate FaceNet
        const facenet = new __1.Facenet();
        // Init TensorFlow Backend:
        //  This is very slow for the first time initialization,
        //  which will take 15 - 100 seconds on different machines.
        yield facenet.init();
        try {
            // Load image from file
            const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`;
            // Do Face Alignment, return faces
            const faceList = yield facenet.align(imageFile);
            for (const face of faceList) {
                // Calculate Face Embedding, return feature vector
                face.embedding = yield facenet.embedding(face);
                const faceFile = `${face.md5}.png`;
                if (face.imageData) {
                    misc_1.saveImage(face.imageData, faceFile);
                }
                else {
                    console.error('face no image data!');
                }
                console.log('image file:', imageFile);
                console.log('face file:', faceFile);
                console.log('confidence:', face.confidence);
                console.log('bounding box:', face.location);
                console.log('landmarks:', face.landmark);
                console.log('embedding:', face.embedding);
            }
        }
        finally {
            facenet.quit();
        }
    });
}
main()
    .catch(console.error);
//# sourceMappingURL=demo.js.map