"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const flash_store_1 = require("flash-store");
const config_1 = require("../config");
const face_1 = require("../face");
const misc_1 = require("../misc");
class FaceCache {
    constructor(workdir) {
        this.workdir = workdir;
        config_1.log.verbose('FaceCache', 'constructor(%s)', workdir);
    }
    init() {
        config_1.log.verbose('FaceCache', 'init()');
        if (!fs.existsSync(this.workdir)) {
            throw new Error(`directory not exist: ${this.workdir}`);
        }
        if (!this.store) {
            const storeName = 'face-cache.store';
            this.store = new flash_store_1.default(path.join(this.workdir, storeName));
        }
        if (!this.embeddingStore) {
            const storeName = 'face-cache-embedding.store';
            this.embeddingStore = new flash_store_1.default(path.join(this.workdir, storeName));
        }
        if (!this.imagedir) {
            const dirName = 'imagedir';
            this.imagedir = path.join(this.workdir, dirName);
            if (!fs.existsSync(this.imagedir)) {
                fs.mkdirSync(this.imagedir);
            }
        }
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('FaceCache', 'destroy()');
            yield this.store.destroy();
            yield this.embeddingStore.destroy();
            rimraf.sync(this.imagedir);
        });
    }
    get(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.store.get(md5);
            if (obj) {
                const face = face_1.Face.fromJSON(obj);
                return face;
            }
            return null;
        });
    }
    put(face) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store.put(face.md5, face); // Face.toJSON()
            if (face.embedding) {
                yield this.embeddingStore.put(face.md5, face.embedding.tolist());
            }
            const faceFile = this.file(face.md5);
            if (fs.existsSync(faceFile)) {
                return;
            }
            let imageData = face.imageData;
            if (!imageData) {
                throw new Error('FaceCache.put() no imageData!');
            }
            if (imageData.width > config_1.INPUT_FACE_SIZE) {
                imageData = yield misc_1.resizeImage(imageData, config_1.INPUT_FACE_SIZE, config_1.INPUT_FACE_SIZE);
            }
            yield misc_1.saveImage(imageData, faceFile);
        });
    }
    file(md5) {
        const filename = path.join(this.imagedir, `${md5}.png`);
        return filename;
    }
    list(md5Partial, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const prefix = md5Partial;
            const md5List = [];
            let n = 0;
            try {
                for (var _b = __asyncValues(this.store.keys({ prefix })), _c; _c = yield _b.next(), !_c.done;) {
                    const key = _c.value;
                    if (n++ >= limit) {
                        break;
                    }
                    md5List.push(key);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return md5List;
        });
    }
}
exports.FaceCache = FaceCache;
exports.default = FaceCache;
//# sourceMappingURL=face-cache.js.map