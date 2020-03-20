// eslint-disable-next-line
'use strict';
const crypto = require('crypto');
const BlindSigs = require('blind-signatures');
// eslint-disable-next-line
const HASH_ALG = 'sha256';

/**
 * identifies the ssn of the cheater and returning the valid identification string
 * if found.
 * @param {string[]} ris1 
 * @param {string[]} ris2 
 * @param {string} identificationString 
 * @throws Error if identification string was not found.
 */
function revealCheater(ris1, ris2, identificationString)
{
    for(let ind = 0; ind < ris1.length; ind++)
    {
        let result = decryptOTP({
            key: Buffer.from(ris1[ind], 'hex'), 
            ciphertext: Buffer.from(ris2[ind], 'hex'), 
            returnType: 'string'});
        if(result.includes(identificationString))
        {
            return result;
        }
    }
    // if we went thourgh all ris and no result was found. throw error.
    throw new Error("was not able to identify cheater.");
}


/**
 * XORs the key with the ciphertext.  By default, this function
 * returns a buffer, but 'string' or 'buffer' may be specified.
 * @param {Object} obj
 * @param {Buffer} obj.key - list of the keys in an ris
 * @param {Buffer} obj.ciphertext - list of the ciphertext in an ris
 * @param {string} obj.returnType - return type defaults to 'buffer'
 * @author credit Dr. Thomas Austin
 */
function decryptOTP({key, ciphertext, returnType}) 
{
    if (key.length !== ciphertext.length) {
        throw new Error("The length of the key must match the length of the ciphertext.");
    }
    let p = Buffer.alloc(key.length);
    for (let i=0; i<key.length; i++) {
        p[i] = key[i] ^ ciphertext[i];
    }
    if (!returnType || returnType === 'buffer') {
        return p;
    } else if (returnType === 'string') {
        return p.toString();
    } else {
        throw new Error(`${returnType} is not supported as a return type`);
    }
}

// hash a string
// credit Dr. Thomas Austin
function hash(s) 
{
    s = s.toString()
    return BlindSigs.messageToHash(s);
}

/**
 * get a nounce as guid
 * Credit: Dr. Thomas Austin
 * @returns {String}
 */
function getNounce()
{
    return crypto.randomBytes(48).toString('hex');
}

function makeOTP({string, buffer}) {
    if ((!string && !buffer) || (!!string && !!buffer)) {
      console.log(string);
      console.log(buffer);
      throw new Error("Either string or buffer should be specified, but not both");
    }
    // If a string was specified, convert it to a buffer.
    if (string) {
      buffer = Buffer.from(string);
    }
    let key = crypto.randomBytes(buffer.length);
    let ciphertext = Buffer.alloc(buffer.length);
    for (let i=0; i<buffer.length; i++) {
      ciphertext[i] = buffer[i] ^ key[i];
      //console.log(`${ciphertext[i]} = ${buffer[i]} ^ ${key[i]}`);
    }
    return { key, ciphertext };
  }

module.exports = {
    revealCheater: revealCheater,
    getNounce: getNounce,
    hash:hash,
    makeOTP: makeOTP,
}
