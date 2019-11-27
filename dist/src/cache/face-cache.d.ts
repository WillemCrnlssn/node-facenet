import FlashStore from 'flash-store';
import { Face } from '../face';
export declare class FaceCache {
    workdir: string;
    store: FlashStore<string, object>;
    embeddingStore: FlashStore<string, number[]>;
    imagedir: string;
    constructor(workdir: string);
    init(): void;
    destroy(): Promise<void>;
    get(md5: string): Promise<Face | null>;
    put(face: Face): Promise<void>;
    file(md5: string): string;
    list(md5Partial: string, limit?: number): Promise<string[]>;
}
export default FaceCache;
