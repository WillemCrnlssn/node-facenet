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
const path = require("path");
const test = require("blue-tape"); // tslint:disable:no-shadowed-variable
const config_1 = require("./config");
test('parentDirectory()', (t) => __awaiter(this, void 0, void 0, function* () {
    const packageFile = path.join(config_1.MODULE_ROOT, 'package.json');
    t.ok(fs.existsSync(packageFile), 'should see package.json');
    const parentDir = config_1.parentDirectory();
    t.ok(parentDir);
    if (__filename.endsWith('.ts')) {
        t.notEqual(parentDir, 'dist', 'should not inside dist folder when development as TypeScript');
    }
    else if (__filename.endsWith('.js')) {
        t.equal(parentDir, 'dist', 'should inside dist folder when compiled to .js');
    }
    else {
        t.fail('unknowned file extension: ' + __filename);
    }
}));
//# sourceMappingURL=config.spec.js.map