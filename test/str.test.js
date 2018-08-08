const test = require('ava')
const STR = require('../libs/str')

test('Can convert backslash to slash', t => {
  t.true(STR.backslashToSlash('\\dir\\to\\file') === '/dir/to/file')
})

test('Can test string via regex', t => {
  t.true(STR.test('/dir/test.jpg', /\.(gif|jpg|jpeg|tiff|png)$/i))
  t.not(STR.test('/dir/test.jpg', /\.(gif|jpg|jpeg|tiff|png)$/i, true), true)
})

test('Can test string via regex array', t => {
  let regexes = [
    /\.(tiff|png)$/i,
    /\.(gif|jpg|jpeg)$/i
  ]
  t.true(STR.test('/dir/test.jpg', regexes))
  t.not(STR.test('/dir/test.gif', regexes, true), true)
})

test('Can test string via custom function', t => {
  let tester1 = (str) => {
    str = true
    return str
  }
  let tester2 = (str) => {
    str = false
    return str
  }
  t.true(STR.test('/dir/test.jpg', tester1))
  t.true(!STR.test('/dir/test.gif', tester2))
})
