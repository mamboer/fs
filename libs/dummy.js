/**
 * A dummy function returns `undefined`
 */
export function fn () {
  // do nothing
}

/**
 * A dummy function returns `true`
 */
export function fn1 () {
  return true
}

/**
 * A dummy function returns `false`
 */
export function fn0 () {
  return false
}

/**
 * A dummy function returns the raw parameter
 */
export function fn2 (x) {
  return x
}

export default {
  fn,
  fn0,
  fn1,
  fn2
}
