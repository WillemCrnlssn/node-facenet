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
const python_bridge_1 = require("python-bridge");
test('python 3 version test', (t) => __awaiter(this, void 0, void 0, function* () {
    const python = python_bridge_1.pythonBridge({
        python: 'python3',
    });
    try {
        yield python.ex `import sys`;
        const [major, minor] = yield python `sys.version_info`;
        t.ok(major >= 3, 'should be at least v3');
        console.log('minor version = ' + minor);
        t.ok(minor >= 5, 'should get minor version >= 5');
    }
    catch (e) {
        t.fail(e.message);
    }
    finally {
        yield python.end();
    }
}));
test('math test', (t) => __awaiter(this, void 0, void 0, function* () {
    const python = python_bridge_1.pythonBridge();
    try {
        yield python.ex `import math`;
        const three = yield python `math.sqrt(9)`;
        t.equal(three, 3, 'should get 3 from math.sqrt(9)');
    }
    catch (e) {
        t.fail(e.message);
    }
    finally {
        yield python.end();
    }
}));
test('list test', (t) => __awaiter(this, void 0, void 0, function* () {
    const python = python_bridge_1.pythonBridge();
    const list = [3, 4, 2, 1];
    try {
        const sortedList = yield python `sorted(${list})`;
        t.deepEqual(sortedList, list.sort(), 'should get sorted list from python');
    }
    catch (e) {
        t.fail(e.message);
    }
    finally {
        yield python.end();
    }
}));
//# sourceMappingURL=python-bridge.spec.js.map