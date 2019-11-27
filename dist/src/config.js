"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
// import * as appRoot from 'app-root-path'
// export const MODULE_ROOT = appRoot.path
function parentDirectory() {
    const parentDir = __dirname.split(path.sep) // [... 'node_modules', 'facenet', 'dist', 'src']
        .slice(-2, -1)[0]; // 'dist'
    return parentDir;
}
exports.parentDirectory = parentDirectory;
exports.MODULE_ROOT = parentDirectory() === 'dist'
    ? path.normalize(`${__dirname}/../..`)
    : path.normalize(`${__dirname}/..`);
const packageFile = path.join(exports.MODULE_ROOT, 'package.json');
exports.VERSION = require(packageFile).version;
exports.FILE_FACENET_ICON_PNG = path.join(exports.MODULE_ROOT, 'docs', 'images', 'facenet-icon.png');
var brolog_1 = require("brolog");
exports.log = brolog_1.log;
exports.INPUT_FACE_SIZE = 160;
//# sourceMappingURL=config.js.map