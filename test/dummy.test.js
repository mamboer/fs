const test = require('ava')

const {fn, fn0, fn1, fn2} = require('../libs/dummy')

test('Dummy functions', t => {
  t.true(typeof fn() === 'undefined')
  t.true(fn0() === false)
  t.true(fn1() === true)
  t.true(fn2(1) === 1)
})
