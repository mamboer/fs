import test from 'ava'
import {isFunction} from 'lodash'
import dir from '../libs/dir'

test('Can access exported functions', t => {
  t.true(isFunction(dir.walk))
  t.true(isFunction(dir.walkSync))
  t.true(isFunction(dir.flatten))
  t.true(isFunction(dir.flattenSync))
})
