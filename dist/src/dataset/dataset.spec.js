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
const config_1 = require("../config");
// log.level('silly')
const dataset_1 = require("./dataset");
const FIXTURE_DIRECTORY = `${config_1.MODULE_ROOT}/tests/fixtures/dataset`;
class DatasetTest extends dataset_1.Dataset {
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
}
test('Smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    const d = new DatasetTest(FIXTURE_DIRECTORY, 'jpg');
    t.ok(d, 'should inited a Dataset instance');
}));
test('idList()', (t) => __awaiter(this, void 0, void 0, function* () {
    const d = new DatasetTest(FIXTURE_DIRECTORY, 'jpg');
    const idList = yield d.idList();
    t.equal(idList.length, 2, 'should get 2 ids');
    t.true(idList.includes('id1'), 'should contains id1');
    t.true(idList.includes('id2'), 'should contains id2');
}));
test('imageList()', (t) => __awaiter(this, void 0, void 0, function* () {
    const d = new DatasetTest(FIXTURE_DIRECTORY, 'jpg');
    const imageList = yield d.imageList();
    t.equal(imageList.length, 3, 'should get 3 images');
    t.true(imageList.includes('id1/image1.jpg'), 'should contains image1.jpg');
    t.true(imageList.includes('id2/image2.jpg'), 'should contains image2.jpg');
    t.true(imageList.includes('id2/image22.jpg'), 'should contains image22.jpg');
}));
test('idImageList()', (t) => __awaiter(this, void 0, void 0, function* () {
    const d = new DatasetTest(FIXTURE_DIRECTORY, 'jpg');
    const idImageList = yield d.idImageList();
    const idList = Object.keys(idImageList);
    t.equal(idList.length, 2, 'should get 2 ids');
    t.true(idList.includes('id1'), 'should contains id1');
    t.true(idList.includes('id2'), 'should contains id2');
    t.equal(idImageList['id1'].length, 1, 'should get 1 images for id1');
    t.true(idImageList['id1'].includes('image1.jpg'), 'should contains image1.jpg');
    t.equal(idImageList['id2'].length, 2, 'should get 2 images for id2');
    t.true(idImageList['id2'].includes('image2.jpg'), 'should contains image2.jpg');
    t.true(idImageList['id2'].includes('image22.jpg'), 'should contains image22.jpg');
}));
//# sourceMappingURL=dataset.spec.js.map