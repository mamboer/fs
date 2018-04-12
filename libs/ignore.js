import ignore from 'ignore'
import findUp from 'find-up'
import {existsSync, readFileSync} from 'fs-extra'
import {split, map, filter, isString, some} from 'lodash'


let cache = {}

/**
 * An Ignore Object
 */
class Ignore {

  /**
   * Contruct an ignore object
   * @param {String} ignoreFileName ignore file name
   */
  constructor (ignoreFileName) {
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
   * @param {*} str string that to be checked
   */
  isIgnore (str) {
    if (!this.ig) return false
    return this.ig.ignores(str)
  }
  /**
   * reset cache
   */
  reset () {
    this._init()
  }
}

/**
 * Test whether a string is matching the .gitignore patterns
 * @param {String} str string that to be tested
 * @param {String|String[]} ignoreFiles ignore files, default is `.gitignore`
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

export default Ignore
