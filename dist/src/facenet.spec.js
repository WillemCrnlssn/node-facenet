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
const test = require("blue-tape"); // tslint:disable:no-shadowed-variable
const nj = require("numjs");
const facenet_1 = require("./facenet");
test('Facenet smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    const f = new facenet_1.Facenet();
    t.ok(f, 'should inited a Facenet instance');
    f.quit();
}));
test('transformLandmarks()', (t) => __awaiter(this, void 0, void 0, function* () {
    const f = new facenet_1.Facenet();
    const LANDMARKS_1 = [
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
    ];
    const EXPECTED_1 = [
        [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]],
    ];
    const LANDMARKS_2 = [
        [0, 100],
        [1, 101],
        [2, 102],
        [3, 103],
        [4, 104],
        [5, 105],
        [6, 106],
        [7, 107],
        [8, 108],
        [9, 109],
    ];
    const EXPECTED_2 = [
        [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]],
        [[100, 105], [101, 106], [102, 107], [103, 108], [104, 109]],
    ];
    const LANDMARKS_3 = [
        [0, 100, 1000],
        [1, 101, 1001],
        [2, 102, 1002],
        [3, 103, 1003],
        [4, 104, 1004],
        [5, 105, 1005],
        [6, 106, 1006],
        [7, 107, 1007],
        [8, 108, 1008],
        [9, 109, 1009],
    ];
    const EXPECTED_3 = [
        [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]],
        [[100, 105], [101, 106], [102, 107], [103, 108], [104, 109]],
        [[1000, 1005], [1001, 1006], [1002, 1007], [1003, 1008], [1004, 1009]],
    ];
    const pairedLandmarks1 = f.transformMtcnnLandmarks(LANDMARKS_1);
    const pairedLandmarks2 = f.transformMtcnnLandmarks(LANDMARKS_2);
    const pairedLandmarks3 = f.transformMtcnnLandmarks(LANDMARKS_3);
    t.deepEqual(pairedLandmarks1, EXPECTED_1, 'should transform landmarks with dim #1 right');
    t.deepEqual(pairedLandmarks2, EXPECTED_2, 'should transform landmarks with dim #2 right');
    t.deepEqual(pairedLandmarks3, EXPECTED_3, 'should transform landmarks with dim #3 right');
    f.quit();
}));
test('distance() for multiple rows', (t) => __awaiter(this, void 0, void 0, function* () {
    t.test('Face & Face[]', (t) => __awaiter(this, void 0, void 0, function* () {
        const FACE = {
            embedding: nj.array([0, 3]),
        };
        const FACE_LIST = [
            {
                embedding: nj.array([4, 0]),
            },
            {
                embedding: nj.array([0, 8]),
            },
            {
                embedding: nj.array([0, -2]),
            },
        ];
        const EXPECTED_DISTANCE_ARRAY = [5, 5, 5];
        const f = new facenet_1.Facenet();
        const dist = f.distance(FACE, FACE_LIST);
        t.deepEqual(dist, EXPECTED_DISTANCE_ARRAY, 'should get 5 for all three rows');
        yield f.quit();
    }));
    t.test('Embedding & Embedding[]', (t) => __awaiter(this, void 0, void 0, function* () {
        const EMBEDDING = [0, 3];
        const EMBEDDING_LIST = [
            [4, 0],
            [0, 8],
            [0, -2],
        ];
        const EXPECTED_DISTANCE_ARRAY = [5, 5, 5];
        const f = new facenet_1.Facenet();
        const dist = f.distance(EMBEDDING, EMBEDDING_LIST);
        t.deepEqual(dist, EXPECTED_DISTANCE_ARRAY, 'should get 5 for all three rows');
        yield f.quit();
    }));
}));
//# sourceMappingURL=facenet.spec.js.map