import { AlignmentCache, EmbeddingCache, FaceCache } from '../../cache/';
import { Frame } from '../ui/';
export declare class AlignmentEmbedding {
    frame: Frame;
    faceCache: FaceCache;
    alignmentCache: AlignmentCache;
    embeddingCache: EmbeddingCache;
    constructor(frame: Frame, faceCache: FaceCache, alignmentCache: AlignmentCache, embeddingCache: EmbeddingCache);
    start(workdir?: string): Promise<void>;
    private createTreeElement;
    private createExplorerData;
    private bindSelectAction;
    process(file: string): Promise<void>;
}
