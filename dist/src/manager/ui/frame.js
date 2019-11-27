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
// import * as path from 'path'
const events_1 = require("events");
const blessed = require("blessed");
const contrib = require('blessed-contrib');
const config_1 = require("../../config");
const face_1 = require("../../face");
const misc_1 = require("../../misc");
class Frame extends events_1.EventEmitter {
    constructor(screen) {
        super();
        this.screen = screen;
        this.elementList = [];
        this.thumbWidth = 44; // 2 for border line, 2 for float "/" workaround
        this.imageWidth = 2 * this.thumbWidth;
        // (* 4 / 3) image width/height = 4/3
        // (/2) // characters' height is about twice times of width in console
        this.imageHeight = this.imageWidth * 3 / 4 / 2;
    }
    init() {
        this.addHeaderElement();
        this.addThumbElementList();
        this.addImageElement();
        this.addMeterElement();
        this.addStatusElement();
        // provide box area for external usage
        this.addBoxElement();
    }
    emit(event, data) {
        return super.emit(event, data);
    }
    clean() {
        let i = this.screen.children.length;
        while (i--) {
            const child = this.screen.children[i];
            if (!this.elementList.includes(child)) {
                child.detach();
            }
        }
    }
    get box() {
        if (this._box) {
            this._box.detach();
        }
        this.addBoxElement();
        return this._box;
    }
    bindQuitKey(callback) {
        const quitKeyList = ['escape', 'q', 'x', 'C-q', 'C-x', 'f4', 'f10'];
        const quitRegexp = new RegExp('^[' + quitKeyList.join('|') + ']$', 'i');
        const listener = (_, key) => {
            if (quitRegexp.test(key.name)) {
                this.screen.removeListener('keypress', listener);
                callback();
            }
        };
        this.screen.addListener('keypress', listener);
    }
    addBoxElement() {
        const right = this.thumbWidth + this.imageWidth;
        const width = this.screen.width - right;
        const height = this.screen.height - 1;
        const box = blessed.box({
            right,
            width,
            height,
            top: 1,
        });
        this.append(box);
        this._box = box;
    }
    append(element) {
        this.elementList.push(element);
        this.screen.append(element);
    }
    addHeaderElement() {
        const box = blessed.box({
            top: 0,
            left: 0,
            width: '100%',
            height: 1,
            tags: true,
            content: `{center} FaceNet Manager v${config_1.VERSION} {/center}`,
            style: {
                bg: 'blue',
            },
        });
        this.append(box);
        this.on('title', title => box.setContent(title));
    }
    addThumbElementList() {
        const width = this.thumbWidth;
        const cols = width - 2 - 2; // 2 is padding for border, 2 is for in picture-tube `dx = png.width / opts.cols`
        let top = 1;
        const height = Math.floor(width / 2); // characters' height is about twice of width in console
        const faceList = [];
        const thumbList = [];
        const distanceList = [];
        do {
            const thumbElement = contrib.picture({
                cols,
                width,
                height,
                top,
                keys: true,
                vi: true,
                mouse: true,
                right: 0,
                file: config_1.FILE_FACENET_ICON_PNG,
                border: 'line',
                style: {
                    border: {
                        fg: 'cyan',
                    },
                },
                onReady: () => this.screen.render(),
            });
            const distanceElement = blessed.box({
                width,
                top: top + height,
                right: 0,
                height: 1,
                bg: 'grey',
                fg: 'white',
                tags: true,
            });
            thumbList.push(thumbElement);
            distanceList.push(distanceElement);
            thumbElement.on('click', () => {
                const idx = thumbList.indexOf(thumbElement);
                if (idx > 0 // skip the first thumb
                    && faceList[idx] // face exist in thumb
                    && faceList[idx] !== faceList[0] // face is not exist in the first thumb
                ) {
                    this.emit('face', faceList[idx]);
                }
            });
            this.append(thumbElement);
            this.append(distanceElement);
            top += height + 1; // thumb(height) + distance(1)
        } while (top < this.screen.height);
        this.screen.render();
        this.on('face', (face) => this.addFace(face, faceList, thumbList, distanceList));
    }
    addFace(face, faceList, thumbList, // contrib.picture
    distanceList) {
        config_1.log.verbose('Frame', 'addFace(%s, %d, %d, %d)', face, faceList.length, thumbList.length, distanceList.length);
        let i = thumbList.length;
        while (i--) {
            if (i === 0) {
                faceList[0] = face;
                this.showPicture(thumbList[i], face)
                    .then(() => config_1.log.silly('Frame', 'addFace(%s) done', face));
            }
            else {
                const prevFace = faceList[i - 1];
                if (prevFace) {
                    faceList[i] = prevFace;
                    this.showPicture(thumbList[i], prevFace);
                }
            }
        }
        i = distanceList.length;
        while (i--) {
            if (faceList[i + 1] && faceList[i]) {
                let distance;
                try {
                    distance = faceList[i + 1].distance(faceList[i])
                        .toFixed(2);
                }
                catch (e) { // no embedding
                    distance = -1;
                }
                distanceList[i].setContent(`{center} | distance: ${distance} | {/center}`);
                distanceList[i].bg = distance > 0.75 ? 'red' : 'green';
            }
        }
    }
    addImageElement() {
        const paddingRight = this.thumbWidth;
        const width = this.imageWidth;
        const height = this.imageHeight;
        const cols = height * 2;
        const pic = contrib.picture({
            right: paddingRight,
            width,
            cols,
            height,
            keys: true,
            vi: true,
            mouse: true,
            top: 1,
            border: 'line',
            file: config_1.FILE_FACENET_ICON_PNG,
            onReady: () => this.screen.render(),
            style: {
                border: {
                    fg: 'cyan',
                },
            },
        });
        // console.log(MODULE_ROOT)
        this.append(pic);
        this.on('image', (file) => __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield misc_1.loadImage(file);
                const data = misc_1.imageToData(image);
                const buffer = misc_1.toBuffer(data);
                yield this.showPicture(pic, buffer.toString('base64'));
                config_1.log.verbose('Frame', 'addImageElement() on(image) %s', file);
            }
            catch (e) {
                config_1.log.error('Frame', 'addImageElement() on(image) not support file format: %s', file);
            }
        }));
    }
    showPicture(picture, faceOrBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            let base64;
            if (faceOrBase64 instanceof face_1.Face) {
                base64 = faceOrBase64.buffer()
                    .toString('base64');
            }
            else {
                base64 = faceOrBase64;
            }
            // 2 is padding for border, 2 is for picture-tube `dx = png.width / opts.cols`
            const cols = picture.width - 2 - 2;
            return new Promise(resolve => {
                picture.setImage({
                    cols,
                    base64,
                    onReady: () => {
                        this.screen.render();
                        resolve();
                    },
                });
            });
        });
    }
    addMeterElement() {
        const top = 1 + this.imageHeight;
        const right = this.thumbWidth;
        const width = this.imageWidth;
        const height = this.screen.height - top;
        const box = blessed.box({
            top,
            right,
            width,
            height,
            style: {
                bg: 'blue',
            },
        });
        this.append(box);
        const grid = new contrib.grid({
            screen: box,
            rows: 6,
            cols: 6,
        });
        const logger = grid.set(0, 0, 6, 6, contrib.log, {
            tags: true,
            keys: true,
            vi: true,
            mouse: true,
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'yellow',
                },
                style: {
                    inverse: true,
                },
            },
            fg: 'green',
            selectedFg: 'green',
            label: ' Log ',
        });
        this.on('log', text => logger.log(text));
    }
    addStatusElement() {
        const status = blessed.box({
            bottom: 0,
            right: 0,
            height: 1,
            width: 'shrink',
            content: 'Status messages here.',
            style: {
                bg: 'blue',
            },
        });
        this.on('status', text => status.setContent(text));
        this.append(status);
    }
}
exports.Frame = Frame;
//   screen.render()
//   screen.on('resize', function() {
//     mainBox.height  = (screen.height as number) - 1
//     mainBox.width   = (screen.width as number) - 40
//     console.log(contrib)
//     // FIXME: emit typing
//     bigImage.emit('attach')
//     tree.emit('attach')
//     logBox.emit('attach')
//   })
exports.default = Frame;
//# sourceMappingURL=frame.js.map