import {some, isArray} from 'lodash'
import {isRegex} from './regex'
/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param {string} str string that to be handled
 * @return {string} normalized path
 */
export function backslashToSlash (str) {
  return str.replace(/\\/g, '/');
}

/**
 * Test a string on regex or custom function
 * @param {String} str string that to be tested
 * @param {RegExp|RegExp[]|Function} regexOrFunc Testing regex or function
 * @param {Boolean} reversed perform a reversing test
 */
export function test (str, regexOrFunc, reversed = false) {
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

export default {
  backslashToSlash,
  test
}
