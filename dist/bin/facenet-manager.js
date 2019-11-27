#!/usr/bin/env node
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
const path = require("path");
const argparse_1 = require("argparse");
const updateNotifier = require("update-notifier");
const config_1 = require("../src/config");
const manager_1 = require("../src/manager/");
function checkUpdate() {
    const pkgFile = path.join(config_1.MODULE_ROOT, 'package.json');
    const pkg = require(pkgFile);
    const notifier = updateNotifier({
        pkg,
        updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
    });
    notifier.notify();
}
function assertNever(obj) {
    throw new Error('Unexpected object: ' + obj);
}
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        config_1.log.level(args.log);
        config_1.log.timestamp(false);
        config_1.log.verbose('Manager', `Facenet v${config_1.VERSION}`);
        checkUpdate();
        const manager = new manager_1.Manager();
        yield manager.init();
        const command = args.commands[0];
        const pathname = args.commands[1];
        try {
            switch (command) {
                case 'blessed':
                    yield manager.start();
                    break;
                case 'alignment':
                case 'embedding':
                    yield manager.alignmentEmbedding(pathname);
                    break;
                case 'validate':
                    yield manager.validate();
                    break;
                case 'sort':
                    yield manager.sort(pathname);
                    break;
                default:
                    assertNever(command);
            }
            return 0;
        }
        catch (e) {
            config_1.log.error('ManagerCli', 'Exception: %s', e);
            console.error(e);
            return 1;
        }
    });
}
function parseArguments() {
    const parser = new argparse_1.ArgumentParser({
        version: config_1.VERSION,
        addHelp: true,
        description: 'FaceNet Manager',
    });
    parser.addArgument(['commands'], {
        help: `
        align:      align the photo
        embedding:  calculate the embedding of photo
        visualize:  visualize the face box & embedding distance between faces
        validate:   validate on LFW dataset
        sort:       save photos to seprate directories based on identification.
      \n`,
        defaultValue: ['blessed'],
        nargs: '*',
    });
    // parser.addArgument(
    //   [ '-d', '--directory' ],
    //   {
    //     help: 'Dataset Directory',
    //     defaultValue: path.join(MODULE_ROOT, 'datasets', 'lfw'),
    //   },
    // )
    parser.addArgument(['-l', '--log'], {
        help: 'Log Level: silent, verbose, silly',
        defaultValue: 'info',
    });
    return parser.parseArgs();
}
process.on('warning', (warning) => {
    console.warn(warning.name); // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack); // Print the stack trace
});
main(parseArguments())
    .then(process.exit)
    .catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=facenet-manager.js.map