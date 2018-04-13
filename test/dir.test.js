import test from 'ava'
import {isFunction, isObject} from 'lodash'
import {join} from 'path'
import dir from '../libs/dir'

test('Can access exported functions', t => {
  t.true(isFunction(dir.walk))
  t.true(isFunction(dir.walkSync))
  t.true(isFunction(dir.flatten))
  t.true(isFunction(dir.flattenSync))
})

test.beforeEach('setup', t => {
  t.context.dir = join(process.cwd(), 'test/fixtures')
})

test('Can walk properly', async t => {
  let items = await dir.walk(t.context.dir)
  t.true(isObject(items), t.context.dir)
})
