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
const contrib = require('blessed-contrib');
const config_1 = require("../../config");
class AlignmentEmbedding {
    constructor(frame, faceCache, alignmentCache, embeddingCache) {
        this.frame = frame;
        this.faceCache = faceCache;
        this.alignmentCache = alignmentCache;
        this.embeddingCache = embeddingCache;
    }
    start(workdir) {
        return __awaiter(this, void 0, void 0, function* () {
            const box = this.frame.box;
            const tree = this.createTreeElement(box);
            const explorer = this.createExplorerData(workdir);
            tree.setData(explorer);
            this.bindSelectAction(tree);
            tree.focus();
            return new Promise(resolve => this.frame.bindQuitKey(resolve));
        });
    }
    createTreeElement(box) {
        const grid = new contrib.grid({
            screen: box,
            rows: 12,
            cols: 12,
        });
        const tree = grid.set(0, 0, 12, 12, contrib.tree, {
            style: { text: 'red' },
            template: { lines: true },
            label: ' Filesystem Tree ',
        });
        tree.on('click', () => tree.focus());
        return tree;
    }
    createExplorerData(workdir) {
        config_1.log.verbose('AlignmentEmbedding', 'createExplorerData(%s)', workdir ? workdir : '');
        if (!workdir) {
            workdir = path.join(config_1.MODULE_ROOT, 'docs', 'images');
        }
        const imageRegex = /\.(jpg|jpeg|tiff|png)$/i;
        // file explorer
        const explorer = {
            name: '/',
            extended: true,
            // Custom function used to recursively determine the node path
            getPath: (self) => {
                config_1.log.silly('AlignmentEmbedding', 'createExplorerData() getPath(%s)', self.name);
                // If we don't have any parent, we are at tree root, so return the base case
                if (!self.parent)
                    return '/';
                // return workdir
                // Get the parent node path and add this node name
                return path.join(self.parent.getPath(self.parent), self.name);
            },
            // Child generation function
            children: (self) => {
                // console.log('children: node: ' + self.name)
                config_1.log.silly('AlignmentEmbedding', 'createExplorerData() children(%s)', self.name);
                // childrenContent is a property filled with self.children() result
                if (self.childrenContent) {
                    // log.verbose('childrenContent HIT')
                    return self.childrenContent;
                }
                // log.verbose('childrenContent MISS')
                const result = {};
                const selfPath = self.getPath(self);
                try {
                    // List files in this directory
                    const children = fs.readdirSync(selfPath + path.sep);
                    for (const child of children) {
                        const completePath = path.join(selfPath, child);
                        // console.error('XXX:', completePath)
                        config_1.log.silly('AlignmentEmbedding', 'createExplorerData() children() for(child:%s)', completePath);
                        const resultChild = {
                            name: child,
                            getPath: self.getPath,
                            extended: false,
                        };
                        if (fs.lstatSync(completePath).isDirectory()) {
                            // If it's a directory we generate the child with the children generation function
                            resultChild['children'] = self.children;
                            result[child] = resultChild;
                        }
                        else if (imageRegex.test(child)) {
                            result[child] = resultChild;
                        }
                        else {
                            // skip non-image files
                        }
                    }
                }
                catch (e) {
                    config_1.log.error('AlignmentEmbedding', 'createExplorerData() exception: %s', e);
                    // fail safe
                }
                return result;
            },
        };
        return explorer;
    }
    bindSelectAction(tree) {
        // Handling select event. Every custom property that was added to node is
        // available like the 'node.getPath' defined above
        tree.on('select', (node) => __awaiter(this, void 0, void 0, function* () {
            let nodePath = node.getPath(node);
            // The filesystem root return an empty string as a base case
            if (nodePath === '')
                nodePath = '/';
            if (node.children) {
                return; // directorhy, not a image file
            }
            try {
                yield this.process(nodePath);
                this.frame.screen.render();
            }
            catch (e) {
                config_1.log.error('AlignmentEmbedding', 'bindSelectAction() tree on select exception: %s', e);
            }
        }));
    }
    process(file) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('AlignmentEmbedding', 'process(%s)', file);
            this.frame.emit('image', file);
            const faceList = yield this.alignmentCache.align(file);
            config_1.log.silly('AlignmentEmbedding', 'process() faceList.length:%d', faceList.length);
            for (const face of faceList) {
                try {
                    if (!face.embedding) {
                        face.embedding = yield this.embeddingCache.embedding(face);
                        yield this.faceCache.put(face);
                    }
                    this.frame.emit('face', face);
                    config_1.log.silly('AlignmentEmbedding', 'process() face:%s embedding:%s', face, face.embedding);
                }
                catch (e) {
                    config_1.log.error('AlignmentEmbedding', 'process() exception:%s', e);
                }
            }
        });
    }
}
exports.AlignmentEmbedding = AlignmentEmbedding;
//# sourceMappingURL=alignment-embedding.js.map