export declare class Manager {
    private facenet;
    private alignmentCache;
    private embeddingCache;
    private faceCache;
    private frame;
    private screen;
    private menu;
    constructor();
    init(): Promise<void>;
    private menuItemList;
    start(): Promise<void>;
    quit(): Promise<void>;
    alignmentEmbedding(pathname?: string): Promise<void>;
    private faceGrouper;
    sort(pathname: string): void;
    validate(): void;
}
export default Manager;
