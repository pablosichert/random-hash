import { randomBytes } from 'crypto';

const HASH_LENGTH = 6;
const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
const RNG = randomBytes;

class CharsetLengthError extends Error {
    constructor(length) {
        super(`Charset needs to contain exactly 2^n characters. ${length} is not a power of 2.`);
    }
}

function charLength(charset) {
    if (!charset || !charset.length) {
        throw new CharsetLengthError(0);
    }

    const charsetLength = charset.length.toString(2);
    const powerOf2 = charsetLength.length > 1
        && charsetLength.match(/1/g).length === 1
    ;

    if (!powerOf2) {
        throw new CharsetLengthError(charset.length);
    }

    return charsetLength.length - 1;
}

function generateHash(options = {}) {
    const {
        length: hashLength = HASH_LENGTH,
        charset = CHARSET,
        rng = RNG
    } = options;

    const numBytes = Math.ceil(hashLength * charLength(charset) / 8);
    const bytes = rng(numBytes);

    let hash = baseN(bytes, charset);
    hash = hash.slice(0, hashLength);

    return hash.join('');
}

function baseN(bytes, charset) {
    const _charLength = charLength(charset);

    const numBits = bytes.length * 8;
    const hashLength = Math.ceil(numBits / _charLength);
    const output = new Array(hashLength);

    let pos = 0;
    let charNum = 0;

    while (pos < numBits) {
        let chunk = 0;

        for (let i = 0; i < _charLength; i++) {
            let _pos = pos + i;

            const byte = bytes[_pos >> 3]; // _pos % 8
            _pos = (_pos & 0b111); // Math.floor(_pos / 8);
            const bit = (byte >> (7 - _pos)) & 1;

            chunk <<= 1;
            chunk |= bit;
        }

        output[charNum] = charset[chunk];

        pos += _charLength;
        charNum++;
    }

    return output;
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
    baseN,
    CharsetLengthError,
    HASH_LENGTH,
    CHARSET,
    RNG
};
