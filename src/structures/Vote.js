// eslint-disable-next-line
'use strict'
// eslint-disable-next-line
const blindSigs = require('blind-signatures')
const utils = require('./utils')
const VOTE_RIS_LENGTH = 10
const IDEN_STR = 'This is one voting right for '

/**
 * Class representing a vote.
 */
class Vote {
  /**
     * @returns {string} A string of numbers representing the blinded vote.
     */
  get blinded () {
    // check if blinded att is set.
    // if not, blind, save the factor, and return the blinded in string type.
    // eslint-disable-next-line
    if (!'_blinded' in this) {
      this._blind()
    }

    return this._blinded
  }

  /**
     * the factor used to blind this vote.
     * @returns {BigInteger}
     */
  get blindingFactor () {
    // eslint-disable-next-line
    if (!'_blinded' in this) {
      this._blind()
    }

    return this._blindingFactor
  }

  /**
     * return the vote in its raw format.
     */
  get rawVote () {
    return this._voteStr
  }

  get signature () {
    // eslint-disable-next-line
    if (!'_signature' in this) {
      // maybe throw an error
      throw new Error(`Supply governmint signature for vote ${this._guid}`)
    }

    return this._signature
  }

  get guid () {
    return this._guid
  }

  get n () {
    return this._key.keyPair.n
  }

  get e () {
    return this._key.keyPair.e
  }

  constructor (template, ssn, govE, govN, signature, rawVote, lIden, rIden) {
    if (signature == null) {
      this._voteStr = template
      this.govE = govE
      this.govN = govN
      // gen key and nounces
      this._guid = utils.getNounce()
      // i wounder if the key pair should be held by the user.
      // TODO uncomment for crypto funcionts
      // this._key = blindSigs.keyGeneration()
      this.leftIdent = []
      this.rightIdent = []
      const [leftHashes, rightHashes] = this._constructIdenArrays(ssn)
      // add nounce
      // add pub key
      // add identification hashes
      this._voteStr = this._voteStr.replace(/NOUNCE/, this._guid)
      // TODO uncomment for true functionality
      //  .replace(/E/, this.e)
      //  .replace(/N/, this.n)
        .replace(/LHASHES/, leftHashes.join('-'))
        .replace(/RHASHES/, rightHashes.join('-'))

      this._blind()
    } else {
      this._signature = signature
      this.leftIdent = lIden
      this.rightIdent = rIden
      // eslint-disable-next-line
      const { guid, issue, E, N, idenHashes } = Vote.parseVote(rawVote)
      this._voteStr = rawVote
      this._guid = guid
    }
  }

  _constructIdenArrays (ssn) {
    const leftHashes = []
    const rightHashes = []

    for (let i = 0; i < VOTE_RIS_LENGTH; i++) {
      // Making an OTP for the identity string.
      let { key, ciphertext } = utils.makeOTP({ string: `${IDEN_STR}:${ssn}` })
      // represent buffers in hex
      key = key.toString('hex')
      ciphertext = ciphertext.toString('hex')

      this.leftIdent.push(key)
      leftHashes.push(utils.hash(key))

      this.rightIdent.push(ciphertext)
      rightHashes.push(utils.hash(ciphertext))
    }
    return [leftHashes, rightHashes]
  }

  updateGovSig (s) {
    this._signature = blindSigs.unblind({
      signed: s,
      N: this.govN,
      r: this.blindingFactor
    })
  }

  getRis (isRight, index) {
    if (index >= VOTE_RIS_LENGTH || index < 0) {
      throw new Error('Invalid index requested')
    }
    let iden
    if (isRight) {
      iden = this.rightIdent[index]
    } else {
      iden = this.leftIdent[index]
    }

    return iden
  }

  _blind () {
    const { blinded, r } = blindSigs.blind({
      message: this.rawVote,
      N: this.govN,
      E: this.govE
    })
    // blinded will be a number BigInteger. need to make it a string to save it
    this._blinded = blinded.toString()
    this._blindingFactor = r
  }

  /**
     * get the string format of the vote
     * @returns {string}
     */
  toString () {
    return this.rawVote
  }

  static encode (vote) {
    const encoded = {
      signature: vote.signature.toString(),
      rawVote: vote.rawVote.toString(),
      leftIdent: vote.leftIdent,
      rightIdent: vote.rightIdent
    }
    return JSON.stringify(encoded)
  }

  static decode (s) {
    const { signature, rawVote, leftIdent, rightIdent } = JSON.parse(s)

    return new Vote(undefined, undefined, undefined, undefined, signature, rawVote, leftIdent, rightIdent)
  }

  /**
     * parses the vote string to it data.
     * @param {string} vote vote object
     * @returns {{guid:string,issue:string,idenHashes:string[][],E:string, N:string}}
     */
  static parseVote (rawVote) {
    let [issue, e, n, guid, lhashes, rhashes] = rawVote.split(':')[1].split(',')
    lhashes = lhashes.split('-')
    rhashes = rhashes.split('-')
    return {
      guid: guid,
      issue: issue,
      idenHashes: [lhashes, rhashes],
      E: e,
      N: n
    }
  }
}

exports.Vote = Vote
