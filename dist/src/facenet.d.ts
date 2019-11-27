import { FaceEmbedding } from './config';
import { Face } from './face';
export interface Alignable {
    align(imageData: ImageData | string): Promise<Face[]>;
}
export interface Embeddingable {
    embedding(face: Face): Promise<FaceEmbedding>;
}
/**
 *
 * Facenet is designed for bring the state-of-art neural network with bleeding-edge technology to full stack developers
 * Neural Network && pre-trained model && easy to use APIs
 * @class Facenet
 */
export declare class Facenet implements Alignable, Embeddingable {
    private pythonFacenet;
    constructor();
    version(): string;
    /**
     *
     * Init facenet
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * @private
     */
    initFacenet(): Promise<void>;
    /**
     * @private
     */
    initMtcnn(): Promise<void>;
    /**
     *
     * Quit facenet
     * @returns {Promise<void>}
     */
    quit(): Promise<void>;
    /**
     *
     * Do face alignment for the image, return a list of faces.
     * @param {(ImageData | string)} imageData
     * @returns {Promise<Face[]>} - a list of faces
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log(faceList)
     * // Output
     * // [ Face {
     * //     id: 0,
     * //     imageData: ImageData { data: [Object] },
     * //     confidence: 0.9999634027481079,
     * //     landmark:
     * //      { leftEye: [Object],
     * //        rightEye: [Object],
     * //        nose: [Object],
     * //        leftMouthCorner: [Object],
     * //        rightMouthCorner: [Object] },
     * //      location: { x: 360, y: 94, w: 230, h: 230 },
     * //      md5: '003c926dd9d2368a86e41a2938aacc98' },
     * //   Face {
     * //     id: 1,
     * //     imageData: ImageData { data: [Object] },
     * //     confidence: 0.9998626708984375,
     * //     landmark:
     * //      { leftEye: [Object],
     * //        rightEye: [Object],
     * //        nose: [Object],
     * //        leftMouthCorner: [Object],
     * //        rightMouthCorner: [Object] },
     * //     location: { x: 141, y: 87, w: 253, h: 253 },
     * //     md5: '0451a0737dd9e4315a21594c38bce485' } ]
     * // leftEye: [Object],rightEye: [Object],nose: [Object],leftMouthCorner: [Object],rightMouthCorner: [Object] -- Object is Point, something like { x: 441, y: 181 }
     * // imageData: ImageData { data: [Object] } -- Object is Uint8ClampedArray
     */
    align(imageData: ImageData | string): Promise<Face[]>;
    /**
     *
     * Calculate Face Embedding, get the 128 dims embeding from image(s)
     *
     * @param {Face} face
     * @returns {Promise<FaceEmbedding>} - return feature vector
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * for (const face of faceList) {
     *   face.embedding = await facenet.embedding(face)
     * }
     * // Output, there are two faces in the picture, so return two 128 dims array
     * // array([ 0.03132, 0.05678, 0.06192, ..., 0.08909, 0.16793,-0.05703])
     * // array([ 0.03422,-0.08358, 0.03549, ..., 0.07108, 0.14013,-0.01417])
     */
    embedding(face: Face): Promise<FaceEmbedding>;
    /**
     * @private
     */
    transformMtcnnLandmarks(landmarks: number[][]): number[][][];
    /**
     * @private
     */
    squareBox(box: number[]): number[];
    distance(face: Face, faceList: Face[]): number[];
    distance(embedding: number[], embeddingList: number[][]): number[];
}
