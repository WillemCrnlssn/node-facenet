import * as nj from 'numjs';
export declare function parentDirectory(): string;
export declare const MODULE_ROOT: string;
export declare const VERSION: any;
export declare type FaceEmbedding = nj.NdArray<number>;
export interface Point {
    x: number;
    y: number;
}
export interface Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare const FILE_FACENET_ICON_PNG: string;
export { log } from 'brolog';
export declare const INPUT_FACE_SIZE = 160;
