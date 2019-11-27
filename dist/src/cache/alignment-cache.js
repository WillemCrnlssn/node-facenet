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
const events_1 = require("events");
const fs = require("fs");
const path = require("path");
const flash_store_1 = require("flash-store");
const config_1 = require("../config");
const misc_1 = require("../misc");
class AlignmentCache extends events_1.EventEmitter {
    constructor(facenet, faceCache, workdir) {
        super();
        this.facenet = facenet;
        this.faceCache = faceCache;
        this.workdir = workdir;
        config_1.log.verbose('AlignmentCache', 'constructor(%s)', workdir);
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    emit(event, image) {
        return super.emit(event, image);
    }
    init() {
        config_1.log.verbose('AlignmentCache', 'init()');
        if (!fs.existsSync(this.workdir)) {
            throw new Error(`directory not exist: ${this.workdir}`);
        }
        if (!this.store) {
            const storeName = 'alignment.store';
            this.store = new flash_store_1.FlashStore(path.join(this.workdir, storeName));
        }
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('AlignmentCache', 'clean()');
            yield this.store.destroy();
        });
    }
    align(image) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof image === 'string') {
                const filename = image;
                config_1.log.verbose('AlignmentCache', 'align(%s)', filename);
                image = misc_1.imageToData(yield misc_1.loadImage(filename));
            }
            else {
                config_1.log.verbose('AlignmentCache', 'align(%dx%d)', image.width, image.height);
            }
            const md5 = misc_1.imageMd5(image);
            let faceList = yield this.get(md5);
            if (faceList !== null) {
                config_1.log.silly('AlignmentCache', 'align() HIT');
                this.emit('hit', image);
                return faceList;
            }
            config_1.log.silly('AlignmentCache', 'align() MISS');
            this.emit('miss', image);
            faceList = yield this.facenet.align(image);
            yield this.put(md5, faceList);
            return faceList;
        });
    }
    get(md5) {
        return __awaiter(this, void 0, void 0, function* () {
            const faceMd5List = yield this.store.get(md5);
            if (faceMd5List && Array.isArray(faceMd5List)) {
                const faceList = yield Promise.all(faceMd5List.map(faceMd5 => this.faceCache.get(faceMd5)));
                if (faceList.some(face => !face)) {
                    return null;
                }
                else {
                    return faceList;
                }
            }
            return null;
        });
    }
    put(md5, faceList) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('AlignmentCache', 'put(%s, faceList.length=%d)', md5, faceList.length);
            yield Promise.all(faceList.map((face) => __awaiter(this, void 0, void 0, function* () { return this.faceCache.put(face); })));
            const faceMd5List = faceList.map(face => face.md5);
            yield this.store.put(md5, faceMd5List);
        });
    }
}
exports.AlignmentCache = AlignmentCache;
//# sourceMappingURL=alignment-cache.js.map