# random-hash
[![NPM version][npm-image]][npm-url]
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

console.log(generateHash()); // '0yyv6Z'

console.log(generateHash({ length: 4 })); // 'KLgF'

console.log(generateHash({
    charset: '----------------------------------------------------------------'
})); // '------'
```

Creating a stateful function object that stores its configuration and can be manipulated from the outside
```js
import { RandomHash } from 'random-hash';

// With options (default values)
let generateHash = new RandomHash({
    length: 6,
    charset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
});

// Without options
let generateHash = new RandomHash;

console.log(generateHash()); // 'VE5xn-'

console.log(generateHash({ length: 4 })); // 'E2s4'

console.log(generateHash()); // 'O1oJkK'

// Permanently setting hash length
generateHash.length = 4;

console.log(generateHash()); // 'AyHK'

// Permanently setting charset
generateHash.charset = '----------------------------------------------------------------';

console.log(generateHash()); // '----'
```

[npm-url]: https://npmjs.org/package/random-hash
[npm-image]: https://badge.fury.io/js/random-hash.svg
[david-dm-url]:https://david-dm.org/PabloSichert/random-hash
[david-dm-image]:https://david-dm.org/PabloSichert/random-hash.svg
[david-dm-dev-url]:https://david-dm.org/PabloSichert/random-hash#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/PabloSichert/random-hash/dev-status.svg
