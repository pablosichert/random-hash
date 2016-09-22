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

generateHash(); // '0yyv6Z'

generateHash({ length: 4 }); // 'KLgF'

generateHash({
    charset: '----------------------------------------------------------------'
}); // '------'
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

generateHash(); // 'VE5xn-'

generateHash({ length: 4 }); // 'E2s4'

generateHash(); // 'O1oJkK'

// Permanently setting hash length
generateHash.length = 4;

generateHash(); // 'AyHK'

// Permanently setting charset
generateHash.charset = '----------------------------------------------------------------';

generateHash(); // '----'
```

[npm-url]: https://npmjs.org/package/random-hash
[npm-image]: https://badge.fury.io/js/random-hash.svg
[david-dm-url]:https://david-dm.org/PabloSichert/random-hash
[david-dm-image]:https://david-dm.org/PabloSichert/random-hash.svg
[david-dm-dev-url]:https://david-dm.org/PabloSichert/random-hash#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/PabloSichert/random-hash/dev-status.svg
