/**
 * @module @mattduffy/mft
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file index.js The Mft class definition file.
 */
import nodePath from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import { EventEmitter } from 'node:events'
import Debug from 'debug'

const __filename = fileURLToPath(import.meta.url)
const __dirname = nodePath.dirname(__filename)
const cmd = promisify(exec)
const debug = Debug('mft:class')

/**
 * A utility class to simplify the creation, encoding and decoding of JSON Web Tokens (jwt).
 * @summary A utility class to simplify the creation, encoding and decoding of JSON Web Tokens (jwt).
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @extends EventEmitter
 */
export class Mft extends EventEmitter {

}
