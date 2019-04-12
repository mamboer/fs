const test = require('ava')
const {isFunction, isObject, isEqual} = require('lodash')
const {join, basename} = require('path')
const dir = require('../libs/dir')
const {backslashToSlash} = require('../libs/str')
const { isArray } = require('util')

test('Can access exported functions', t => {
  t.true(isFunction(dir.walk))
  t.true(isFunction(dir.walkSync))
  t.true(isFunction(dir.flatten))
  t.true(isFunction(dir.flattenSync))
})

test.beforeEach('setup', t => {
  t.context.dir = join(process.cwd(), 'test/fixtures')
})

test('walk: Can walk properly', async t => {
  let items = await dir.walk(t.context.dir, {gitignore: '.fsignore'})
  t.true(isObject(items), t.context.dir)
  t.true(isEqual(items.name, basename(t.context.dir)))
  t.true(isEqual(backslashToSlash(t.context.dir), items.path))
  t.true(isArray(items.children))
  t.true(isEqual(items.children.length, 2))
  t.true(isObject(items.children[0]))
  t.true(isEqual(items.children[0].name, 'dir1'))
  t.true(isEqual(items.children[0].level, 1))
  t.true(isObject(items.children[1]))
  t.true(isEqual(items.children[1].name, 'dir2'))
  t.true(isArray(items.children[1].children))
  t.true(isEqual(items.children[1].children[0].name, 'dir2_1'))
  t.true(isEqual(items.children[1].children[0].level, 2))
  t.true(isEqual(items.children[1].children[0].children.length, 1))
  t.true(isArray(items.children[0].children))
  // file1.txt is being ignored
  t.true(isEqual(items.children[0].children.length, 1))
})

test('walk: Can disable gitignore pattern', async t => {
  let items = await dir.walk(t.context.dir, {gitignore: false})
  // file1.txt is valid because we disable the gitignore pattern
  t.true(isEqual(items.children[0].children.length, 2))
})

test('walk: Can set the max level option', async t => {
  let items = await dir.walk(t.context.dir, {maxLevel: 2})
  t.true(isEqual(items.children[1].children[0].children.length, 0))
})

test('walk: Can set the includes option to a RegExp object', async t => {
  let items = await dir.walk(t.context.dir, {gitignore: false, includes: /\/(dir1|fixtures)$/i})
  t.true(isEqual(items.children.length, 1))
})

test('walk: Can set the includes option to a function', async t => {
  let items = await dir.walk(t.context.dir, {
    gitignore: false,
    includes: function (dir) {
      let regex = /\/(dir1|fixtures)$/i
      return regex.test(dir)
    }
  })
  t.true(isEqual(items.children.length, 1))
})

test('walk: Can set the excludes option to a RegExp object', async t => {
  let items = await dir.walk(t.context.dir, {gitignore: false, excludes: /\/(dir2)$/i})
  t.true(isEqual(items.children.length, 1))
  t.true(isEqual(items.children[0].name, 'dir1'))
})

test('walk: Can set the excludes option to a function', async t => {
  let items = await dir.walk(t.context.dir, {
    gitignore: false,
    excludes: function (dir) {
      let regex = /\/(dir2)$/i
      return regex.test(dir)
    }
  })
  t.true(isEqual(items.children.length, 1))
  t.true(isEqual(items.children[0].name, 'dir1'))
})

test('walk: Can set the ignoreNotAccessible option to true', async t => {
  let items = await dir.walk('invalid/dir', {ignoreNotAccessible: true})
  t.true(items === null)
})

test.failing('walk: Can set the ignoreNotAccessible option to false', async t => {
  let errorPromise = dir.walk('invalid/dir', {ignoreNotAccessible: false})
  let error = await t.throwsAsync(errorPromise)
  t.is(error.code, 'ENOENT')
  t.fail()
})

test('walk: Can set the onStep option', async t => {
  let items = await dir.walk(t.context.dir, {
    onStep: function (item) {
      item.xxxx = 1
      return item
    }
  })
  t.is(items.xxxx, 1)
})

test('walk: Can set the extensions option', async t => {
  let items = await dir.walk(t.context.dir, {
    gitignore: false,
    extensions: /\.txt$/i
  })
  t.is(items.children[0].children[0].name, 'file1.txt')
})

