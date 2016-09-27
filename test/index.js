import { randomBytes } from 'crypto';
import expect from 'unexpected';

import {
    generateHash,
    RandomHash,
    createEncoding,
    CharsetLengthError
} from '../lib';

const _generateHash = generateHash;

describe('generateHash', () => {
    it('should generate hash using the default RNG crypto.randomBytes', () => {
        expect(generateHash(), 'to match', /[a-zA-Z0-9_-]{6}/);
    });

    describe('{ rng }', () => {
        it('should take a custom RNG', () => {
            const rng = () => {
                return [0b10101010, 0b10101010, 0b10101010];
            };

            expect(generateHash({ rng }), 'to be', 'QQQQ');
        });
    });

    describe('with rng mocked out', () => {
        const rng = numBytes => {
            const numBits = numBytes * 8;
            const randomArray = new Array(numBits);

            for (let i = 0; i < numBits; i += 2) {
                randomArray[i] = 1;
                randomArray[i + 1] = 0;
            }

            return Buffer.from(randomArray);
        };

        const generateHash = opts => _generateHash({ rng, ...opts });

        describe('{ length }', () => {
            it('should be able to specify the output length', () => {
                for (let i = 0; i < 100; i++) {
                    expect(generateHash({ length: i }), 'to have length', i);
                }
            });
        });

        describe('{ charset }', () => {
            it('should be able to specify the charset', () => {
                for (let i = 1; i < 10; i++) {
                    const charset = new Proxy({
                        length: Math.pow(2, i)
                    }, {
                        get: (target, name) => {
                            return target[name] || 'foo';
                        }
                    });

                    expect(generateHash({ charset }), 'to be', 'foofoofoofoofoofoo');
                }
            });

            it('should throw if charset does not contain 2^n characters', () => {
                for (let i = 0; i < 10; i++) {
                    const charset = i && {
                        length: Math.pow(2, i) + 1
                    };

                    try {
                        generateHash({ charset });
                    } catch (error) {
                        expect(error, 'to be a', CharsetLengthError);
                    }
                }
            });
        });
    });
});

describe('createEncoding', () => {
    it('should return a function called encodeBase{charset.length}', () => {
        for (let i = 1; i < 10; i++) {
            const charset = {
                length: Math.pow(2, i)
            };

            const encode = createEncoding(charset);

            expect(encode.name, 'to be', `encodeBase${charset.length}`);
        }
    });

    it('should throw if charset does not contain 2^n characters', () => {
        for (let i = 0; i < 10; i++) {
            const charset = i && {
                length: Math.pow(2, i) + 1
            };

            try {
                createEncoding(charset);
            } catch (error) {
                expect(error, 'to be a', CharsetLengthError);
            }
        }
    });

    describe('encode', () => {
        const arrayToBytes = array => {
            const bits = Array.from(array.reduce((prev, curr) => {
                return prev + curr;
            }, ''));

            const packs = [];

            while (bits.length) {
                let byte = bits.splice(0, 8);
                if (byte.length !== 8) {
                    byte = Number('0b' + byte.join('')) << 8 - byte.length;
                } else {
                    byte = Number('0b' + byte.join(''));
                }

                packs.push(byte);
            }

            return packs;
        };

        it('should convert an iterable containing bytes to chars', () => {
            const selectFromChars = ['000', '001', '010', '011', '100', '101', '110', '111'];
            /*
                0 0 0|0 0 1|0 1 0|0 1 1|1 0 0|1 0 1|1 1 0|1 1 1 = selectFromChars
                0 0 0 0 0 1 0 1|0 0 1 1 1 0 0 1|0 1 1 1 0 1 1 1 = bytes
            */
            const bytes = arrayToBytes(selectFromChars);
            // ['00000101', '00111001', '01110111']

            const charset = {
                length: 8,
                0b000/* 0 */: 'A',
                0b001/* 1 */: 'B',
                0b010/* 2 */: 'C',
                0b011/* 3 */: 'D',
                0b100/* 4 */: 'E',
                0b101/* 5 */: 'F',
                0b110/* 6 */: 'G',
                0b111/* 7 */: 'H'
            };

            const encode = createEncoding(charset);
            const chars = encode(bytes);

            expect(chars, 'to satisfy', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
        });

        it('should pick from any charset that has a getter and length 2^n', () => {
            for (let i = 1; i < 10; i++) {
                const charset = new Proxy({
                    length: Math.pow(2, i)
                }, {
                    get: (target, name) => {
                        return target[name] || 'foo';
                    }
                });

                const encode = createEncoding(charset);
                const chars = encode(randomBytes(1));

                expect(chars, 'to satisfy', expect.it('to have items satisfying',
                    'to be', 'foo'
                ));
            }
        });

        it('should produce hashes of length ceil(byteLength * 8 / log2(charset.length))', () => {
            for (let i = 1; i < 10; i++) {
                const charset = {
                    length: Math.pow(2, i)
                };

                const encode = createEncoding(charset);

                for (let j = 1; j < 100; j++) {
                    const expectedLength = Math.ceil(j * 8 / i);

                    const hash = encode(randomBytes(j));

                    expect(hash.length, 'to be', expectedLength);
                }
            }
        });
    });
});

describe('RandomHash', () => {
    it('should return a generateHash() instance', () => {
        const generateHash = new RandomHash;

        expect(generateHash, 'to be a', RandomHash);
        expect(generateHash, 'to be a function');
    });

    it('should save its options', () => {
        const length = 123;
        const charset = 'abcd';
        const rng = () => [];

        const generateHash = new RandomHash({
            length,
            charset,
            rng
        });

        expect(generateHash.length, 'to be', 123);
        expect(generateHash.charset, 'to be', 'abcd');
        expect(generateHash.rng, 'to be', rng);
    });

    it('should be able to modify options', () => {
        const length = 123;
        const charset = 'abcd';
        const rng = () => [];

        const generateHash = new RandomHash;

        generateHash.length = length;
        generateHash.charset = charset;
        generateHash.rng = rng;

        expect(generateHash.length, 'to be', 123);
        expect(generateHash.charset, 'to be', 'abcd');
        expect(generateHash.rng, 'to be', rng);
    });

    it('should call generateHash depending on its internal options', () => {
        const generateHash = new RandomHash;

        expect(generateHash(), 'to match', /[a-zA-Z0-9_-]{6}/);

        generateHash.length = 10;

        expect(generateHash(), 'to match', /[a-zA-Z0-9_-]{10}/);

        generateHash.charset = ['😁', '😎', '😍', '😇'];

        expect(generateHash(), 'to match', /[😁😎😍😇]{10}/);

        generateHash.rng = byteLength => new Array(byteLength).fill(0);

        expect(generateHash(), 'to match', /[😁]{10}/);
    });
});
