import { randomBytes } from 'crypto';
import {
    charLength,
    createEncoding,
    CharsetLengthError
} from './baseN';

const HASH_LENGTH = 6;
const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
const RNG = randomBytes;

function generateHash(options = {}) {
    const {
        length: hashLength = HASH_LENGTH,
        charset = CHARSET,
        rng = RNG
    } = options;

    const numBytes = Math.ceil(hashLength * charLength(charset) / 8);
    const bytes = rng(numBytes);

    const encode = createEncoding(charset);
    let hash = encode(bytes);
    hash = hash.slice(0, hashLength);

    return hash.join('');
}

class RandomHash {
    constructor(options = {}) {
        const {
            length,
            charset,
            rng
        } = options;

        this.hashLength = length || HASH_LENGTH;
        this.charset = charset || CHARSET;
        this.rng = rng || RNG;

        charLength(this.charset);

        this.generateHash = this.generateHash.bind(this);

        const instance = this;

        Object.defineProperty(this.generateHash, 'length', {
            get() {
                return instance.hashLength;
            },
            set(newHashLength) {
                instance.hashLength = newHashLength;
            }
        });

        Object.defineProperty(this.generateHash, 'charset', {
            get() {
                return instance.charset;
            },
            set(newCharset) {
                charLength(newCharset);

                instance.charset = newCharset;
            }
        });

        Object.defineProperty(this.generateHash, 'rng', {
            get() {
                return instance.rng;
            },
            set(newRng) {
                instance.rng = newRng;
            }
        });

        Object.setPrototypeOf(this.generateHash, this.constructor.prototype);

        return this.generateHash;
    }

    generateHash(options = {}) {
        const {
            length = this.hashLength,
            charset = this.charset,
            rng = this.rng
        } = options;

        return generateHash({
            length,
            charset,
            rng
        });
    }
}

export default generateHash;
export {
    generateHash,
    RandomHash,
    CharsetLengthError,
    HASH_LENGTH,
    CHARSET,
    RNG
};
