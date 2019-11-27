"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clear(theScreen) {
    let i = theScreen.children.length;
    while (i--) {
        theScreen.children[i].detach();
    }
}
exports.clear = clear;
//# sourceMappingURL=misc.js.map