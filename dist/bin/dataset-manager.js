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
const config_1 = require("../src/config");
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        __1.log.level(args.log);
        let dataset;
        switch (args.dataset) {
            case 'lfw':
                dataset = new __1.Lfw(args.directory);
                break;
            default:
                __1.log.error('DatasetManager', 'Dataset %s not support(yet)', args.dataset);
                return 1;
        }
        let ret = 0;
        switch (args.command) {
            case 'setup':
                yield dataset.setup();
                __1.log.info('DatasetManager', 'setup done');
                break;
            case 'list':
                const idImageList = yield dataset.idImageList();
                const keys = Object.keys(idImageList);
                for (let i = 0; i < 3; i++) {
                    __1.log.info('LfwManager', 'dataset: %s has %d images: %s', keys[i], idImageList[keys[i]].length, idImageList[keys[i]].join(','));
                }
                break;
            case 'pairs':
                const pairList = yield dataset.pairList();
                const sameNum = pairList.filter(p => p[2]).length;
                __1.log.info('LfwManager', 'pairList: total %d, same %d, not-same %d', pairList.length, sameNum, pairList.length - sameNum);
                break;
            default:
                __1.log.error('LfwManager', 'not supported command: %s', args.command);
                ret = 1;
                break;
        }
        return ret;
    });
}
function parseArguments() {
    const parser = new argparse_1.ArgumentParser({
        version: __1.VERSION,
        addHelp: true,
        description: 'Labeled Faces in the Wild Manager',
    });
    parser.addArgument(['dataset'], {
        help: 'Dataset Name: lfw, casia(not implement yet), ms-celeb-1m(not implement yet)',
        defaultValue: 'lfw',
    });
    parser.addArgument(['command'], {
        help: 'setup, align, embedding',
        defaultValue: 'setup',
    });
    parser.addArgument(['-d', '--directory'], {
        help: 'Dataset Directory',
        defaultValue: path.join(config_1.MODULE_ROOT, 'datasets', 'lfw'),
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
//# sourceMappingURL=dataset-manager.js.map