/**
 * @module @mattduffy/mwt
 * @author Matthew Duffy <mattduffy@gmail.com>
 * @file test/mwt-test.js A Mocha test suite testing the methods of the Mwt class.
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
import { Mwt } from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = nPath.dirname(__filename)
const debug = Debug('mwt:test')
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
  describe('Mwt class', function () {
    it('should return an mwt instance', function () {
      debug('create an mwt instance...')
    })
  })
})
