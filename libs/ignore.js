/**
 * Ignore utility module
 * @module ignore
 */

const ignore =  require('ignore')
const findUp = require('find-up')
const path = require('path')
const {existsSync, readFileSync} = require('fs-extra')
const {split, map, filter, isString, some} = require('lodash')


let cache = {}

/**
 * The Ignore Class supporting the `.gitignore` patterns
 */
class Ignore {

  /**
   * Create an ignore instance
   * @constructor
   * @param {String} [ignoreFileName=.gitignore] The target ignore file name
   */
  constructor (ignoreFileName = '.gitignore') {
    this.ignoreFileName = ignoreFileName
    this._init()
  }

  _init () {
    this.ignoreFile = findUp.sync(this.ignoreFileName)
    if (!existsSync(this.ignoreFile)) return
    this.ignoreText = readFileSync(this.ignoreFile, 'utf-8')
    this.ig = ignore().add(
      filter(
        map(
          split(this.ignoreText, '\n'),
          line => line.trim()
        ),
        line0 => !!line0
      )
    )
  }
  /**
   * Check a string whether is ignored
   * @param {*} str The string that to be checked
   * @returns {Boolean} The testing result
   */
  isIgnore (str) {
    if (!this.ig) return false
    return this.ig.ignores(path.relative('/',str))
  }
  /**
   * Reset cache of the ignore file
   */
  reset () {
    this._init()
  }
}

/**
 * Test whether a string is matching the .gitignore patterns
 * @param {String} str The string that to be tested
 * @param {String|String[]} [ignoreFiles=.gitignore] The ignore files
 * @static
 * @returns {Boolean} The testing result
 */
function isIgnore (str, ignoreFiles = '.gitignore') {

  if (isString(ignoreFiles)) {
    ignoreFiles = [ignoreFiles]
  }

  let igs = map(ignoreFiles, f => {
    if (cache[f]) return cache[f]
    cache[f] = new Ignore(f)
    return cache[f]
  })

  return some(igs, ig => ig.isIgnore(str))

}

Ignore.isIgnore = isIgnore

module.exports = Ignore
