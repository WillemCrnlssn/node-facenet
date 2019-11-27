import { EventEmitter } from 'events';
import { FlashStore } from 'flash-store';
import { FaceEmbedding } from '../config';
import { Alignable, Facenet } from '../facenet';
import { Face } from '../face';
import { FaceCache } from './face-cache';
export interface AlignmentCacheData {
    [key: string]: FaceEmbedding;
}
export declare type AlignmentCacheEvent = 'hit' | 'miss';
export declare class AlignmentCache extends EventEmitter implements Alignable {
    facenet: Facenet;
    faceCache: FaceCache;
    workdir: string;
    store: FlashStore<string, object>;
    constructor(facenet: Facenet, faceCache: FaceCache, workdir: string);
    on(event: 'hit', listener: (image: ImageData | string) => void): this;
    on(event: 'miss', listener: (image: ImageData | string) => void): this;
    on(event: never, listener: any): this;
    emit(event: 'hit', image: ImageData | string): boolean;
    emit(event: 'miss', image: ImageData | string): boolean;
    emit(event: never, image: any): boolean;
    init(): void;
    destroy(): Promise<void>;
    align(image: ImageData | string): Promise<Face[]>;
    private get;
    private put;
}
