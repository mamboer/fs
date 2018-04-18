/**
 * directory utility module
 * @module dir
 */

import {readdir, stat, readdirSync, statSync} from 'fs-extra'
import {join, basename, extname} from 'path'
import assert from 'assert'
import {merge, map, filter} from 'lodash'
import {fn0, fn1, fn2} from './dummy'
import consts from './consts'
import {backslashToSlash, test} from './str';
import Ignore from './ignore'

/**
 * Walk a directory recursively and return a json tree
 * @async
 * @param {String} dir directory
 * @param {Object} opts options
 * @param {RegExp|RegExp[]|Function} [opts.includes=dummy~fn1] Apply including regex or function on both directory and file
 * @param {RegExp|RegExp[]|Function} [opts.excludes=dummy~fn0] Apply excluding regex or function on both directory and file
 * @param {Function} [opts.onStep=dummy~fn2] Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {String|Boolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {Promise<{name: String, path: String, type: String, size: Number, level: Number, children: Object[]}>} A json tree representing the target directory
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
 * @param {RegExp|RegExp[]|Function} [opts.includes=dummy~fn1] Apply including regex or function on both directory and file
 * @param {RegExp|RegExp[]|Function} [opts.excludes=dummy~fn0] Apply excluding regex or function on both directory and file
 * @param {Function} [opts.onStep=dummy~fn2] Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {String|Boolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {{name: String, path: String, type: String, size: Number, level: Number, children: Object[]}} A json tree representing the target directory
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
 * @param {RegExp|RegExp[]|Function} [opts.includes=dummy~fn1] Apply including regex or function on both directory and file
 * @param {RegExp|RegExp[]|Function} [opts.excludes=dummy~fn0] Apply excluding regex or function on both directory and file
 * @param {Function} [opts.onStep=dummy~fn2] Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {String|Boolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {Promise<{name: String, path: String, type: String, size: Number, level: Number}[]>} An Object Array representing the target directory
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
 * @param {RegExp|RegExp[]|Function} [opts.includes=dummy~fn1] Apply including regex or function on both directory and file
 * @param {RegExp|RegExp[]|Function} [opts.excludes=dummy~fn0] Apply excluding regex or function on both directory and file
 * @param {Function} [opts.onStep=dummy~fn2] Callback for every single walking step
 * @param {Boolean} [opts.ignoreNotAccessible=true] Whether ignore the none-accessible directory or file
 * @param {Boolean} [opts.normalizePath=true] Normalize the path, convert the windows style to the linux one
 * @param {Number} [opts.maxLevel=-1] The maximum level of the down-walking
 * @param {String|Boolean} [opts.gitignore=.gitignore] Apply the nearest gitignore patterns when walking
 * @param {RegExp} opts.extensions Apply extension regex on file
 * @returns {{name: String, path: String, type: String, size: Number, level: Number}[]} An Object Array representing the target directory
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

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { walk }    from '@aotu/fs';
//       -or-
//         import * as FS from '@aotu/fs';
export {
  walk,
  walkSync,
  flatten,
  flattenSync
}

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { walk } = require('@aotu/fs');
//       -or-
//         const FS   = require('@aotu/fs');
export default {
  walk,
  walkSync,
  flatten,
  flattenSync
}
