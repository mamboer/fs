import test from 'ava'

import {fn, fn0, fn1, fn2} from '../libs/dummy'

test('Dummy functions', t => {
  t.true(typeof fn() === 'undefined')
  t.true(fn0() === false)
  t.true(fn1() === true)
  t.true(fn2(1) === 1)
})
