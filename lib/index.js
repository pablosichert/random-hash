import { randomBytes } from 'crypto';

const defaults = {
    hashLength: 6,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
    rng: randomBytes
};

class CharsetLengthError extends Error {
    constructor() {
        super('Charset needs to contain exactly 64 characters');
    }
}

function generateHash(options = {}) {
    const {
        length: hashLength = defaults.hashLength,
        charset = defaults.charset,
        rng = defaults.rng
    } = options;

    const numBytes = Math.ceil(hashLength / 4) * 3;
    const bytes = rng(numBytes);

    let hash = bytesToChars(bytes, charset);
    hash = hash.slice(0, hashLength);

    return hash.join('');
}

// Credit to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function bytesToChars(randomArray, charset) {
    if (charset.length !== 64) {
        throw new CharsetLengthError;
    }

    const bufferLength = randomArray.length;

    const output = [];

    for (let i = 0; i < bufferLength; i = i + 3) {
        const a = randomArray[i] || 0;
        const b = randomArray[i + 1] || 0;
        const c = randomArray[i + 2] || 0;

/*
        |------- a -------|------- b -------|------- c -------|
        | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |
        |--- first --|--- second --|--- third ---|-- fourth --|
*/

        const first = a >> 2;
        const second = ((a & 0b000011) << 4) + (b >> 4);
        const third = ((b & 0b0001111) << 2) + (c >> 6);
        const fourth = c & 0b00111111;

        output.push(charset[first]);
        output.push(charset[second]);
        output.push(charset[third]);
        output.push(charset[fourth]);
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

        this.hashLength = length || defaults.hashLength;
        this.charset = charset || defaults.charset;
        this.rng = rng || defaults.rng;

        if (this.charset.length !== 64) {
            throw new CharsetLengthError;
        }

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
                if (!newCharset || newCharset.length !== 64) {
                    throw new CharsetLengthError;
                }

                instance.charset = newCharset;
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
    bytesToChars,
    CharsetLengthError
};
