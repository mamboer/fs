/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
export function isRegex(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp
}

export default {
  isRegex
}
