"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nj = require("numjs");
const config_1 = require("./config");
const misc_1 = require("./misc");
class Face {
    /**
     * Creates an instance of Face.
     * @param {ImageData} [imageData]
     */
    constructor(imageData) {
        this.id = Face.id++;
        config_1.log.verbose('Face', 'constructor(%dx%d) #%d', imageData ? imageData.width : 0, imageData ? imageData.height : 0, this.id);
        if (imageData) {
            this.imageData = imageData;
        }
    }
    /**
     * Init a face
     * @param {FaceOptions} [options={}]
     * @returns {Promise<this>}
     */
    init(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.file) {
                if (this.imageData) {
                    throw new Error('constructor(imageData) or init({file}) can not be both specified at same time!');
                }
                this.imageData = yield this.initFile(options.file);
            }
            return this.initSync(options);
        });
    }
    /**
     * @private
     */
    initSync(options = {}) {
        config_1.log.verbose('Face', 'init()');
        if (!this.imageData) {
            throw new Error('initSync() must be called after imageData set');
        }
        if (options.confidence) {
            this.confidence = options.confidence;
        }
        if (options.landmarks) {
            this.landmark = this.initLandmarks(options.landmarks);
        }
        if (!this.imageData) {
            throw new Error('no image data!');
        }
        if (options.boundingBox) {
            this.location = this.initBoundingBox(options.boundingBox);
            this.imageData = this.updateImageData(this.imageData);
        }
        else {
            this.location = this.initBoundingBox([0, 0, this.imageData.width, this.imageData.height]);
        }
        if (options.md5) {
            this.md5 = options.md5;
        }
        else { // update md5
            this.md5 = misc_1.imageMd5(this.imageData);
        }
        return this;
    }
    /**
     * @private
     */
    initLandmarks(marks) {
        config_1.log.verbose('Face', 'initLandmarks([%s]) #%d', marks, this.id);
        const leftEye = {
            x: Math.round(marks[0][0]),
            y: Math.round(marks[0][1]),
        };
        const rightEye = {
            x: Math.round(marks[1][0]),
            y: Math.round(marks[1][1]),
        };
        const nose = {
            x: Math.round(marks[2][0]),
            y: Math.round(marks[2][1]),
        };
        const leftMouthCorner = {
            x: Math.round(marks[3][0]),
            y: Math.round(marks[3][1]),
        };
        const rightMouthCorner = {
            x: Math.round(marks[4][0]),
            y: Math.round(marks[4][1]),
        };
        return {
            leftEye,
            rightEye,
            nose,
            leftMouthCorner,
            rightMouthCorner,
        };
    }
    /**
     * @private
     */
    initFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            config_1.log.verbose('Face', 'initFilename(%s) #%d', file, this.id);
            const image = yield misc_1.loadImage(file);
            const imageData = misc_1.imageToData(image);
            return imageData;
        });
    }
    /**
     * @private
     */
    initBoundingBox(boundingBox) {
        config_1.log.verbose('Face', 'initBoundingBox([%s]) #%d', boundingBox, this.id);
        if (!this.imageData) {
            throw new Error('no imageData!');
        }
        return {
            x: boundingBox[0],
            y: boundingBox[1],
            w: boundingBox[2] - boundingBox[0],
            h: boundingBox[3] - boundingBox[1],
        };
    }
    /**
     * @private
     */
    updateImageData(imageData) {
        if (!this.location) {
            throw new Error('no location!');
        }
        if (this.location.w === imageData.width
            && this.location.h === imageData.height) {
            return imageData;
        }
        // need to corp and reset this.data
        config_1.log.verbose('Face', 'initBoundingBox() box.w=%d, box.h=%d; image.w=%d, image.h=%d', this.location.w, this.location.h, imageData.width, imageData.height);
        const croppedImage = misc_1.cropImage(imageData, this.location.x, this.location.y, this.location.w, this.location.h);
        return croppedImage;
    }
    /**
     * @private
     */
    toString() {
        return `Face<${this.md5}>`;
    }
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
    toJSON() {
        const imageData = this.imageData;
        const location = this.location;
        if (!imageData) {
            throw new Error('no image data');
        }
        if (!location) {
            throw new Error('no location');
        }
        const { confidence, embedding, landmark, md5, } = this;
        const embeddingArray = embedding ? embedding.tolist() : [];
        const imageDataBase64 = Buffer.from(imageData.data.buffer)
            .toString('base64');
        const obj = {
            confidence,
            embedding: embeddingArray,
            imageData: imageDataBase64,
            landmark,
            location,
            md5,
        };
        return obj;
    }
    /**
     *
     * @static
     * @param {(FaceJsonObject | string)} obj
     * @returns {Face}
     */
    static fromJSON(obj) {
        config_1.log.verbose('Face', 'fromJSON(%s)', typeof obj);
        if (typeof obj === 'string') {
            config_1.log.silly('Face', 'fromJSON() JSON.parse(obj)');
            obj = JSON.parse(obj);
        }
        const buffer = Buffer.from(obj.imageData, 'base64');
        const array = new Uint8ClampedArray(buffer);
        const location = obj.location;
        const imageData = misc_1.createImageData(array, location.w, location.h);
        const face = new Face(imageData);
        const options = {};
        options.boundingBox = [
            obj.location.x,
            obj.location.y,
            obj.location.x + obj.location.w,
            obj.location.y + obj.location.h,
        ];
        options.confidence = obj.confidence;
        options.md5 = obj.md5;
        if (obj.landmark) {
            const m = obj.landmark;
            options.landmarks = [
                [m.leftEye.x, m.leftEye.y],
                [m.rightEye.x, m.rightEye.y],
                [m.nose.x, m.nose.y],
                [m.leftMouthCorner.x, m.leftMouthCorner.y],
                [m.rightMouthCorner.x, m.rightMouthCorner.y],
            ];
        }
        face.initSync(options);
        if (obj.embedding && obj.embedding.length) {
            face.embedding = nj.array(obj.embedding);
        }
        else {
            config_1.log.verbose('Face', 'fromJSON() no embedding found for face %s#%s', face.id, face.md5);
        }
        return face;
    }
    /**
     *
     * Embedding the face, FaceEmbedding is 128 dim
     * @type {(FaceEmbedding | undefined)}
     * @memberof Face
     */
    get embedding() {
        // if (!this._embedding) {
        //   throw new Error('no embedding yet!')
        // }
        return this._embedding;
    }
    /**
     *
     * Set embedding for a face
     */
    set embedding(embedding) {
        if (!embedding) {
            throw new Error(`Face<${this.md5}> embedding must defined!`);
        }
        else if (!(embedding instanceof nj.NdArray)
            && embedding.constructor.name !== 'NdArray') {
            console.error(embedding.constructor.name, embedding);
            throw new Error(`Face<${this.md5}> embedding is not instanceof nj.NdArray!(${typeof embedding} instead)`);
        }
        else if (this._embedding) {
            throw new Error(`Face<${this.md5}> already had embedding!`);
        }
        else if (!embedding.shape) {
            throw new Error(`Face<${this.md5}> embedding has no shape property!`);
        }
        else if (embedding.shape[0] !== 128) {
            throw new Error(`Face<${this.md5}> embedding dim is not 128! got: ${embedding.shape[0]}`);
        }
        this._embedding = embedding;
    }
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
    get center() {
        if (!this.location) {
            throw new Error('no location');
        }
        if (!this.imageData) {
            throw new Error('no imageData');
        }
        const x = Math.round(this.location.x + this.imageData.width / 2);
        const y = Math.round(this.location.y + this.imageData.height / 2);
        return { x, y };
    }
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
    get width() {
        if (!this.imageData) {
            throw new Error('no imageData');
        }
        return this.imageData.width;
    }
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
    get height() {
        if (!this.imageData) {
            throw new Error('no imageData');
        }
        return this.imageData.height;
    }
    /**
     *
     * Get depth for the imageData:   length/width/height
     * @type {number}
     * const imageFile = `${__dirname}/../tests/fixtures/two-faces.jpg`
     * const faceList = await facenet.align(imageFile)
     * console.log('face depth : ', faceList[0].depth)
     * // Output: depth:  4
     */
    get depth() {
        if (!this.imageData) {
            throw new Error('no imageData');
        }
        return this.imageData.data.length
            / this.imageData.width
            / this.imageData.height;
    }
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
    distance(face) {
        if (!this.embedding) {
            throw new Error(`sourceFace(${this.md5}).distance() source face no embedding!`);
        }
        if (!face.embedding) {
            throw new Error(`Face.distance(${face.md5}) target face no embedding!`);
        }
        const faceEmbeddingNdArray = face.embedding.reshape(1, -1);
        return misc_1.distance(this.embedding, faceEmbeddingNdArray)[0];
    }
    /**
     * @private
     */
    dataUrl() {
        if (!this.imageData) {
            throw new Error('no imageData');
        }
        return misc_1.toDataURL(this.imageData);
    }
    /**
     * @private
     */
    buffer() {
        if (!this.imageData) {
            throw new Error('no imageData');
        }
        return misc_1.toBuffer(this.imageData);
    }
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
    save(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.imageData) {
                throw new Error('no imageData');
            }
            yield misc_1.saveImage(this.imageData, file);
        });
    }
}
Face.id = 0;
exports.Face = Face;
//# sourceMappingURL=face.js.map