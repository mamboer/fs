/**
 * Regex utility module
 * @module regex
 */

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {*}  regExp The target object to be tested
 * @returns {Boolean} The testing result
 */
export function isRegex(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp
}

export default {
  isRegex
}
