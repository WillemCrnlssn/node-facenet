import { FaceEmbedding, Point, Rectangle } from './config';
export interface FacialLandmark {
    [idx: string]: Point;
    leftEye: Point;
    rightEye: Point;
    nose: Point;
    leftMouthCorner: Point;
    rightMouthCorner: Point;
}
export interface FaceJsonObject {
    confidence?: number;
    embedding: number[];
    imageData: string;
    landmark?: FacialLandmark;
    location: Rectangle;
    md5: string;
}
export interface FaceOptions {
    boundingBox?: number[];
    confidence?: number;
    file?: string;
    landmarks?: number[][];
    md5?: string;
}
export declare class Face {
    static id: number;
    id: number;
    /**
     *
     * Get Face md5
     * @type {string}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face md5: ', faceList[0].md5)
     * // Output md5: 003c926dd9d2368a86e41a2938aacc98
     */
    md5: string;
    /**
     *
     * Get Face imageData
     * @type {ImageData}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face imageData: ', faceList[0].imageData)
     * // Output, Base64 of Buffer
     * // imageData:  ImageData {
     * //   data:
     * //    Uint8ClampedArray [
     * //      81,
     * //      ... 211500 more items ] }
     */
    imageData: ImageData;
    /**
     *
     * Get Face location
     * @type {(Rectangle | undefined)}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face location : ', faceList[0].location)
     * // Output location:  { x: 360, y: 94, w: 230, h: 230 }
     */
    location: Rectangle | undefined;
    /**
     *
     * Get Face confidence
     * @type {(number | undefined)}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face confidence : ', faceList[0].confidence)
     * // Output confidence:  0.9999634027481079
     */
    confidence: number | undefined;
    /**
     * @desc       FacialLandmark Type
     * @typedef    FacialLandmark
     * @property   { Point }  leftEye
     * @property   { Point }  rightEye
     * @property   { Point }  nose
     * @property   { Point }  leftMouthCorner
     * @property   { Point }  rightMouthCorner
     */
    /**
     *
     * Get Face landmark, containing rightEye, leftEye, nose, leftMouthCorner and rightMouthCorner
     * @type {(FacialLandmark  | undefined)}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face landmark : ', faceList[0].landmark)
     * // Output
     * // landmark:  { leftEye: { x: 441, y: 180 },
     * //   rightEye: { x: 515, y: 208 },
     * //   nose: { x: 459, y: 239 },
     * //   leftMouthCorner: { x: 417, y: 262 },
     * //   rightMouthCorner: { x: 482, y: 286 } }
     */
    landmark: FacialLandmark | undefined;
    private _embedding;
    /**
     * Creates an instance of Face.
     * @param {ImageData} [imageData]
     */
    constructor(imageData?: ImageData);
    /**
     * Init a face
     * @param {FaceOptions} [options={}]
     * @returns {Promise<this>}
     */
    init(options?: FaceOptions): Promise<this>;
    /**
     * @private
     */
    initSync(options?: FaceOptions): this;
    /**
     * @private
     */
    private initLandmarks;
    /**
     * @private
     */
    private initFile;
    /**
     * @private
     */
    private initBoundingBox;
    /**
     * @private
     */
    private updateImageData;
    /**
     * @private
     */
    toString(): string;
    /**
     * @desc       FaceJsonObject Type
     * @typedef    FaceJsonObject
     * @property   { number }         confidence - The confidence to confirm is face
     * @property   { number[] }       embedding
     * @property   { string }         imageData  - Base64 of Buffer
     * @property   { FacialLandmark } landmark   - Face landmark
     * @property   { Rectangle }      location   - Face location
     * @property   { string }         md5        - Face md5
     */
    /**
     * Get Face Json format data
     *
     * @returns {FaceJsonObject}
     */
    toJSON(): FaceJsonObject;
    /**
     *
     * @static
     * @param {(FaceJsonObject | string)} obj
     * @returns {Face}
     */
    static fromJSON(obj: FaceJsonObject | string): Face;
    /**
     *
     * Embedding the face, FaceEmbedding is 128 dim
     * @type {(FaceEmbedding | undefined)}
     * @memberof Face
     */
    /**
    *
    * Set embedding for a face
    */
    embedding: FaceEmbedding | undefined;
    /**
     * @desc       Point Type
     * @typedef    Point
     * @property   { number }  x
     * @property   { number }  y
     */
    /**
     *
     * Get center point for the location
     * @type {Point}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face center : ', faceList[0].center)
     * // Output: center:  { x: 475, y: 209 }
     */
    readonly center: Point;
    /**
     *
     * Get width for the imageData
     * @type {number}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face width : ', faceList[0].width)
     * // Output: width:  230
     */
    readonly width: number;
    /**
     *
     * Get height for the imageData
     * @type {number}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face height : ', faceList[0].height)
     * // Output: height:  230
     */
    readonly height: number;
    /**
     *
     * Get depth for the imageData:   length/width/height
     * @type {number}
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face depth : ', faceList[0].depth)
     * // Output: depth:  4
     */
    readonly depth: number;
    /**
     *
     * Get the two face's distance, the smaller the number is, the similar of the two face
     * @param {Face} face
     * @returns {number}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * faceList[0].embedding = await facenet.embedding(faceList[0])
     * faceList[1].embedding = await facenet.embedding(faceList[1])
     * console.log('distance between the different face: ', faceList[0].distance(faceList[1]))
     * console.log('distance between the same face:      ', faceList[0].distance(faceList[0]))
     * // Output
     * // distance between the different face:  1.2971515811057608
     * // distance between the same face:       0
     * // faceList[0] is totally the same with faceList[0], so the number is 0
     * // faceList[1] is different with faceList[1], so the number is big.
     * // If the number is smaller than 0.75, maybe they are the same person.
     */
    distance(face: Face): number;
    /**
     * @private
     */
    dataUrl(): string;
    /**
     * @private
     */
    buffer(): Buffer;
    /**
     *
     * Save the face to the file
     * @param {string} file
     * @returns {Promise<void>}
     * @example
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * faceList[0].save('womenFace.jpg')
     * // You can see it save the women face from `two-faces` pic to `womenFace.jpg`
     */
    save(file: string): Promise<void>;
}
