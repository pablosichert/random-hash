import expect from 'unexpected';

import {
    generateHash,
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
