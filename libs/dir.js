import {readdir, stat, readdirSync, statSync} from 'fs-extra'
import {join, basename, extname} from 'path'
import assert from 'assert'
import {merge, map, filter} from 'lodash'
import {fn0, fn1, fn2} from './dummy'
import consts from './consts'
import {backslashToSlash, test} from './str';
import Ignore from './ignore'

/**
 * walk a directory recursively and return a json tree
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExp|Array<RegExp>|Function} opts.includes include regex or function
 * @param {RegExp|Array<RegExp>|Function} opts.excludes exclude regex or function
 * @param {Function} opts.onStep callback for every single walking step
 * @param {Boolean} opts.ignoreNotAccessible ignore the none-accessible directory or file
 * @param {Boolean} opts.normalizePath normalize the path, convert the windows style to the linux one
 * @param {Number} opts.maxLevel the maximum level of the down-walking
 * @param {String} opts.gitignore apply the nearest gitignore patterns when walking
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
    gitignore: '.gitignore'
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
        map(
          dirData,
          async child => await walk(join(dir, child), opts, ++level)
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
 * walk a directory recursively and return a json tree
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExp|Array<RegExp>|Function} opts.includes include regex or function
 * @param {RegExp|Array<RegExp>|Function} opts.excludes exclude regex or function
 * @param {Function} opts.onStep callback for every single walking step
 * @param {Boolean} opts.ignoreNotAccessible ignore the none-accessible directory or file
 * @param {Boolean} opts.normalizePath normalize the path, convert the windows style to the linux one
 * @param {Number} opts.maxLevel the maximum level of the down-walking
 * @param {String} opts.gitignore apply the nearest gitignore patterns when walking
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
    gitignore: '.gitignore'
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
          child => walk(join(dir, child), opts, ++level)
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
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExp|Array<RegExp>|Function} opts.includes include regex or function
 * @param {RegExp|Array<RegExp>|Function} opts.excludes exclude regex or function
 * @param {Function} opts.onStep callback for every single walking step
 * @param {Boolean} opts.ignoreNotAccessible ignore the none-accessible directory or file
 * @param {Boolean} opts.normalizePath normalize the path, convert the windows style to the linux one
 * @param {Number} opts.maxLevel the maximum level of the down-walking
 */
async function flatten (dir, opts, level = 0) {

  opts = merge({
    includes: fn1,
    excludes: fn0,
    onStep: fn2,
    ignoreNotAccessible: true,
    normalizePath: true,
    maxLevel: -1,
    gitignore: '.gitignore'
  }, opts || {})

  let items = []
  let onStep = opts.onStep
  opts.onStep = function (item) {
    item = onStep.call(this, item)
    items.push(item)
  }
  await walk(dir, opts, level)

  return items
}

/**
 * Walk a directory tree and get its files and sub-directories into a flat array 
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExp|Array<RegExp>|Function} opts.includes include regex or function
 * @param {RegExp|Array<RegExp>|Function} opts.excludes exclude regex or function
 * @param {Function} opts.onStep callback for every single walking step
 * @param {Boolean} opts.ignoreNotAccessible ignore the none-accessible directory or file
 * @param {Boolean} opts.normalizePath normalize the path, convert the windows style to the linux one
 * @param {Number} opts.maxLevel the maximum level of the down-walking
 */
function flattenSync (dir, opts, level = 0) {

  opts = merge({
    includes: fn1,
    excludes: fn0,
    onStep: fn2,
    ignoreNotAccessible: true,
    normalizePath: true,
    maxLevel: -1,
    gitignore: '.gitignore'
  }, opts || {})

  let items = []
  let onStep = opts.onStep
  opts.onStep = function (item) {
    item = onStep.call(this, item)
    items.push(item)
  }
  walkSync(dir, opts, level)

  return items
}

export default {
  walk,
  walkSync,
  flatten,
  flattenSync
}
