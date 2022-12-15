/**
 * This package is meant to provide some functions to make working with
 * json web tokens more convenient.  The package wraps the jsonwebtoken npm
 * package.  JWTs can be created from either 256 bit random strings or an
 * 4096 bit RSA key pair.  These package is meant to be used with the
 * @mattduffy/users package for token-based authentication.
 * @summary A package that provides some JWT functionality.
 * @module @mattduffy/mwt
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file: src/pratice.js Declarative approach to working with JWTs.
 */
import fs from 'node:fs'
// import fsAsync from 'node:fs/promises'
import nodePath from 'node:path'
import { fileURLToPath } from 'node:url'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import Debug from 'debug'
import * as dotenv from 'dotenv'

const debug = Debug('mwt:practice')
dotenv.config({ path: nodePath.resolve('.', './test/.env'), debug: true })

const secrets = {
  id: process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(265).toString('hex'),
  refresh: process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(256).toString('hex'),
}
debug('secrets: %O', secrets)

function _createJWTId() {
  const arr = []
  for (let i = 0; i <= 6; i += 1) {
    arr.push(crypto.randomBytes(2).toString('hex'))
  }
  return arr.join('-')
}

let keys = null
try {
  const publicKey = nodePath.resolve('.', process.env.JWT_PUBKEY)
  const privateKey = nodePath.resolve('.', process.env.JWT_PRIKEY)
  keys = {
    public: fs.readFileSync(publicKey),
    publicPath: publicKey,
    private: fs.readFileSync(privateKey),
    privatePath: privateKey,
  }
  debug('keys: %O', keys)
} catch (err) {
  debug('There was a problem reading the RSA key files.')
  debug(err.message)
}

const accessDefaults = {
  algorithm: 'HS256',
  expiresIn: '10m',
  issuer: 'mattmadethese.com',
  subject: 'matt',
  audience: 'access',
  jwtid: _createJWTId(),
}
const refreshDefaults = {
  algorithm: 'HS256',
  expiresIn: '7d',
  issuer: 'mattmadethese.com',
  audience: 'refresh',
  subject: 'matt',
  jwtid: _createJWTId(),
}

const decodeOptions = {
  algorithms: ['RS256', 'HS256'],
  issuer: ['mattmadethese.com'],
  audience: 'access',
  complete: true,
}

/**
 * Create a pair of JSON Web Tokens based on the values provided by the payload
 * argument, combined with the default options.
 * @param {Object} payload - An object literal containing JWT payload claims.
 * @param {Object} options - An object literal containing JWT header claims.
 * @return {Object} - An object literal containing a pair of tokens.
 */
function createJWToken(payload, options) {
  const o = options
  o.algorithm = options.algorithm.toUpperCase()
  const tokenProperties = { ...accessDefaults, ...o }
  debug('tokenProperties: %o', tokenProperties)
  let secretOrPrivateKey = (tokenProperties.algorithm === 'RS256') ? keys.private : secrets.id
  debug(secretOrPrivateKey)
  const token = jwt.sign(payload, secretOrPrivateKey, tokenProperties)

  const refreshProperties = { ...refreshDefaults, ...o }
  secretOrPrivateKey = (refreshProperties.algorithm === 'RS256') ? keys.private : secrets.id
  const refresh = jwt.sign(payload, secretOrPrivateKey, refreshProperties)
  return { token, refresh }
}

/**
 * Verify a supplied token based on the claims provided in the options argument.
 * @param {JsonWebToken} token - A JSON Web Token.
 * @param {Object} options - An object literal of claims to validate the token against.
 * @param {(Buffer|string)} secret - A PEM encoded public key for RSA or a string
 * secret for HMAC algorithms.
 * @return {(Object|Error)} - The decoded payload or throws an Error.
 */
function checkToken(token, options, secret = null) {
  const o = options
  o.algorithm = options.algorithm.toUpperCase()
  const tokenProperties = { ...decodeOptions, ...o }
  debug('combined token properties:  %o', tokenProperties)
  /* eslint-disable-next-line no-nested-ternary */
  const secretOrPublicKey = (o.algorithm === 'RS256') ? keys.public : (secret === null) ? secrets.id : secret
  let verified
  jwt.verify(token, secretOrPublicKey, tokenProperties, (err, decoded) => {
    if (err !== null) {
      debug('JWT failed to verify...')
      debug('err object properties: %O', Object.entries(err))
      debug(err.name, err.message)
      verified = {}
      verified.error = 'Error'
      verified.message = err?.message
      verified.error = err?.name
      switch (err.message) {
        case 'invalid token':
          verified.status = 'The header or payload could not be parsed.'
          debug(err.message)
          break
        case 'jwt malformed':
          verified.status = 'The token does not have three components (delimited by a .).'
          debug(err.message)
          break
        case 'jwt signature is required':
          verified.status = 'The token cannot be verified without a signature.'
          debug(err.message)
          break
        case 'invalid signature':
          verified.status = 'FAILED TO VERIFY TOKEN - invalid signature / signing algorithm mismatch'
          // verified.errorType = err.name
          // verified.message = err.message
          debug(err.message)
          break
        case 'jwt expired':
          verified.status = 'FAILED TO VERIFY TOKEN - expired token'
          verified.expiredAt = err.expiredAt
          // verified.errorType = err.name
          // verified.message = err.message
          debug(err.message)
          break
        case err.message.match(/^jwt audience invalid/)?.input:
          verified.status = 'FAILED TO VERIFY TOKEN - invalid audience claim'
          // verified.errorType = err.name
          // verified.message = err.message
          debug(err.message)
          break
        case err.message.match(/^jwt issuer invalid/)?.input:
          verified.status = 'FAILED TO VERIFY TOKEN - invalid issuer claim'
          // verified.errorType = err.name
          // verified.message = err.message
          debug(err.message)
          break
        case err.message.match(/^jwt id invalid/)?.input:
          verified.status = 'FAILED TO VERIFY TOKEN - jwtid mismatch'
          // verified.errorType = err.name
          // verified.message = err.message
          debug(err.message)
          break
        case err.message.match(/^jwt subject invalid/)?.input:
          verified.status = 'FAILED TO VERIFY TOKEN - invalid subject claim'
          // verified.errorType = err.name
          // verified.message = err.message
          debug(err.message)
          break
        default:
          verified.status = 'FAILED TO VERIFY TOKEN - reason not clear'
          verified.errorType = 'JsonWebTokenError'
          verified.message = 'Generic failure message.'
          verified.error = 'Unspecified error.'
          debug(err.message)
      }
    } else {
      debug('JWT successfully verified and decoded. (hopefull?)')
      verified = decoded
    }
  })
  return verified
}

export {
  createJWToken,
  checkToken,
}
