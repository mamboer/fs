import test from 'ava'
import regex from '../libs/regex'

test('Has static method isRegex', t => {
  t.true(typeof regex.isRegex === 'function')
})

test('isRegex is cool', t => {
  t.true(regex.isRegex(/\.(tiff|png)$/i,))
})
