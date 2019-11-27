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
const blessed = require("blessed");
const config_1 = require("../../config");
class Menu {
    constructor(screen, menuList) {
        this.screen = screen;
        this.menuList = menuList;
        config_1.log.verbose('Menu', 'constructor()');
        for (const i in this.menuList) {
            menuList[i] = ' ' + (parseInt(i) + 1) + '. ' + menuList[i];
        }
    }
    start(wait = true) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Menu', 'start()');
            this.screen.title = 'FaceNet Manager';
            this.backgroundElement();
            this.logoElement();
            this.textElement();
            this.versionElement();
            if (wait) {
                yield this.pressElement();
            }
            const menuIndex = yield this.menuElement();
            return menuIndex;
        });
    }
    backgroundElement() {
        config_1.log.verbose('Menu', 'backgroundElement()');
        const box = blessed.box({
            top: 0,
            left: 0,
            width: this.screen.width,
            height: this.screen.height,
            padding: 0,
            style: {
                fg: 'green',
                bg: 'blue',
            },
        });
        this.screen.append(box);
    }
    logoElement() {
        config_1.log.verbose('Menu', 'logoElement()');
        // FIXME: blessed typing BUG: no Image exported
        const icon = blessed.widget.image({
            file: config_1.FILE_FACENET_ICON_PNG,
            type: 'ansi',
            left: 'center',
            top: 0,
            width: 32,
            height: 16,
        });
        this.screen.append(icon);
    }
    textElement() {
        config_1.log.verbose('Menu', 'textElement()');
        const bigText = blessed.bigtext({
            top: 16,
            left: 'center',
            width: 60,
            height: 16,
            content: 'FaceNet',
            style: {
                fg: 'green',
                bg: 'blue',
            },
        });
        this.screen.append(bigText);
    }
    versionElement() {
        config_1.log.verbose('Menu', 'versionElement()');
        const version = blessed.box({
            content: 'Manager version ' + config_1.VERSION,
            top: 29,
            left: 'center',
            height: 1,
            width: 50,
            align: 'right',
            style: {
                fg: 'white',
                bg: 'blue',
            },
        });
        this.screen.append(version);
    }
    pressElement() {
        config_1.log.verbose('Menu', 'pressElement()');
        const pressKey = blessed.box({
            top: (this.screen.height) - 5,
            left: 'center',
            height: 1,
            width: 30,
            style: {
                fg: 'white',
                bg: 'blue',
            },
            content: 'Press any key to continue...',
        });
        this.screen.append(pressKey);
        pressKey.hide(); // show message at first, because setInterval will run immediately
        const timer = setInterval(() => {
            pressKey.visible
                ? pressKey.hide()
                : pressKey.show();
            this.screen.render(); // have to do this to update screen
        }, 1000);
        return new Promise((resolve) => {
            this.screen.once('keypress', () => {
                clearInterval(timer);
                pressKey.hide();
                return resolve();
            });
        });
    }
    menuElement() {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Menu', 'menuElement()');
            const list = blessed.list({
                label: '{bold}{cyan-fg} Menu {/cyan-fg}{/bold}',
                tags: true,
                top: 31,
                left: 'center',
                width: 50,
                height: this.menuList.length + 2,
                keys: true,
                vi: true,
                mouse: true,
                border: 'line',
                style: {
                    item: {
                        hover: {
                            bg: 'blue',
                        },
                    },
                    selected: {
                        bg: 'blue',
                        bold: true,
                    },
                },
            });
            list.setItems(this.menuList);
            list.focus(); // seprate the following ()
            list.enterSelected(0);
            this.screen.append(list);
            this.screen.render();
            return new Promise(resolve => {
                list.once('select', (_, selected) => resolve(selected));
            });
        });
    }
}
exports.Menu = Menu;
exports.default = Menu;
//# sourceMappingURL=menu.js.map