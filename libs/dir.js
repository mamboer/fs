/**
 * A directory utility module
 * @module dir
 */

/**
 * The json object representing a directory or a file
 * @typedef {Object} FSItem
 * @property {String} name - The name of the directory or file
 * @property {String} path - The absolute path of the directory or file
 * @property {String} type - The FSItem type, possible values are `directory` and `file`
 * @property {Number} size - The size of the directory or file
 * @property {Number} level - The level of the directory or file, note that the root directory has a level with `0`
 * @property {FSItem[]} children - The children of the current directory
 * @property {String} extension - The extension of the current file
 */

 /**
  * RegExp Or RegExp[] Or Function
  * @typedef RegExpsOrFunction
  */

/**
  * String Or Boolean
  * @typedef StringOrBoolean
  */

const {readdir, stat, readdirSync, statSync} = require('fs-extra')
const {join, basename, extname} = require('path')
const assert = require('assert')
const {merge, map, filter} = require('lodash')
const {fn0, fn1, fn2} = require('./dummy')
const consts = require('./consts')
const {backslashToSlash, test} = require('./str')
const Ignore = require('./ignore')

/**
 * Walk a directory recursively and return a json tree
 * @async
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExpsOrFunction} opts.includes Apply including regex or function on both directory and file
 * @param {RegExpsOrFunction} opts.excludes Apply excluding regex or function on both directory and file
 * @param {Function} opts.onStep Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {StringOrBoolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {Promise<FSItem>} A json tree representing the target directory
 */
async function walk (dir, opts, level = 0) {
  assert.ok(!!dir, `The 'dir' parameter must be provided.`)

  opts = merge({
    includes: fn1,
    excludes: fn0,
    onStep: fn2,
    ignoreNotAccessible: true,
    normalizePath: true,
    maxLevel: -1,
    gitignore: '.gitignore',
    extensions: null
  }, opts || {})

  // exclusion
  if (test(dir, opts.excludes)) return null
  // inclusion
  if (!test(dir, opts.includes)) return null
  // gitignore
  if (opts.gitignore && Ignore.isIgnore(dir, opts.gitignore)) return null
  // level limitation
  if ((opts.maxLevel > -1) && (level > opts.maxLevel)) return null

  let item = {
    name: basename(dir),
    path: opts.normalizePath ? backslashToSlash(dir) : dir
  }

  let stats = null
  // !notice
  try {
    stats = await stat(dir)
  } catch (e) {
    if (opts.ignoreNotAccessible) {
      return null
    }
    throw e
  }

  if (stats.isFile()) {
    if (opts.extensions && !opts.extensions.test(dir)) return null
    item = merge(item, {
      type: consts.FILE,
      extension: extname(dir).toLowerCase(),
      size: stats.size,
      level
    })
    return opts.onStep.call(stats, item)
  }

  let dirData = {}
  if (stats.isDirectory()) {
    try {
      // !notice
      dirData = await readdir(dir)
    } catch (ex) {
      if (ex.code === consts.EACCES && opts.ignoreNotAccessible) {
        dirData = null
      } else {
        throw ex
      }
    }
    if (dirData === null) return null

    item = merge(item, {
      type: consts.DIRECTORY,
      size: stats.size,
      level,
      children: filter(
        await Promise.all(map(
          dirData,
          child => walk(join(dir, child), opts, level + 1)
        )),
        item1 => !!item1
      )
    })
    // item.size = item.children.reduce((prev, cur) => prev + cur.size, 0)
    return opts.onStep.call(stats, item)
  }

  // for devices, FIFO and sockets, we just ignore them
  return null
}

/**
 * Walk a directory recursively and return a json tree
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExpsOrFunction} opts.includes Apply including regex or function on both directory and file
 * @param {RegExpsOrFunction} opts.excludes Apply excluding regex or function on both directory and file
 * @param {Function} opts.onStep Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {StringOrBoolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {FSItem} A json tree representing the target directory
 */
