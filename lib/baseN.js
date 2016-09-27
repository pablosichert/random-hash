export class CharsetLengthError extends Error {
    constructor(length) {
        super(`Charset needs to contain exactly 2^n characters. ${length} is not a power of 2.`);
    }
}

export function charLength(charset) {
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

export function createEncoding(charset) {
    const _charLength = charLength(charset);

    const encodeBaseN = bytes => {
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
    };

    Object.defineProperty(encodeBaseN, 'name', {
        value: 'encodeBase' + charset.length,
        configurable: true
    });

    return encodeBaseN;
}
