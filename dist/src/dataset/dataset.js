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
const path = require("path");
const glob = require("glob");
const config_1 = require("../config");
class Dataset {
    constructor(directory, ext = 'jpg') {
        this.directory = directory;
        this.ext = ext;
        config_1.log.verbose('Dataset', 'constructor(directory=%s, ext=%s)', directory, ext);
    }
    idList() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Dataset', 'idList()');
            const data = yield this.idImageList();
            return Object.keys(data);
        });
    }
    /**
     * return relative paths
     */
    imageList() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Dataset', 'imageList()');
            if (this.imageListCache) {
                return this.imageListCache;
            }
            return new Promise((resolve, reject) => {
                glob(`${this.directory}/**/*.${this.ext}`, (err, matches) => {
                    if (err) {
                        return reject(err);
                    }
                    this.imageListCache = matches.map(match => path.relative(this.directory, match));
                    config_1.log.verbose('Dataset', 'imageList() loaded');
                    resolve(this.imageListCache);
                });
            });
        });
    }
    idImageList() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Dataset', 'idImageList()');
            if (this.idImageListCache && Object.keys(this.idImageListCache).length) {
                return this.idImageListCache;
            }
            this.idImageListCache = {};
            const imageList = yield this.imageList();
            imageList.forEach(imagePath => {
                const parts = imagePath.split(path.sep);
                const id = parts.slice(-2, -1)[0];
                const image = parts.slice(-1)[0];
                if (Array.isArray(this.idImageListCache[id])) {
                    this.idImageListCache[id].push(image);
                }
                else {
                    this.idImageListCache[id] = [image];
                }
            });
            config_1.log.verbose('Dataset', 'idImageListCache() loaded %d ids', Object.keys(this.idImageListCache).length);
            return this.idImageListCache;
        });
    }
}
exports.Dataset = Dataset;
//# sourceMappingURL=dataset.js.map