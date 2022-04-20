if (!module.parent) {
  require('dotenv').config({ path: './tests/.env' }) 
}
const debug = require('debug')('mft:index')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const secrets = {
  id: process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(265).toString('hex'),
  refresh: process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(256).toString('hex')
}
debug('secrets: %o', secrets)

// const publicKey = process.env.JWT_PUBKEY || '/data/sites/nginx-sites/mattmadethese.com/nodejs/keys/jwt-public-rsa4096.pem'
// const privateKey = process.env.JWT_PUBKEY || '/data/sites/nginx-sites/mattmadethese.com/nodejs/keys/jwt-private-rsa4096.pem'
const publicKey = process.env.JWT_PUBKEY
const privateKey = process.env.JWT_PUBKEY
const keys = {
  public: fs.readFileSync(publicKey),
  private: fs.readFileSync(privateKey)
}
debug('keys: %o', keys)

const access_defaults = {
  algorithm: 'HS256',
  expiresIn: '10m',
  issuer: 'mattmadethese.com',
  subject: 'matt',
  audience: 'access',
  jwtid: _createJWTId(),
}
const refresh_defaults = {
  algorithm: 'HS256',
  expiresIn: '7d',
  issuer: 'mattmadethese.com',
  audience: 'refresh',
  subject: 'matt',
  jwtid: _createJWTId()
}

const decode_options = {
  algorithms: ['RS256', 'HS256'],
  issuer: ['mattmadethese.com'],
  audience: 'access',
  complete: true,
}

function createJWToken( payload, options ) {
  const tokenProperties = { ...access_defaults, ...options }
  debug('tokenProperties: %o', tokenProperties)
  let secretOrPrivateKey = (tokenProperties.algorithm === 'RS256') ? keys.private : secrets.id
  const token = jwt.sign(payload, secretOrPrivateKey, tokenProperties)

  const refreshProperties = { ...refresh_defaults, ...options }
  secretOrPrivateKey = (refreshProperties.algorithm === 'RS256') ? keys.private : secrets.id
  const refresh = jwt.sign(payload, secretOrPrivateKey, refreshProperties)
  return { token, refresh }
}

function checkToken( token, options, secret = null ) {
  const tokenProperties = { ...decode_options, ...options }
  debug('combined token properties:  %o', tokenProperties)
  let secretOrPublicKey = (options.algorithm === 'RS256') ? keys.public : (secret === null) ? secrets.id : secret
  let verified
  jwt.verify(token, secretOrPublicKey, tokenProperties, function(err, decoded) {
    if(err !== null) {
      debug('JWT failed to verify...')
      debug('err object keys: %o', Object.keys(err))
      debug(err.name)
      debug(err.message)
      debug(err)
      verified = {}
      switch(err.message) {
        case 'invalid signature': 
          verified.status = "FAILED TO VERIFY TOKEN - invalid signature / signing algorithm mismatch"
          verified.errorType = err.name
          verified.message = err.message
          console.log(err.message)
          break
        case err.message.match(/^jwt audience invalid/)?.input: 
          verified.status = "FAILED TO VERIFY TOKEN - invalid audience claim"
          verified.errorType = err.name
          verified.message = err.message
          console.log(err.message)
          break
        case err.message.match(/^jwt issuer invalid/)?.input: 
          verified.status = "FAILED TO VERIFY TOKEN - invalid issuer claim"
          verified.errorType = err.name
          verified.message = err.message
          console.log(err.message)
          break
        case err.message.match(/^jwt jwtid invalid/)?.input: 
          verified.status = "FAILED TO VERIFY TOKEN - jwtid mismatch"
          verified.errorType = err.name
          verified.message = err.message
          console.log(err.message)
          break
        case err.message.match(/^jwt subject invalid/)?.input: 
          verified.status = "FAILED TO VERIFY TOKEN - invalid subject claim"
          verified.errorType = err.name
          verified.message = err.message
          console.log(err.message)
          break
        case 'jwt expired': 
          verified.status = "FAILED TO VERIFY TOKEN - expired token"
          verified.errorType = err.name
          verified.message = err.message
          verified.expiredAt = err.expiredAt
          break
        default:
          verified.status = "FAILED TO VERIFY TOKEN - reason not clear"
          verified.errorType = 'JsonWebTokenError'
          verified.generic = 'generic failure message'
      }
      verified.message = err.message
      verified.error = err.name 
    } else {
      debug('JWT successfully verified and decoded. (hopefull?)')
      verified = decoded
    }
  })
  return verified
}

function _createJWTId() {
  let arr = []
  for(let i=0; i<=6; i++) {
    arr.push(crypto.randomBytes(2).toString('hex'))
  }
  return arr.join('-')
}

module.exports = {
  createJWToken,
  checkToken,
}
