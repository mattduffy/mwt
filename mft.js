const debug = require('debug')('mft:mft')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const secrets = {
  id: process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(265).toString('hex'),
  refresh: process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(256).toString('hex')
}
debug(secrets)