function walkSync (dir, opts, level = 0) {
  assert.ok(!!dir, `The 'dir' parameter must be provided.`)

  opts = merge({
    includes: fn1,
    excludes: fn0,
    onStep: fn2,
    ignoreNotAccessible: true,
    normalizePath: true,
    maxLevel: -1,
    gitignore: '.gitignore',
    extensions: null
  }, opts || {})

  // exclusion
  if (test(dir, opts.excludes)) return null
  // inclusion
  if (!test(dir, opts.includes)) return null
  // gitignore
  if (opts.gitignore && Ignore.isIgnore(dir, opts.gitignore)) return null
  // level limitation
  if ((opts.maxLevel > -1) && (level > opts.maxLevel)) return null

  let item = {
    name: basename(dir),
    path: opts.normalizePath ? backslashToSlash(dir) : dir
  }

  let stats = null
  // !notice
  try {
    stats = statSync(dir)
  } catch (e) {
    if (opts.ignoreNotAccessible) {
      return null
    }
    throw e
  }

  if (stats.isFile()) {
    if (opts.extensions && !opts.extensions.test(dir)) return null
    item = merge(item, {
      type: consts.FILE,
      extension: extname(dir).toLowerCase(),
      size: stats.size,
      level
    })
    return opts.onStep.call(stats, item)
  }

  let dirData = {}
  if (stats.isDirectory()) {
    try {
      // !notice
      dirData = readdirSync(dir)
    } catch (ex) {
      if (ex.code === consts.EACCES && opts.ignoreNotAccessible) {
        dirData = null
      } else {
        throw ex
      }
    }
    if (dirData === null) return null
    item = merge(item, {
      type: consts.DIRECTORY,
      size: stats.size,
      level,
      children: filter(
        map(
          dirData,
          child => walkSync(join(dir, child), opts, level + 1)
        ),
        item1 => !!item1
      )
    })
    return opts.onStep.call(stats, item)
  }

  // for devices, FIFO and sockets, we just ignore them
  return null
}

/**
 * Walk a directory tree and get its files and sub-directories into a flat array
 * @async
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExpsOrFunction} opts.includes Apply including regex or function on both directory and file
 * @param {RegExpsOrFunction} opts.excludes Apply excluding regex or function on both directory and file
 * @param {Function} opts.onStep Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {StringOrBoolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {Promise<FSItem[]>} An Object Array representing the target directory
 */
async function flatten (dir, opts, level = 0) {

  opts = merge({
    includes: fn1,
    excludes: fn0,
    onStep: fn2,
    ignoreNotAccessible: true,
    normalizePath: true,
    maxLevel: -1,
    gitignore: '.gitignore',
    extensions: null
  }, opts || {})

  let items = []
  let onStep = opts.onStep
  opts.onStep = function (item) {
    item = onStep.call(this, item)
    delete item.children
    items.push(item)
  }
  await walk(dir, opts, level)

  return items
}

/**
 * Walk a directory tree and get its files and sub-directories into a flat array
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExpsOrFunction} opts.includes Apply including regex or function on both directory and file
 * @param {RegExpsOrFunction} opts.excludes Apply excluding regex or function on both directory and file
 * @param {Function} opts.onStep Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {StringOrBoolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {FSItem[]} An Object Array representing the target directory
 */
function flattenSync (dir, opts, level = 0) {

  opts = merge({
    includes: fn1,
    excludes: fn0,
    onStep: fn2,
    ignoreNotAccessible: true,
    normalizePath: true,
    maxLevel: -1,
    gitignore: '.gitignore',
    extensions: null
  }, opts || {})

  let items = []
  let onStep = opts.onStep
  opts.onStep = function (item) {
    item = onStep.call(this, item)
    delete item.children
    items.push(item)
  }
  walkSync(dir, opts, level)

  return items
}


module.exports = {
  walk,
  walkSync,
  flatten,
  flattenSync
}
