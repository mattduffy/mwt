const debug = require('debug')('@mattduffy/mft')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const secrets = {
  id: process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(265).toString('hex'),
  refresh: process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(256).toString('hex')
}
debug('secrets', secrets)
// console.log('secrets', secrets)

const publicKey = process.env.JWT_PUBKEY || '/data/sites/nginx-sites/mattmadethese.com/nodejs/keys/jwt-public-rsa4096.pem'
const privateKey = process.env.JWT_PUBKEY || '/data/sites/nginx-sites/mattmadethese.com/nodejs/keys/jwt-private-rsa4096.pem'
const keys = {
  public: fs.readFileSync(publicKey),
  private: fs.readFileSync(privateKey)
}
// console.log('keys', keys)
// console.log('public key: ', keys.public.toString('hex'))
// console.log('private key: ', keys.private.toString('hex'))

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
  console.log('tokenProperties: ', tokenProperties)
  let secretOrPrivateKey = (tokenProperties.algorithm === 'RS256') ? keys.private : secrets.id
  console.log('secretOrPrivateKey: ', secretOrPrivateKey)
  const token = jwt.sign(payload, secretOrPrivateKey, tokenProperties)

  const refreshProperties = { ...refresh_defaults, ...options }
  secretOrPrivateKey = (refreshProperties.algorithm === 'RS256') ? keys.private : secrets.id
  const refresh = jwt.sign(payload, secretOrPrivateKey, refreshProperties)
  return { token, refresh }
}

function checkToken( token, options ) {
  console.log('options: ', options)
  const tokenProperties = { ...decode_options, ...options }
  console.log(tokenProperties)
  let secretOrPublicKey = (options.algorithm === 'RS256') ? keys.public : secrets.id
  let verified
  try {
    verified = jwt.verify(token, secretOrPublicKey, tokenProperties)
  } catch (e) {
    // console.dir(e)
    verified = e
  }
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
