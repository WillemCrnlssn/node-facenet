export interface IdImageList {
    [id: string]: string[];
}
export declare abstract class Dataset {
    directory: string;
    ext: string;
    private imageListCache;
    private idImageListCache;
    constructor(directory: string, ext?: string);
    abstract setup(): Promise<void>;
    idList(): Promise<string[]>;
    /**
     * return relative paths
     */
    imageList(): Promise<string[]>;
    idImageList(): Promise<IdImageList>;
}
