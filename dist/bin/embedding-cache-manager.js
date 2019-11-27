#!/usr/bin/env node
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
const argparse_1 = require("argparse");
const __1 = require("../");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.log.level(args.log);
        let workdir;
        if (args.directory.startsWith(path.sep)) {
            workdir = args.directory;
        }
        else {
            workdir = path.join(process.cwd(), args.directory);
        }
        const facenet = new __1.Facenet();
        const lfw = new __1.Lfw(workdir);
        const faceCache = new __1.FaceCache(workdir);
        const alignmentCache = new __1.AlignmentCache(facenet, faceCache, workdir);
        const embeddingCache = new __1.EmbeddingCache(facenet, workdir);
        yield alignmentCache.init();
        yield embeddingCache.init();
        yield faceCache.init();
        yield facenet.init();
        const count = yield embeddingCache.count();
        let ret = 0;
        switch (args.command) {
            case 'setup':
                const imageList = yield lfw.imageList();
                for (const relativePath of imageList) {
                    const file = path.join(lfw.directory, relativePath);
                    const faceList = yield alignmentCache.align(file);
                    yield Promise.all(faceList.map(face => embeddingCache.embedding(face)));
                }
                __1.log.info('EmbeddingCacheManager', 'cache: %s has inited %d entries', args.directory, count);
                break;
            case 'destroy':
                yield embeddingCache.destroy();
                __1.log.info('EmbeddingCacheManager', 'cleaned %d entries', count);
                break;
            default:
                __1.log.error('LfwManager', 'not supported command: %s', args.command);
                ret = 1;
                break;
        }
        yield facenet.quit();
        return ret;
    });
}
function parseArguments() {
    const parser = new argparse_1.ArgumentParser({
        version: __1.VERSION,
        addHelp: true,
        description: 'Embedding Cache Manager',
    });
    parser.addArgument(['directory'], {
        help: 'Dataset Directory',
    });
    parser.addArgument(['command'], {
        help: 'setup, clean',
        defaultValue: 'setup',
    });
    parser.addArgument(['-l', '--log'], {
        help: 'Log Level: verbose, silly',
        defaultValue: 'info',
    });
    return parser.parseArgs();
}
main(parseArguments())
    .then(process.exit)
    .catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=embedding-cache-manager.js.map