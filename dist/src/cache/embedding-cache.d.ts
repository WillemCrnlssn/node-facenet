import { EventEmitter } from 'events';
import FlashStore from 'flash-store';
import { FaceEmbedding } from '../config';
import { Embeddingable, Facenet } from '../facenet';
import { Face } from '../face';
export interface EmbeddingCacheData {
    [key: string]: FaceEmbedding;
}
export declare type EmbeddingCacheEvent = 'hit' | 'miss';
export declare class EmbeddingCache extends EventEmitter implements Embeddingable {
    facenet: Facenet;
    workdir: string;
    store: FlashStore<string, number[]>;
    constructor(facenet: Facenet, workdir: string);
    on(event: 'hit', listener: (face: Face) => void): this;
    on(event: 'miss', listener: (face: Face) => void): this;
    on(event: never, listener: any): this;
    emit(event: 'hit', face: Face): boolean;
    emit(event: 'miss', face: Face): boolean;
    emit(event: never, face: Face): boolean;
    init(): void;
    embedding(face: Face): Promise<FaceEmbedding>;
    count(): Promise<number>;
    destroy(): Promise<void>;
}
