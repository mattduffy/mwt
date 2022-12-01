/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-redeclare */
const debug = require('debug')('mft:test')
const { createJWToken, checkToken } = require('../src/index.js')

debug('Test 1: creating a new set of tokens...')
var { token, refresh } = createJWToken({ username: 'matt', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'RS256' }, null)

debug('verifying the refresh token from RS256 key...')
const verified = checkToken(token, { algorithm: 'RS256' })
debug(verified)

debug('verifying the refresh token from RS256 key...')
const verifiedRefresh = checkToken(refresh, { algorithm: 'RS256', audience: 'refresh' }, null)
debug(verifiedRefresh)

let invalidToken

debug('Test 2: failing verify check for wrong secret (invalid token)')
var { token, refresh } = createJWToken({ username: 'wrong secret', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
invalidToken = checkToken(token, { algorithm: 'HS256' }, 'wrong secret')
debug(invalidToken)

debug('Test 3: failing verify check for invalid audience')
var { token, refresh } = createJWToken({ username: 'invalid audience', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
invalidToken = checkToken(token, { algorithm: 'HS256', audience: 'blahblab' })
debug(invalidToken)

debug('Test 4: failing verify check for invalid issuer')
var { token, refresh } = createJWToken({ username: 'invalid issuer', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
invalidToken = checkToken(token, { algorithm: 'HS256', issuer: 'blahblab' })
debug(invalidToken)

debug('Test 5: failing verify check for invalid jwt id')
var { token, refresh } = createJWToken({ username: 'invalid jwt id', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
invalidToken = checkToken(token, { algorithm: 'HS256', jwtid: 'blahblab' })
debug(invalidToken)

debug('Test 6: failing verify check for invalid subject')
var { token, refresh } = createJWToken({ username: 'invalid subject', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
invalidToken = checkToken(token, { algorithm: 'HS256', subject: 'blahblab' })
debug(invalidToken)

debug('Test 7: failing verify check for algorithm mismatch')
var { token, refresh } = createJWToken({ username: 'algorithm mismatch', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
invalidToken = checkToken(token, { algorithm: 'RS256' })
debug(invalidToken)

debug('Test 8: failing verify check - jwt malformed')
var { token, refresh } = createJWToken({ username: 'jwt malformed', email: 'mal@formed.mail' }, { expiresIn: '1m', algorithm: 'HS256' }, null)
token = token.replace('.', '_')
invalidToken = checkToken(token, { algorith: 'HS256' })
debug(invalidToken)

debug('Test 9: failing verify check - exipred')
var { token, refresh } = createJWToken({ username: 'expired token test', email: 'matt@email.com' }, { expiresIn: '10s', algorithm: 'HS256' }, null)
setTimeout(() => {
  debug('waiting just over a minute for the token to expire.')
  invalidToken = checkToken(token, { algorithm: 'HS256' })
  debug(invalidToken)
}, 12000)
