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
const fs = require("fs");
// tslint:disable:no-shadowed-variable
const test = require("blue-tape");
const sinon = require("sinon");
// const sinonTest           = require('sinon-test')(sinon)
const nj = require("numjs");
const fixtures_1 = require("../../tests/fixtures/");
const facenet_1 = require("../facenet");
const face_1 = require("../face");
const embedding_cache_1 = require("./embedding-cache");
const TMP_PREFIX = '/tmp/facenet-embedding-cache-test-';
test('Create workdir by init()', (t) => __awaiter(this, void 0, void 0, function* () {
    const facenet = new facenet_1.Facenet();
    const workdir = TMP_PREFIX + process.pid;
    // console.log(workdir)
    try {
        const embeddingCache = new embedding_cache_1.EmbeddingCache(facenet, workdir);
        yield embeddingCache.init();
        t.ok(fs.lstatSync(workdir).isDirectory(), 'should create directory by constructor');
    }
    catch (e) {
        t.fail(e);
    }
    finally {
        yield facenet.quit();
    }
}));
// test.only('Cache', sinonTest(async function (t: test.Test) {
test('Cache', (t) => __awaiter(this, void 0, void 0, function* () {
    const EXPECTED_EMBEDDING = nj.arange(128);
    const sandbox = sinon.createSandbox();
    const embeddingStub = sandbox.stub(facenet_1.Facenet.prototype, 'embedding');
    // embeddingStub.returns(Promise.resolve(EXPECTED_EMBEDDING))
    embeddingStub.callsFake(() => {
        // console.log('fake')
        return Promise.resolve(EXPECTED_EMBEDDING);
    });
    const hitSpy = sandbox.spy();
    const missSpy = sandbox.spy();
    const workdir = fs.mkdtempSync(TMP_PREFIX);
    const facenet = new facenet_1.Facenet();
    const embeddingCache = new embedding_cache_1.EmbeddingCache(facenet, workdir);
    yield embeddingCache.init();
    embeddingCache.on('hit', hitSpy);
    embeddingCache.on('miss', missSpy);
    t.test('miss', (t) => __awaiter(this, void 0, void 0, function* () {
        const face = new face_1.Face(fixtures_1.fixtureImageData3x3());
        yield face.init();
        embeddingStub.resetHistory();
        hitSpy.resetHistory();
        missSpy.resetHistory();
        face.embedding = yield embeddingCache.embedding(face);
        t.ok(embeddingStub.calledOnce, 'should call embedding() at 1st time');
        t.ok(hitSpy.notCalled, 'should hit none');
        t.ok(missSpy.calledOnce, 'should miss once');
        t.deepEqual(face.embedding.tolist(), EXPECTED_EMBEDDING.tolist(), 'should be equal to embedding data');
    }));
    t.test('hit', (t) => __awaiter(this, void 0, void 0, function* () {
        const face = new face_1.Face(fixtures_1.fixtureImageData3x3());
        yield face.init();
        embeddingStub.resetHistory();
        hitSpy.resetHistory();
        missSpy.resetHistory();
        face.embedding = yield embeddingCache.embedding(face);
        t.ok(embeddingStub.notCalled, 'should not call embedding() at 2nd time for a same face(md5)');
        t.ok(hitSpy.calledOnce, 'should hit once');
        t.ok(missSpy.notCalled, 'should miss none');
        t.deepEqual(face.embedding.tolist(), EXPECTED_EMBEDDING.tolist(), 'should be equal to embedding data');
    }));
    yield facenet.quit();
    sandbox.restore();
}));
//# sourceMappingURL=embedding-cache.spec.js.map