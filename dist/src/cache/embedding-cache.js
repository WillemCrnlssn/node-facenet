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
const nj = require("numjs");
const flash_store_1 = require("flash-store");
const config_1 = require("../config");
class EmbeddingCache extends events_1.EventEmitter {
    constructor(facenet, workdir) {
        super();
        this.facenet = facenet;
        this.workdir = workdir;
        config_1.log.verbose('EmbeddingCache', 'constructor(%s)', workdir);
    }
    on(event, listener) {
        super.on(event, listener);
        return this;
    }
    emit(event, face) {
        return super.emit(event, face);
    }
    init() {
        config_1.log.verbose('EmbeddingCache', 'init()');
        if (!fs.existsSync(this.workdir)) {
            fs.mkdirSync(this.workdir);
        }
        if (!this.store) {
            const storeName = 'embedding.store';
            this.store = new flash_store_1.default(path.join(this.workdir, storeName));
        }
    }
    embedding(face) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('EmbeddingCache', 'embedding(%s)', face);
            const faceMd5 = face.md5;
            const array = yield this.store.get(faceMd5);
            if (array) {
                config_1.log.silly('EmbeddingCache', 'embedding() cache HIT');
                this.emit('hit', face);
                return nj.array(array);
            }
            config_1.log.silly('EmbeddingCache', 'embedding() cache MISS');
            this.emit('miss', face);
            const embedding = yield this.facenet.embedding(face);
            yield this.store.put(faceMd5, embedding.tolist());
            return embedding;
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.store.count();
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.store.destroy();
        });
    }
}
exports.EmbeddingCache = EmbeddingCache;
//# sourceMappingURL=embedding-cache.js.map