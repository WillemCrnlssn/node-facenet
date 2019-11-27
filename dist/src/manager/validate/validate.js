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
const events_1 = require("events");
// import * as fs            from 'fs'
// import * as path          from 'path'
const blessed = require("blessed");
const contrib = require('blessed-contrib');
class Validate extends events_1.EventEmitter {
    //  private lfw:  Lfw
    constructor(frame, alignmentCache, embeddingCache) {
        super();
        this.frame = frame;
        this.alignmentCache = alignmentCache;
        this.embeddingCache = embeddingCache;
        // this.lfw = new Lfw()
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const box = this.frame.box;
            this.grid = new contrib.grid({
                screen: box,
                rows: 12,
                cols: 12,
            });
            this.createMenuElement(0, 0, 4, 12);
            this.createDonutElement(4, 0, 2, 12);
            this.createProgressElement(6, 0, 2, 12);
            this.createOutputElement(8, 0, 4, 12);
            this.on('start', () => {
                //
            });
            this.on('stop', () => {
                //
            });
            return new Promise(resolve => {
                this.once('quit', resolve);
            });
        });
    }
    createMenuElement(row, col, rowSpan, colSpan) {
        const list = this.grid.set(row, col, rowSpan, colSpan, blessed.Widgets.ListElement, {
            label: '{bold}{cyan-fg} Menu {/cyan-fg}{/bold}',
            tags: true,
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
        const menuEventMap = {
            Start: 'start',
            Stop: 'stop',
            Quit: 'quit',
        };
        list.setItems(Object.keys(menuEventMap));
        list.focus(); // seprate the following ()
        list.enterSelected(0);
        list.on('select', (text, selected) => {
            const event = menuEventMap[text];
            this.emit(event);
            this.frame.emit('log', 'menu select: ' + text + ', ' + selected);
        });
    }
    createDonutElement(row, col, rowSpan, colSpan) {
        const donut = this.grid.set(row, col, rowSpan, colSpan, contrib.donut, {
            label: 'Data Sets Status',
            radius: 8,
            arcWidth: 3,
            remainColor: 'black',
            yPadding: 2,
        });
        donut.setData([
            { percent: 87, label: 'rcp', 'color': 'green' },
            { percent: 43, label: 'rcp', 'color': 'cyan' },
        ]);
    }
    createProgressElement(row, col, rowSpan, colSpan) {
        const gauge = this.grid.set(row, col, rowSpan, colSpan, contrib.gauge, {
            label: 'Stacked ',
        });
        gauge.setStack([
            { percent: 30, stroke: 'green' },
            { percent: 30, stroke: 'magenta' },
            { percent: 40, stroke: 'cyan' },
        ]);
    }
    createOutputElement(row, col, rowSpan, colSpan) {
        const output = this.grid.set(row, col, rowSpan, colSpan, contrib.log, {
            fg: 'green',
            selectedFg: 'green',
            label: 'Server Log',
        });
        output.log('new output line');
    }
}
exports.Validate = Validate;
//# sourceMappingURL=validate.js.map