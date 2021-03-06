/**
 * String utility module
 * @module str
 */

const {some, isArray} = require('lodash')
const {isRegex} = require('./regex')
/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param {String} str The string that to be handled
 * @returns {String} The normalized path
 */
function backslashToSlash (str) {
  return str.replace(/\\/g, '/');
}

/**
 * Test a string on regex or custom function
 * @param {String} str The string that to be tested
 * @param {RegExp|RegExp[]|Function} regexOrFunc The testing regex or function
 * @param {Boolean} reversed Whether perform a reversing test
 * @returns {Boolean} The testing result
 */
function test (str, regexOrFunc, reversed = false) {
    if (isRegex(regexOrFunc)) {
      regexOrFunc = [regexOrFunc]
    }

    if (
      isArray(regexOrFunc) &&
      (reversed ? !some(regexOrFunc, regex => regex.test(str)) : some(regexOrFunc, regex => regex.test(str)))
    ) {
      return true
    }
    if (
      typeof regexOrFunc === 'function' &&
      (reversed ? !regexOrFunc.call(null, str) : regexOrFunc.call(null, str))
    ) {
      return true
    }
    return false
}

module.exports = {
  backslashToSlash,
  test
}
