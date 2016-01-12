"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _crypto = require('crypto');

function RandomHashFactory() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$hashLength = _ref.hashLength;
  var hashLength = _ref$hashLength === undefined ? 6 : _ref$hashLength;
  var _ref$charset = _ref.charset;
  var charset = _ref$charset === undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' : _ref$charset;

  var RandomHash = function RandomHash() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
    bytes = (0, _crypto.randomBytes)(byteLength);
    hash = bytesToChars(bytes, charset);
    hash = hash.slice(0, hashLength);

    return hash;
  };

  Object.defineProperty(RandomHash, 'hashLength', {
    get: function get() {
      return hashLength;
    },
    set: function set(newHashLength) {
      hashLength = newHashLength;
    }
  });

  Object.defineProperty(RandomHash, 'charset', {
    get: function get() {
      return charset;
    },
    set: function set(newCharset) {
      charset = newCharset;
    }
  });

  return RandomHash;
}

exports['default'] = RandomHashFactory;

// Credit to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function bytesToChars(randomBytes, charset) {
  var bufferLength;
  var output;
  var randomArray;

  charset = charset;
  randomArray = randomBytes.toJSON();
  if (randomArray.data) {
    randomArray = randomArray.data;
  }
  bufferLength = randomArray.length;
  output = '';

  for (var i = 0; i < bufferLength; i = i + 3) {
    var a = randomArray[i] || 0;
    var b = randomArray[i + 1] || 0;
    var c = randomArray[i + 2] || 0;

    var first = a >> 2;
    var second = ((a & 3) << 4) + (b >> 4);
    var third = ((b & 15) << 2) + (c >> 6);
    var fourth = c & 63;

    output += charset[first];
    output += charset[second];
    output += charset[third];
    output += charset[fourth];
  }

  return output;
}
module.exports = exports['default'];
