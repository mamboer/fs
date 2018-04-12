import {readdir, stat, readdirSync, statSync} from 'fs-extra'
import {join, basename, extname} from 'path'
import assert from 'assert'
import {merge, map, filter} from 'lodash'
import {fn0, fn1, fn2} from './dummy'
import consts from './consts'
import {backslashToSlash, test} from './str';
import {isRegex} from './regex'
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
async function walk (
  dir,
  {
    includes = fn1,
    excludes = fn0,
    onStep = fn2,
    ignoreNotAccessible = true,
    normalizePath = true,
    maxLevel = -1,
    gitignore = '.gitignore'
  },
  level = 0
) {
  assert.ok(!!dir, `The 'dir' parameter must be provided.`)

  // exclusion
  if (test(dir, excludes)) return null
  // inclusion
  if (!test(dir, includes)) return null
  // gitignore
  if (gitignore && Ignore.isIgnore(dir, gitignore)) return null
  // level limitation
  if (maxLevel && level > maxLevel) return null

  let item = {
    name: basename(dir),
    path: normalizePath ? backslashToSlash(dir) : dir
  }

  let stats = null
  // !notice
  try {
    stats = await stat(dir)
  } catch (e) {
    if (ignoreNotAccessible) {
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
    return onStep.call(stats, item)
  }

  let dirData = {}
  if (stats.isDirectory()) {
    try {
      // !notice
      dirData = await readdir(dir)
    } catch (ex) {
      if (ex.code === consts.EACCES && ignoreNotAccessible) {
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
        map(dirData, child => await walk(join(dir, child), {includes, excludes, onStep, ignoreNotAccessible, normalizePath, maxLevel}, ++level)),
        item1 => !!item1
      )
    })
    return onStep.call(stats, item)
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
function walkSync (
  dir,
  {
    includes = fn1,
    excludes = fn0,
    onStep = fn2,
    ignoreNotAccessible = true,
    normalizePath = true,
    maxLevel = -1,
    gitignore = '.gitignore'
  },
  level = 0
) {
  assert.ok(!!dir, `The 'dir' parameter must be provided.`)

  // exclusion
  if (test(dir, excludes)) return null
  // inclusion
  if (!test(dir, includes)) return null
  // gitignore
  if (gitignore && Ignore.isIgnore(dir, gitignore)) return null
  // level limitation
  if (maxLevel && level > maxLevel) return null

  let item = {
    name: basename(dir),
    path: normalizePath ? backslashToSlash(dir) : dir
  }

  let stats = null
  // !notice
  try {
    stats = statSync(dir)
  } catch (e) {
    if (ignoreNotAccessible) {
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
    return onStep.call(stats, item)
  }

  let dirData = {}
  if (stats.isDirectory()) {
    try {
      // !notice
      dirData = readdirSync(dir)
    } catch (ex) {
      if (ex.code === consts.EACCES && ignoreNotAccessible) {
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
        map(dirData, child => walk(join(dir, child), {includes, excludes, onStep, ignoreNotAccessible, normalizePath, maxLevel}, ++level)),
        item1 => !!item1
      )
    })
    return onStep.call(stats, item)
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
async function flatten (
  dir,
  {
    includes = fn1,
    excludes = fn0,
    onStep = fn2,
    ignoreNotAccessible = true,
    normalizePath = true,
    maxLevel = -1,
    gitignore = '.gitignore'
  },
  level = 0
) {
  let items = []
  let onStep1 = function (item) {
    item = onStep.call(this, item)
    items.push(item)
  }
  await walk(dir, {
    includes,
    excludes,
    onStep: onStep1,
    ignoreNotAccessible,
    normalizePath,
    maxLevel
  }, level)

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
function flattenSync (
  dir,
  {
    includes = fn1,
    excludes = fn0,
    onStep = fn2,
    ignoreNotAccessible = true,
    normalizePath = true,
    maxLevel = -1,
    gitignore = '.gitignore'
  },
  level = 0
) {
  let items = []
  let onStep1 = function (item) {
    item = onStep.call(this, item)
    items.push(item)
  }
  walkSync(dir, {
    includes,
    excludes,
    onStep: onStep1,
    ignoreNotAccessible,
    normalizePath,
    maxLevel
  }, level)

  return items
}

export default {
  walk,
  walkSync,
  flatten,
  flattenSync
}
