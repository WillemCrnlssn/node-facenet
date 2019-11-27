import { EventEmitter } from 'events';
import { AlignmentCache, EmbeddingCache } from '../../cache/';
import { Frame } from '../ui/';
export declare class Validate extends EventEmitter {
    frame: Frame;
    alignmentCache: AlignmentCache;
    embeddingCache: EmbeddingCache;
    private grid;
    constructor(frame: Frame, alignmentCache: AlignmentCache, embeddingCache: EmbeddingCache);
    start(): Promise<void>;
    private createMenuElement;
    private createDonutElement;
    private createProgressElement;
    private createOutputElement;
}
