"use strict";

import {randomBytes} from 'crypto';

function RandomHashFactory({hashLength = 6, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'} = {}) {
  let RandomHash = function(opts = {}) {
    if (opts.hashLength) {
      hashLength = opts.hashLength;
    }
    if (opts.charset) {
      charset = opts.charset;
    }

    var byteLength;
    var hash;
    var bytes;

    byteLength = Math.ceil(hashLength / 4) * 3;
    bytes      = randomBytes(byteLength);
    hash       = bytesToChars(bytes, charset);
    hash       = hash.slice(0, hashLength);

    return hash;
  };

  Object.defineProperty(RandomHash, 'hashLength', {
    get: function() {
      return hashLength;
    },
    set: function(newHashLength) {
      hashLength = newHashLength;
    }
  });

  Object.defineProperty(RandomHash, 'charset', {
    get: function() {
      return charset;
    },
    set: function(newCharset) {
      charset = newCharset;
    }
  });

  return RandomHash;
}

export default RandomHashFactory;

// Credit to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function bytesToChars(randomBytes, charset) {
    var bufferLength;
    var output;
    var randomArray;

    charset         = charset;
    randomArray     = randomBytes.toJSON();
    if (randomArray.data) {
      randomArray = randomArray.data;
    }
    bufferLength    = randomArray.length;
    output          = '';

    for (var i = 0; i < bufferLength; i = i + 3) {
        var a = randomArray[i]      || 0;
        var b = randomArray[i + 1]  || 0;
        var c = randomArray[i + 2]  || 0;

        var first  = a >> 2;
        var second = ((a & 3) << 4) + (b >> 4);
        var third  = ((b & 15) << 2) + (c >> 6);
        var fourth = c & 63;

        output += charset[first];
        output += charset[second];
        output += charset[third];
        output += charset[fourth];
    }

    return output;
}