/* walkSync tests
=======================*/

test('walkSync: Can walk properly', t => {
  let items = dir.walkSync(t.context.dir, {gitignore: '.fsignore'})
  t.true(isObject(items), t.context.dir)
  t.true(isEqual(items.name, basename(t.context.dir)))
  t.true(isEqual(backslashToSlash(t.context.dir), items.path))
  t.true(isArray(items.children))
  t.true(isEqual(items.children.length, 2))
  t.true(isObject(items.children[0]))
  t.true(isEqual(items.children[0].name, 'dir1'))
  t.true(isEqual(items.children[0].level, 1))
  t.true(isObject(items.children[1]))
  t.true(isEqual(items.children[1].name, 'dir2'))
  t.true(isArray(items.children[1].children))
  t.true(isEqual(items.children[1].children[0].name, 'dir2_1'))
  t.true(isEqual(items.children[1].children[0].level, 2))
  t.true(isEqual(items.children[1].children[0].children.length, 1))
  t.true(isArray(items.children[0].children))
  // file1.txt is being ignored
  t.true(isEqual(items.children[0].children.length, 1))
})

test('walkSync: Can disable gitignore pattern', t => {
  let items = dir.walkSync(t.context.dir, {gitignore: false})
  // file1.txt is valid because we disable the gitignore pattern
  t.true(isEqual(items.children[0].children.length, 2))
})

test('walkSync: Can set the max level option', t => {
  let items = dir.walkSync(t.context.dir, {maxLevel: 2})
  t.true(isEqual(items.children[1].children[0].children.length, 0))
})

test('walkSync: Can set the includes option to a RegExp object', t => {
  let items = dir.walkSync(t.context.dir, {gitignore: false, includes: /\/(dir1|fixtures)$/i})
  t.true(isEqual(items.children.length, 1))
})

test('walkSync: Can set the includes option to a function', t => {
  let items = dir.walkSync(t.context.dir, {
    gitignore: false,
    includes: function (dir) {
      let regex = /\/(dir1|fixtures)$/i
      return regex.test(dir)
    }
  })
  t.true(isEqual(items.children.length, 1))
})

test('walkSync: Can set the excludes option to a RegExp object', t => {
  let items = dir.walkSync(t.context.dir, {gitignore: false, excludes: /\/(dir2)$/i})
  t.true(isEqual(items.children.length, 1))
  t.true(isEqual(items.children[0].name, 'dir1'))
})

test('walkSync: Can set the excludes option to a function', t => {
  let items = dir.walkSync(t.context.dir, {
    gitignore: false,
    excludes: function (dir) {
      let regex = /\/(dir2)$/i
      return regex.test(dir)
    }
  })
  t.true(isEqual(items.children.length, 1))
  t.true(isEqual(items.children[0].name, 'dir1'))
})

test('walkSync: Can set the ignoreNotAccessible option to true', t => {
  let items = dir.walkSync('invalid/dir', {ignoreNotAccessible: true})
  t.true(items === null)
})

test.failing('walkSync: Can set the ignoreNotAccessible option to false', t => {
  function fn () {
    dir.walkSync('invalid/dir', {ignoreNotAccessible: false})
  }
  
  let error = t.throws(fn, Error)
  t.is(error.code, 'ENOENT')
  t.fail()
})

test('walkSync: Can set the onStep option', t => {
  let items = dir.walkSync(t.context.dir, {
    onStep: function (item) {
      item.xxxx = 1
      return item
    }
  })
  t.is(items.xxxx, 1)
})

test('flatten: Can flatten properly', async t => {
  let items = await dir.flatten(t.context.dir, {gitignore: '.fsignore'})
  t.true(isArray(items))
  t.is(items.length, 7)
  t.is(items[0].name, 'file0.md')
  t.is(items[6].name, 'fixtures')
})

test('flattenSync: Can flatten properly', async t => {
  let items = dir.flattenSync(t.context.dir, {gitignore: '.fsignore'})
  t.true(isArray(items))
  t.is(items.length, 7)
  t.is(items[0].name, 'file0.md')
  t.is(items[6].name, 'fixtures')
})
