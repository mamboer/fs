# Walk a directory

In many cases we need to walk (AKA. `traverse`) a directory and get all the stuffs inside it.

The `@aotu/fs` module provides a flexible method to reach that goal, besides you can do extra processing job on every directory or file met when walking down the directory.

This feature can be accomplished through the {{book.api.walk}} function.

```js
import {walk} from '@aotu/fs'

let dirTreeObject = await walk('path/to/your/dir', {
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

## The json representation of the target directory

As you can see, the {{book.api.walk}} function takes an absolute directory path as the first parameter while an options object as the second, and returns a json tree object representing the structure of that directory.

The default returned json object looks like:

```json
{
  "name": "dir",
  "path": "path/to/your/dir",
  "level": 0,
  "size": 1244,
  "type": "directory",
  "children": [
    {
      "name": "subdir",
      "path": "path/to/your/dir/subdir",
      "level": 1,
      "size": 445,
      "type": "directory",
      "children": []
    },
    {
      "name": "readme.md",
      "path": "path/to/your/dir/readme.md",
      "level": 1,
      "size": 878,
      "type": "file",
      "extension": ".md"
    },
  ]
}
```

You can custom the returned json object easily by setting a callback function to the `onStep` option. Pls note that we need to return the item object which is representing the current directory or file, and the `this` keyword has a reference to the [`stats`](https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_class_fs_stats) instance.

```js
let dirTreeObject = await walk ('path/to/your/dir', {
  // Note that we need to return the item object in the end
  onStep: function (item) {
    // The `this` keyword has a reference to the `stats`
    item.ctime = this.ctime
    item.mtime = this.mtime
    return item
  }
})
```

## Super filtering

There are three options for providing smart and strong filtering features.

### The `.gitignore` patterns

We can ignore directories and files following the `.gitignore` patterns through the `gitignore` option.

By default, the nearest `.gitignore` file will be used by looking upward from the current directory, you can also use a custom file or just disable it by setting the `gitignore` option.

### Including and excluding

Both of the `includes` option and the `excludes` option accept a [`RegExp`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp) object or a custom testing function as the parameter. You can custom the details of the including or excluding logics through these two options.

### Filter files by extensions

We can easily filter files by extensions through the `extensions` option which accepts a [`RegExp`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp) object as the parameter.

```js
let dirTreeObject = await walk('path/to/your/dir', {
  extensions: /\.(png|jpg)$/i
})
```

## The synchronous version

The {{book.api.walkSync}} has the same function as the {{book.api.walk}}, except that it's synchronous.

Take a look at the {{book.api.ref}} for the complete details of the `walk` feature.
