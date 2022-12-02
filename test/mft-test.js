/**
 * @module @mattduffy/mft
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file test/mft-test.js A Mocha test suite testing the methods of the Mft class.
 */
/* eslint-disable import/first */
process.env.NODE_ENV = 'test'
import nPath from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import chai from 'chai'
import chaiHttp from 'chai-http'
import Debug from 'debug'
import { Mft } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = nPath.dirname(__filename)
const debug = Debug('mft:test')
const cmd = promisify(exec)
const should = chai.should()
chai.use(chaiHttp)

/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-undef */
describe('jwt token service', function () {
  before('suite hook before all tests', function () {
    // nothing here yet
  })
  beforeEach('suite hook beforeEach test', function () {
    // nothing here yet
  })
  after('suite hook after all tests', function () {
    // nothing here yet
  })
  afterEach('suite hook afterEach test', function () {
    // nothing here yet
  })
  describe('Mft class', function () {
    it('should return an mft instance', function () {
      debug('create an mft instance...')
    })
  })
})
