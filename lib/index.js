import { randomBytes } from 'crypto';

const defaults = {
    hashLength: 6,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
};

export default function generateHash(options = {}) {
    const {
        length: hashLength = defaults.hashLength,
        charset = defaults.charset
    } = options;

    const byteLength = Math.ceil(hashLength / 4) * 3;
    const bytes = randomBytes(byteLength);

    let hash = bytesToChars(bytes, charset);
    hash = hash.slice(0, hashLength);

    return hash;
}

// Credit to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function bytesToChars(randomBytes, charset) {
    let randomArray = randomBytes.toJSON();
    if (randomArray.data) {
        randomArray = randomArray.data;
    }

    const bufferLength = randomArray.length;

    let output = '';

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

        output += charset[first];
        output += charset[second];
        output += charset[third];
        output += charset[fourth];
    }

    return output;
}

export class RandomHash {
    constructor(options = {}) {
        const {
            length,
            charset
        } = options;

        this.hashLength = length || defaults.hashLength;
        this.charset = charset || defaults.charset;

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
                instance.charset = newCharset;
            }
        });

        Object.setPrototypeOf(this.generateHash, this.constructor.prototype);

        return this.generateHash;
    }

    generateHash(options = {}) {
        const {
            length = this.hashLength,
            charset = this.charset
        } = options;

        return generateHash({
            length,
            charset
        });
    }
}
