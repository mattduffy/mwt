/**
 * @module @mattduffy/mft
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file index.js The Mft class definition file.
 */
import nPath from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import { EventEmitter } from 'node:events'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import Debug from 'debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = nPath.dirname(__filename)
const cmd = promisify(exec)
const debug = Debug('mft:class')

/**
 * A utility class to simplify the creation, encoding and decoding of JSON Web Tokens (jwt).
 * @summary A utility class to simplify the creation, encoding and decoding of JSON Web Tokens (jwt).
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @extends EventEmitter
 */
export class Mft extends EventEmitter {
  constructor() {
    super()
    this.pubPEMPath = nPath.resolve('.', process.env.JWT_PUBKEY) || null
    this.priPEMPath = nPath.resolve('.', process.env.JWT_PRIKEY) || null
    this.pubPEMBuffer = null
    this.priPEMBuffer = null
  }

  async init() {
    this.pubPEMBuffer = await fs.readFile(this.pubPEMPath)
    this.priPEMBuffer = await fs.readFile(this.priPEMPath)
  }
}
