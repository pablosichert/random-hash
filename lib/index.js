"use strict";

// Require dependencies
var crypto = require('crypto');

// Options
var options = {
    charset:    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
    hashLength: 6
};


function randomHash(hashLength) {
    
    var byteLength;
    var hash;
    var randomBytes;
    
    hashLength  = hashLength || options.hashLength;
    byteLength  = Math.ceil(hashLength / 4) * 3; // Encoding with baseMoritz gets you 4 characters per 3 bytes
    randomBytes = crypto.randomBytes(byteLength);
    hash        = toBaseMoritz(randomBytes, options.charset);
    hash        = hash.slice(0, hashLength);
    
    return hash;

}


// Contribution to Moritz Sichert https://gist.github.com/MoritzS/16c820f5e2d6132d7040
function toBaseMoritz(randomBytes, charset) {

    var bufferLength;
    var output;
    var randomArray;
    
    charset         = charset || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    randomArray     = randomBytes.toJSON();
    bufferLength    = randomArray.length;
    output          = '';
    
    if (randomArray.data) {
        randomArray = randomArray.data;
    }
    
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


function setCharset(newCharset) {

    if (newCharset.length !== 64) {
    
        return;

    } else {
        
        options.charset = newCharset;
        
    }
}


module.exports          = randomHash;
module.exports.charset  = setCharset;
