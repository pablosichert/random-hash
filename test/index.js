import expect from 'unexpected';

import {
    generateHash,
    RandomHash,
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
