import { randomBytes } from 'crypto';
import expect from 'unexpected';

import {
    generateHash,
    bytesToChars,
    CharsetLengthError
} from '../lib';

const _generateHash = generateHash;

describe('generateHash', () => {
    it('should generate hash using the default RNG crypto.randomBytes', () => {
        expect(generateHash(), 'to match', /[a-zA-Z0-9_-]{6}/);
    });

    describe('{ rng }', () => {
        it('should take a custom RNG', () => {
            const rng = numBytes => {
                const numBits = numBytes * 8;
                const randomArray = new Array(numBits);

                for (let i = 0; i < numBits; i += 2) {
                    randomArray[i] = 1;
                    randomArray[i + 1] = 0;
                }

                return Buffer.from(randomArray);
            };

            expect(generateHash({ rng }), 'to be', 'aqabaa');
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
                const charset = ['😁', '😎', '😍', '😇', '🤓', '🤔', '😴', '😝', '🤑', '🤒', '😭', '😈', '👻', '👽', '🤖', '💩', '🎅', '💪', '👈', '👉', '👆', '👇', '✌', '✋', '👌', '👍', '👎', '👐', '👂', '👃', '👣', '👁', '💋', '❤', '💣', '👕', '👖', '🐵', '🦁', '🐮', '🐷', '🐘', '🐔', '🐸', '🐊', '🐢', '🐍', '🐬', '🐟', '🐙', '🦀', '🐝', '🕷', '🌸', '🌲', '🍉', '🍎', '🍄', '🌍', '🚁', '🚀', '☀', '⚡', '❄'];

                expect(generateHash({ charset }), 'to be', '😁🎅😁😎😁😁');
            });

            it('should throw if charset does not contain exactly 64 characters', () => {
                const charset = ['a, b, c'];

                try {
                    generateHash({ charset });
                } catch (error) {
                    expect(error, 'to be a', CharsetLengthError);
                }
            });
        });
    });
});

describe('bytesToChars', () => {
    const arrayToBytes = array => {
        const bits = Array.from(array.reduce((prev, curr) => {
            return prev + curr;
        }, ''));

        const packs = [];

        while (bits.length) {
            let byte = bits.splice(0, 8);
            byte = Number('0b' + byte.join(''));

            packs.push(byte);
        }

        return packs;
    };

    it('should convert an iterable containing bytes to chars', () => {
        const selectFromChars = ['000001', '000010', '000011', '000100'];

        const randomIterable = arrayToBytes(selectFromChars);
        // ['00000100', '00100000', '11000100']

        const charset = {
            length: 64,
            0b000001/* 1 */: 'A',
            0b000010/* 2 */: 'B',
            0b000011/* 3 */: 'C',
            0b000100/* 4 */: 'D'
        };

        const chars = bytesToChars(randomIterable, charset);

        expect(chars, 'to satisfy', ['A', 'B', 'C', 'D']);
    });

    it('should pick from any charset that has a getter and length 64', () => {
        const randomIterable = Buffer.from([1, 2, 3]);

        const charset = new Proxy({
            length: 64
        }, {
            get: (target, name) => {
                return target[name] || 'foo';
            }
        });

        const chars = bytesToChars(randomIterable, charset);

        expect(chars, 'to satisfy', ['foo', 'foo', 'foo', 'foo']);
    });

    it('should throw if charset does not contain exactly 64 characters', () => {
        const charset = ['a, b, c'];

        try {
            bytesToChars(randomBytes(1), charset);
        } catch (error) {
            expect(error, 'to be a', CharsetLengthError);
        }
    });
});
