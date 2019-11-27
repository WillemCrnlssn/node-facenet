import * as nj from 'numjs';
import * as ndarray from 'ndarray';
export declare function bufResizeUint8ClampedRGBA(array: ndarray): ndarray;
export declare function imageMd5(image: ImageData | HTMLImageElement): string;
export declare function imageToData(image: HTMLImageElement): ImageData;
export declare function dataToImage(data: ImageData): Promise<HTMLImageElement>;
export declare function cropImage(imageData: ImageData, x: number, y: number, width: number, height: number): ImageData;
export declare function resizeImage(image: ImageData | HTMLImageElement, width: number, height: number): Promise<ImageData>;
export declare function loadImage(url: string): Promise<HTMLImageElement>;
export declare function createCanvas(width: number, height: number): HTMLCanvasElement;
export declare function saveImage(imageData: ImageData, filename: string): Promise<void>;
export declare function createImageData(array: Uint8ClampedArray, width: number, height: number): ImageData;
export declare function distance(source: nj.NdArray<number> | number[], // shape: (n)
destination: nj.NdArray<number> | number[][]): number[];
export declare function toDataURL(data: ImageData): string;
export declare function toBuffer(data: ImageData): Buffer;
