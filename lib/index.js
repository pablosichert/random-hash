"use strict";

import {randomBytes} from 'crypto';

export class randomHash {
  constructor({hashLength = 6, charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'} = {}) {
    this.hashLength = hashLength;
    this.charset = charset;
  }

  generate() {
    var byteLength;
    var hash;
    var bytes;

    byteLength = Math.ceil(this.hashLength / 4) * 3;
    bytes      = randomBytes(byteLength);
    hash       = bytesToChars(bytes, this.charset);
    hash       = hash.slice(0, this.hashLength);

    return hash;
  }
}

// Contribution to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function bytesToChars(randomBytes, charset) {
    var bufferLength;
    var output;
    var randomArray;
    
    charset         = charset;
    randomArray     = randomBytes.toJSON().data;
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
