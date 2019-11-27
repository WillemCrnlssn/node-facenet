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
const python_facenet_1 = require("../src/python3/python-facenet");
test('tensorflow module import', (t) => __awaiter(this, void 0, void 0, function* () {
    const pf = new python_facenet_1.PythonFacenet();
    const python = pf.python3;
    try {
        yield python.ex `
      import tensorflow as tf
    `;
        t.pass('should import successful');
    }
    catch (e) {
        t.fail(e);
    }
    finally {
        yield pf.quit();
    }
}));
test('tensorflow smoke testing', (t) => __awaiter(this, void 0, void 0, function* () {
    const pf = new python_facenet_1.PythonFacenet();
    pf.initVenv();
    const python = python_bridge_1.pythonBridge({
        python: 'python3',
    });
    try {
        yield python.ex `
      import tensorflow as tf

      sess = tf.Session()
      a = tf.constant(5.0)
      b = tf.constant(6.0)
      c = a * b
    `;
        // http://ellisvalentiner.com/post/2016-01-20-numpyfloat64-is-json-serializable-but-numpyfloat32-is-not/
        const c = yield python `1.0 * sess.run(c)`;
        t.equal(c, 30, 'should get 5 * 6 = 30');
        yield python.ex `sess.close()`;
    }
    catch (e) {
        t.fail(e.message);
    }
    finally {
        try {
            yield python.end();
        }
        catch (e) {
            t.fail(e);
        }
        yield pf.quit();
    }
}));
//# sourceMappingURL=tensorflow.spec.js.map