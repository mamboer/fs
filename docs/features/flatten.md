# Flatten a directory

Walk (AKA. `traverse`) a directory and get all the stuffs inside it.

The `flatten` feature is very similar to the {{book.guide.fnWalk}}, except that it returns a flat array instead of a json object.

This feature can be accomplished through the {{book.api.flatten}} function.

```js
import {flatten} from '@aotu/fs'

let anArray = await flatten('path/to/your/dir', {
  includes: function (path0) { return true },
  excludes: function (path0) { return false },
  onStep: function (item) { return item },
  ignoreNotAccessible: true,
  normalizePath: true,
  maxLevel: -1,
  gitignore: '.gitignore',
  extensions: null
})

```

## The array representation of the target directory

The `flatten` return a flat array instead of a json object.

```json
[
  {
    "name": "dir",
    "path": "path/to/your/dir",
    "level": 0,
    "size": 1244,
    "type": "directory"
  },
  {
    "name": "subdir",
    "path": "path/to/your/dir/subdir",
    "level": 1,
    "size": 445,
    "type": "directory"
  },
  {
    "name": "readme.md",
    "path": "path/to/your/dir/readme.md",
    "level": 1,
    "size": 878,
    "type": "file",
    "extension": ".md"
  }
]
```


## The synchronous version

The {{book.api.flattenSync}} has the same function as the {{book.api.flatten}}, except that it's synchronous.

Take a look at the {{book.api.ref}} for the complete details of the `flatten` feature.
