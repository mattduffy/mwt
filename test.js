const { createJWToken, checkToken } = require('./index.js')

console.log('creating a new set of tokens...')
let { token, refresh } = createJWToken({ username: 'matt', email: 'matt@email.com' }, { expiresIn: '1m', algorithm: 'RS256' })

console.log('verifying access token made from RS256 key...')
let verified = checkToken(token, { algorithm: 'RS256' })
console.dir( verified )

console.log('verifying the refresh token from RS256 key...')
let verifiedRefresh = checkToken(refresh, { algorithm: 'RS256', audience: 'refresh' })
console.log( verifiedRefresh )
