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
const path = require("path");
const blessed = require("blessed");
const config_1 = require("../config");
const facenet_1 = require("../facenet");
const cache_1 = require("../cache/");
const ui_1 = require("./ui/");
const alignment_embedding_1 = require("./alignment-embedding/");
const face_grouper_1 = require("./face-grouper/");
class Manager {
    constructor() {
        config_1.log.verbose('Manager', 'constructor()');
        const workdir = path.join(config_1.MODULE_ROOT, 'cache');
        if (!fs.existsSync(workdir)) {
            fs.mkdirSync(workdir);
        }
        this.facenet = new facenet_1.Facenet();
        this.faceCache = new cache_1.FaceCache(workdir);
        this.alignmentCache = new cache_1.AlignmentCache(this.facenet, this.faceCache, workdir);
        this.embeddingCache = new cache_1.EmbeddingCache(this.facenet, workdir);
        this.screen = blessed.screen({
            smartCSR: true,
            warnings: true,
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Manager', 'init()');
            yield this.alignmentCache.init();
            yield this.embeddingCache.init();
            yield this.faceCache.init();
            this.frame = new ui_1.Frame(this.screen);
            config_1.log.enableLogging((text) => this.frame.emit('log', text));
            const menuTextList = this.menuItemList().map(m => m.text);
            this.menu = new ui_1.Menu(this.screen, menuTextList);
        });
    }
    menuItemList() {
        return [
            {
                text: 'Face Alignment & Embedding Demo',
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.alignmentEmbedding();
                    return true;
                }),
            },
            {
                text: 'Validate on LFW(To Be Implemented)',
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    console.log('validate lfw');
                    return true;
                }),
            },
            {
                text: 'Group Photos by Face',
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.faceGrouper();
                    return true;
                }),
            },
            {
                text: 'Quit',
                callback: () => __awaiter(this, void 0, void 0, function* () {
                    this.quit();
                    return false;
                }),
            },
        ];
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Manager', 'start()');
            let menuCallback = () => __awaiter(this, void 0, void 0, function* () {
                config_1.log.error('Manager', 'start() no menuCallback!');
                return false;
            });
            const menuCallbackList = this.menuItemList()
                .map(m => m.callback);
            let firstTime = true;
            do {
                ui_1.clear(this.screen);
                const idx = yield this.menu.start(firstTime);
                if (firstTime) {
                    firstTime = false;
                }
                ui_1.clear(this.screen);
                yield this.frame.init();
                menuCallback = menuCallbackList[idx];
            } while (yield menuCallback());
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.facenet.quit();
            this.screen.destroy();
        });
    }
    alignmentEmbedding(pathname) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Manager', 'alignmentEmbedding(%s)', pathname ? pathname : '');
            const ae = new alignment_embedding_1.AlignmentEmbedding(this.frame, this.faceCache, this.alignmentCache, this.embeddingCache);
            yield ae.start(pathname);
        });
    }
    faceGrouper(pathname) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Manager', 'faceGrouper(%s)', pathname ? pathname : '');
            const grouper = new face_grouper_1.FaceGrouper(this.frame, this.faceCache, this.alignmentCache, this.embeddingCache);
            yield grouper.start(pathname);
        });
    }
    sort(pathname) {
        console.log(pathname);
        //
    }
    validate() {
        console.log('validate');
        //
    }
}
exports.Manager = Manager;
exports.default = Manager;
//# sourceMappingURL=manager.js.map