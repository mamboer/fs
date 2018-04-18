import {walk, walkSync, flatten, flattenSync} from './libs/dir'

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { walk }    from '@aotu/fs';
//       -or-
//         import * as FS from '@aotu/fs';
export {
  walk,
  walkSync,
  flatten,
  flattenSync
}

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { walk } = require('@aotu/fs');
//       -or-
//         const FS   = require('@aotu/fs');
export default {
  walk,
  walkSync,
  flatten,
  flattenSync
}
