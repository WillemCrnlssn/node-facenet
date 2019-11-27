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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Instanciate FaceNet
        const facenet = new __1.Facenet();
        try {
            // Load image from file
            const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`;
            // Do Face Alignment, return faces
            const faceList = yield facenet.align(imageFile);
            faceList[0].embedding = yield facenet.embedding(faceList[0]);
            faceList[1].embedding = yield facenet.embedding(faceList[1]);
            console.log('distance between the different face: ', faceList[0].distance(faceList[1]));
            console.log('distance between the same face:      ', faceList[0].distance(faceList[0]));
        }
        finally {
            facenet.quit();
        }
    });
}
main()
    .catch(console.error);
//# sourceMappingURL=distance.js.map