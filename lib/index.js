import { randomBytes } from 'crypto';

const defaults = {
    hashLength: 6,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
};

export default function RandomHash(options = {}) {
    let {
        length: _hashLength = defaults.hashLength,
        charset: _charset = defaults.charset
    } = options;

    const _generateHash = (options = {}) => {
        const {
            length = _hashLength,
            charset = _charset
        } = options;

        return generateHash({
            length,
            charset
        });
    };

    Object.defineProperty(_generateHash, 'length', {
        get() {
            return _hashLength;
        },
        set(newHashLength) {
            _hashLength = newHashLength;
        }
    });

    Object.defineProperty(_generateHash, 'charset', {
        get() {
            return _charset;
        },
        set(newCharset) {
            _charset = newCharset;
        }
    });

    return _generateHash;
}

export function generateHash(options = {}) {
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

        const first = a >> 2;
        const second = ((a & 3) << 4) + (b >> 4);
        const third = ((b & 15) << 2) + (c >> 6);
        const fourth = c & 63;

        output += charset[first];
        output += charset[second];
        output += charset[third];
        output += charset[fourth];
    }

    return output;
}
