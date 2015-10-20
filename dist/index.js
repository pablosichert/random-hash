"use strict";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _crypto = require('crypto');

var RandomHash = (function () {
  function RandomHash() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$hashLength = _ref.hashLength;
    var hashLength = _ref$hashLength === undefined ? 6 : _ref$hashLength;
    var _ref$charset = _ref.charset;
    var charset = _ref$charset === undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' : _ref$charset;

    _classCallCheck(this, RandomHash);

    this.hashLength = hashLength;
    this.charset = charset;
  }

  // Contribution to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040

  _createClass(RandomHash, [{
    key: 'generate',
    value: function generate() {
      var byteLength;
      var hash;
      var bytes;

      byteLength = Math.ceil(this.hashLength / 4) * 3;
      bytes = (0, _crypto.randomBytes)(byteLength);
      hash = bytesToChars(bytes, this.charset);
      hash = hash.slice(0, this.hashLength);

      return hash;
    }
  }]);

  return RandomHash;
})();

exports['default'] = RandomHash;
function bytesToChars(randomBytes, charset) {
  var bufferLength;
  var output;
  var randomArray;

  charset = charset;
  randomArray = randomBytes.toJSON().data;
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
