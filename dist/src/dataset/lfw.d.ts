import { Dataset } from './';
export declare type LfwPair = [string, string, boolean];
/**
 * https://github.com/davidsandberg/facenet/wiki/Validate-on-LFW
 */
export declare class Lfw extends Dataset {
    workdir: string;
    ext: string;
    private downloadUrl;
    private downloadFile;
    private pairListCache;
    constructor(workdir?: string, ext?: string);
    setup(): Promise<void>;
    download(): Promise<void>;
    extract(): Promise<void>;
    pairList(): Promise<LfwPair[]>;
}
