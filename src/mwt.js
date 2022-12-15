import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import Debug from 'debug'

const debug = Debug('mwt:index')
const secrets = {
  id: process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(265).toString('hex'),
  refresh: process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(256).toString('hex'),
}

debug(secrets)
