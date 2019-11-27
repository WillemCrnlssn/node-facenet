"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./src/config");
exports.log = config_1.log;
// MODULE_ROOT,
exports.VERSION = config_1.VERSION;
var face_1 = require("./src/face");
// Rectangle,
exports.Face = face_1.Face;
__export(require("./src/misc"));
var cache_1 = require("./src/cache/");
exports.AlignmentCache = cache_1.AlignmentCache;
exports.EmbeddingCache = cache_1.EmbeddingCache;
exports.FaceCache = cache_1.FaceCache;
var dataset_1 = require("./src/dataset/");
exports.Dataset = dataset_1.Dataset;
exports.Lfw = dataset_1.Lfw;
// export { PythonFacenet }    from './src/python3/python-facenet'
const facenet_1 = require("./src/facenet");
exports.Facenet = facenet_1.Facenet;
exports.default = facenet_1.Facenet;
//# sourceMappingURL=index.js.map