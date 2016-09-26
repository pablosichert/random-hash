# random-hash
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Coverage status][coveralls-image]][coveralls-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Dev dependency status][david-dm-dev-image]][david-dm-dev-url]

## Installation
```bash
npm install random-hash
```

## Usage
Generating hashes - optional configuration in function argument
```js
import generateHash from 'random-hash';

generateHash(); // '0yyv6Z'

generateHash({ length: 4 }); // 'KLgF'

generateHash({
    charset: ['😁', '😎', '😍', '😇', '🤓', '🤔', '😴', '😝']
}); // '😝🤓😎😇😝🤔'

generateHash({
    rng: randomBytes => new Array(randomBytes).fill(0)
}); // 'aaaaaa'
```

Creating a stateful function object that stores its configuration and can be manipulated from the outside
```js
import { RandomHash } from 'random-hash';
import { randomBytes } from 'crypto';

// With options (default values)
const generateHash = new RandomHash({
    length: 6,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
    rng: randomBytes
});

// Without options
const generateHash = new RandomHash;

generateHash(); // 'VE5xn-'

generateHash({ length: 4 }); // 'E2s4'

generateHash(); // 'O1oJkK'

// Permanently setting hash length
generateHash.length = 4;

generateHash(); // 'AyHK'

// Permanently setting charset
generateHash.charset = ['😁', '😎', '😍', '😇', '🤓', '🤔', '😴'];

generateHash(); // '😴😁😁😍'

generateHash.rng = randomBytes => new Array(randomBytes).fill(0);

generateHash(); // '😁😁😁😁'
```
## Algorithm for `generateHash`
```
|----------- a1 ----------| ... |------------------------- a(n) ------------------------|
| b1 b2 b3 b4 b5 b6 b7 b8 | ... | b(n-7) b(n-6) b(n-5) b(n-4) b(n-3) b(n-2) b(n-1) b(n) |
|--- c1 ---|                               ...                               |-- c(n) --|

a(n): binary with 8 digits
b(n): binary from RNG
c(n): binary with log2(charset.length) digits

a1 ... a(ceil(hashLength * log2(charset.length) / 8))
b1 ... b(ceil(hashLength * log2(charset.length) / 8) * 8)
c1 ... c(hashLength)
```

```
charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
length = 4

|------- a1 ------|------- b2 ------|------- c3 ------|
| 0 1 1 0 0 0 1 1 | 0 1 0 1 0 1 0 0 | 0 0 0 0 0 0 0 1 | random bytes
|---- c1 ----|----- c2 ----|----- c3 ----|---- c4 ----|
|----- y ----|----- 1 -----|----- q -----|----- b ----| = 'y1qb'
```

```
Example
charset = ['😁', '😎', '😍', '😇', '🤓', '🤔', '😴', '😝', '🤑', '🤒', '😭', '😈', '👻', '👽', '🤖', '💩', '🎅', '💪', '👈', '👉', '👆', '👇', '✌', '✋', '👌', '👍', '👎', '👐', '👂', '👃', '👣', '👁']
length = 3

|------- a1 ------|------- b2 ------|
| 0 0 0 1 1 0 1 1 | 0 0 1 0 1 1 1 0 | random bytes
|--- c1 ---|---- c2 ---|--- c3 --|
|--- 😇 ---|---- 👻 ----|--- ✋ ---| = '😇👻✋'
```

[npm-url]: https://npmjs.org/package/random-hash
[npm-image]: https://badge.fury.io/js/random-hash.svg
[travis-url]: https://travis-ci.org/PabloSichert/random-hash
[travis-image]: http://img.shields.io/travis/PabloSichert/random-hash.svg
[coveralls-url]:https://coveralls.io/r/PabloSichert/random-hash
[coveralls-image]:https://coveralls.io/repos/PabloSichert/random-hash/badge.svg
[david-dm-url]:https://david-dm.org/PabloSichert/random-hash
[david-dm-image]:https://david-dm.org/PabloSichert/random-hash.svg
[david-dm-dev-url]:https://david-dm.org/PabloSichert/random-hash#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/PabloSichert/random-hash/dev-status.svg
