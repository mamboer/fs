const test = require('ava')
const Ignore = require('../libs/ignore')

test('Has a static method isIgnore', t => {
  t.true(typeof Ignore.isIgnore === 'function')
})

test.beforeEach(t => {
  t.context.ig = new Ignore('.gitignore')
})

test('Has proper properties', t => {
  let ig = t.context.ig
  t.true(ig.ignoreFileName === '.gitignore')
  t.true(!!ig.ignoreFile)
  t.true(!!ig.ignoreText)
  t.true(ig.ignoreText.indexOf('.DS_Store') === 0)
  t.true(typeof ig._init === 'function')
  t.true(typeof ig.isIgnore === 'function')
  t.true(typeof ig.reset === 'function')
})

test('Can ignore properly', t => {
  let ig = t.context.ig
  t.true(ig.isIgnore('/fs/node_modules'))
  t.true(!ig.isIgnore('fs/.gitignore'))
  t.true(Ignore.isIgnore('fs/node_modules', '.gitignore'))
  t.true(Ignore.isIgnore('fs/test/fixtures/dir1/file1.txt', '.fsignore'))
})
