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
            for (const face of faceList) {
                yield face.save(face.md5 + '.jpg');
                console.log(`save face ${face.md5}.jpg successfuly`);
            }
            console.log(`Save ${faceList.length} faces from the imageFile`);
        }
        finally {
            facenet.quit();
        }
    });
}
main()
    .catch(console.error);
//# sourceMappingURL=get-face.js.map