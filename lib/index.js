'use strict';

import { randomBytes } from 'crypto';

function RandomHashFactory({ hashLength = 6, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' } = {}) {
    const RandomHash = function (opts = {}) {
        if (opts.hashLength) {
            hashLength = opts.hashLength;
        }
        if (opts.charset) {
            charset = opts.charset;
        }

        let byteLength;
        let hash;
        let bytes;

        byteLength = Math.ceil(hashLength / 4) * 3;
        bytes = randomBytes(byteLength);
        hash = bytesToChars(bytes, charset);
        hash = hash.slice(0, hashLength);

        return hash;
    };

    Object.defineProperty(RandomHash, 'hashLength', {
        get() {
            return hashLength;
        },
        set(newHashLength) {
            hashLength = newHashLength;
        }
    });

    Object.defineProperty(RandomHash, 'charset', {
        get() {
            return charset;
        },
        set(newCharset) {
            charset = newCharset;
        }
    });

    return RandomHash;
}

export default RandomHashFactory;

// Credit to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function bytesToChars(randomBytes, charset) {
    let bufferLength;
    let output;
    let randomArray;

    charset = charset;
    randomArray = randomBytes.toJSON();
    if (randomArray.data) {
        randomArray = randomArray.data;
    }
    bufferLength = randomArray.length;
    output = '';

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
