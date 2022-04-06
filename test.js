const { createJWToken, checkToken } = require('./index.js')

console.log('Test 1: creating a new set of tokens...')
var { token, refresh } = createJWToken({ username: 'matt', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'RS256' }, null)

console.log('verifying the refresh token from RS256 key...')
let verified = checkToken(token, { algorithm: 'RS256' })
console.dir( verified )

console.log('verifying the refresh token from RS256 key...')
let verifiedRefresh = checkToken(refresh, { algorithm: 'RS256', audience: 'refresh' }, null)
console.log( verifiedRefresh )

let invalidToken

console.log('Test 2: failing verify check for wrong secret (invalid token)')
var { token, refresh } = createJWToken({ username: 'wrong secret', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null) 
invalidToken = checkToken(token, { algorithm: 'HS256' }, 'wrong secret')
console.log(invalidToken)

console.log('Test 3: failing verify check for invalid audience')
var { token, refresh } = createJWToken({ username: 'invalid audience', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null) 
invalidToken = checkToken(token, { algorithm: 'HS256', audience: 'blahblab' })
console.log(invalidToken)

console.log('Test 4: failing verify check for invalid issuer')
var { token, refresh } = createJWToken({ username: 'invalid issuer', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null) 
invalidToken = checkToken(token, { algorithm: 'HS256', issuer: 'blahblab' })
console.log(invalidToken)

console.log('Test 5: failing verify check for invalid jwt id')
var { token, refresh } = createJWToken({ username: 'invalid jwt id', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null) 
invalidToken = checkToken(token, { algorithm: 'HS256', jwtid: 'blahblab' })
console.log(invalidToken)

console.log('Test 6: failing verify check for invalid subject')
var { token, refresh } = createJWToken({ username: 'invalid subject', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null) 
invalidToken = checkToken(token, { algorithm: 'HS256', subject: 'blahblab' })
console.log(invalidToken)

console.log('Test 7: failing verify check for algorithm mismatch')
var { token, refresh } = createJWToken({ username: 'algorithm mismatch', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'HS256' }, null) 
invalidToken = checkToken(token, { algorithm: 'RS256' })
console.log(invalidToken)

console.log('Test 8: failing verify check - exipred')
var { token, refresh } = createJWToken({ username: 'expired token test', email: 'matt@email.com' }, { expiresIn: '10s', algorithm: 'HS256' }, null) 
setTimeout(()=>{
  console.log('waiting just over a minute for the token to expire.')
  invalidToken = checkToken(token, { algorithm: 'HS256' })
  console.log(invalidToken)
}, 12000)

