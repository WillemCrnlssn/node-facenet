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
const http = require("http");
const path = require("path");
const readline = require("readline");
const mkdirp = require("mkdirp");
const printf = require("printf");
const tar = require('tar');
const config_1 = require("../config");
const _1 = require("./");
/**
 * https://github.com/davidsandberg/facenet/wiki/Validate-on-LFW
 */
class Lfw extends _1.Dataset {
    constructor(workdir = path.join(config_1.MODULE_ROOT, 'datasets', 'lfw'), ext = 'jpg') {
        super(workdir, ext);
        this.workdir = workdir;
        this.ext = ext;
        this.downloadUrl = 'http://vis-www.cs.umass.edu/lfw/lfw.tgz';
        config_1.log.verbose('Lfw', 'constructor()');
        this.downloadFile = path.join(workdir, 'lfw.tgz');
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Lfw', 'setup()');
            if (!fs.existsSync(this.directory)) {
                config_1.log.silly('Lfw', 'setup() creating directory %s', this.directory);
                mkdirp.sync(this.directory);
            }
            yield this.download();
            yield this.extract();
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Lfw', 'download() to %s', this.directory);
            if (fs.existsSync(this.downloadFile)) {
                config_1.log.silly('Lfw', 'download() %s already downloaded', this.downloadFile);
                return;
            }
            const tmpname = this.downloadFile + '.tmp';
            const file = fs.createWriteStream(tmpname);
            return new Promise((resolve, reject) => {
                // https://stackoverflow.com/a/22793628/1123955
                http.get(this.downloadUrl, response => {
                    config_1.log.verbose('Lfw', 'download() start... ');
                    response.on('readable', () => {
                        process.stdout.write('.');
                    });
                    response.pipe(file);
                    file.on('finish', () => {
                        process.stdout.write('\n');
                        config_1.log.silly('Lfw', 'download() finished');
                        file.close();
                        fs.rename(tmpname, this.downloadFile, err => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve();
                            }
                        });
                    });
                    response.on('error', reject);
                    file.on('error', reject);
                });
            });
        });
    }
    extract() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Lfw', 'extract()');
            const EXTRACTED_MARK_FILE = path.join(this.directory, 'EXTRACTED');
            if (fs.existsSync(EXTRACTED_MARK_FILE)) {
                config_1.log.silly('Lfw', 'extract() already extracted');
                return;
            }
            yield tar.x({
                file: this.downloadFile,
                strip: 1,
                cwd: this.directory,
            });
            fs.closeSync(fs.openSync(EXTRACTED_MARK_FILE, 'w')); // touch the file
        });
    }
    pairList() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Lfw', 'pairList()');
            if (this.pairListCache && this.pairListCache.length) {
                config_1.log.silly('Lfw', 'pairList() return cached list');
                return this.pairListCache;
            }
            this.pairListCache = [];
            const pairsTxt = path.join(config_1.MODULE_ROOT, 'python3/facenet/data/pairs.txt');
            /*
            10	300
            Abel_Pacheco	1	4
            Akhmed_Zakayev	1	3
            Abdel_Madi_Shabneh	1	Dean_Barker	1
            Abdel_Madi_Shabneh	1	Giancarlo_Fisichella	1
            */
            const rl = readline.createInterface({
                input: fs.createReadStream(pairsTxt),
                terminal: false,
            });
            rl.on('line', line => {
                let pair;
                let id1, id2, num1, num2;
                let file1, file2, same;
                const arr = line.split('\t');
                if (arr.length === 2) {
                    return;
                }
                if (this.pairListCache.length % 1000 === 0) {
                    config_1.log.silly('Lfw', 'pairList() loading %d ...', this.pairListCache.length);
                }
                switch (arr.length) {
                    case 3:
                        id1 = arr[0];
                        num1 = arr[1];
                        num2 = arr[2];
                        file1 = filename(id1, num1);
                        file2 = filename(id1, num2);
                        same = true;
                        pair = [file1, file2, same];
                        break;
                    case 4:
                        id1 = arr[0];
                        num1 = arr[1];
                        id2 = arr[2];
                        num2 = arr[3];
                        file1 = filename(id1, num1);
                        file2 = filename(id2, num2);
                        same = false;
                        pair = [file1, file2, same];
                        break;
                    default:
                        config_1.log.error('Lfw', 'pairList() got arr.length: %d', arr.length);
                        return;
                }
                function filename(id, num) {
                    return printf('%s/%s_%04d.jpg', id, id, num);
                }
                this.pairListCache.push(pair);
            });
            return new Promise((resolve, reject) => {
                rl.on('close', () => {
                    config_1.log.silly('Lfw', 'pairList() fully loaded: %d pairs', this.pairListCache.length);
                    resolve(this.pairListCache);
                });
                rl.on('error', reject);
            });
        });
    }
}
exports.Lfw = Lfw;
//# sourceMappingURL=lfw.js.map