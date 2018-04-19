
<br/><br/><br/>

<a id="module_dir"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir</h5>A directory utility module


* 
[dir](#module_dir)
    * 
[~walk(dir, opts)](#module_dir__walk) ⇒ Promise.&lt;FSItem&gt;
    * 
[~walkSync(dir, opts)](#module_dir__walkSync) ⇒ FSItem
    * 
[~flatten(dir, opts)](#module_dir__flatten) ⇒ Promise.&lt;Array.&lt;FSItem&gt;&gt;
    * 
[~flattenSync(dir, opts)](#module_dir__flattenSync) ⇒ Array.&lt;FSItem&gt;
    * 
[~FSItem](#module_dir__FSItem) : Object
    * 
[~RegExpsOrFunction](#module_dir__RegExpsOrFunction)
    * 
[~StringOrBoolean](#module_dir__StringOrBoolean)


<br/><br/><br/>

<a id="module_dir__walk"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~walk(dir, opts) ⇒ Promise.&lt;FSItem&gt;</h5>Walk a directory recursively and return a json tree


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dir | String |  | directory |
| opts | Object |  | options |
| opts.includes | RegExpsOrFunction |  | Apply including regex or function on both directory and file |
| opts.excludes | RegExpsOrFunction |  | Apply excluding regex or function on both directory and file |
| opts.onStep | function |  | Callback for every single walking step |
| [opts.ignoreNotAccessible] | Boolean | <code>true</code> | Whether ignore the none-accessible directory or file |
| [opts.normalizePath] | Boolean | <code>true</code> | Normalize the path, convert the windows style to the linux one |
| [opts.maxLevel] | Number | <code>-1</code> | The maximum level of the down-walking |
| [opts.gitignore] | StringOrBoolean | <code>.gitignore</code> | Apply the nearest gitignore patterns when walking |
| opts.extensions | RegExp |  | Apply extension regex on file |

**Returns**: Promise.&lt;FSItem&gt; - A json tree representing the target directory  

<br/><br/><br/>

<a id="module_dir__walkSync"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~walkSync(dir, opts) ⇒ FSItem</h5>Walk a directory recursively and return a json tree


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dir | String |  | directory |
| opts | Object |  | options |
| opts.includes | RegExpsOrFunction |  | Apply including regex or function on both directory and file |
| opts.excludes | RegExpsOrFunction |  | Apply excluding regex or function on both directory and file |
| opts.onStep | function |  | Callback for every single walking step |
| [opts.ignoreNotAccessible] | Boolean | <code>true</code> | Whether ignore the none-accessible directory or file |
| [opts.normalizePath] | Boolean | <code>true</code> | Normalize the path, convert the windows style to the linux one |
| [opts.maxLevel] | Number | <code>-1</code> | The maximum level of the down-walking |
| [opts.gitignore] | StringOrBoolean | <code>.gitignore</code> | Apply the nearest gitignore patterns when walking |
| opts.extensions | RegExp |  | Apply extension regex on file |

**Returns**: FSItem - A json tree representing the target directory  

<br/><br/><br/>

<a id="module_dir__flatten"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~flatten(dir, opts) ⇒ Promise.&lt;Array.&lt;FSItem&gt;&gt;</h5>Walk a directory tree and get its files and sub-directories into a flat array


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dir | String |  | directory |
| opts | Object |  | options |
| opts.includes | RegExpsOrFunction |  | Apply including regex or function on both directory and file |
| opts.excludes | RegExpsOrFunction |  | Apply excluding regex or function on both directory and file |
| opts.onStep | function |  | Callback for every single walking step |
| [opts.ignoreNotAccessible] | Boolean | <code>true</code> | Whether ignore the none-accessible directory or file |
| [opts.normalizePath] | Boolean | <code>true</code> | Normalize the path, convert the windows style to the linux one |
| [opts.maxLevel] | Number | <code>-1</code> | The maximum level of the down-walking |
| [opts.gitignore] | StringOrBoolean | <code>.gitignore</code> | Apply the nearest gitignore patterns when walking |
| opts.extensions | RegExp |  | Apply extension regex on file |

**Returns**: Promise.&lt;Array.&lt;FSItem&gt;&gt; - An Object Array representing the target directory  

<br/><br/><br/>

<a id="module_dir__flattenSync"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~flattenSync(dir, opts) ⇒ Array.&lt;FSItem&gt;</h5>Walk a directory tree and get its files and sub-directories into a flat array


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dir | String |  | directory |
| opts | Object |  | options |
| opts.includes | RegExpsOrFunction |  | Apply including regex or function on both directory and file |
| opts.excludes | RegExpsOrFunction |  | Apply excluding regex or function on both directory and file |
| opts.onStep | function |  | Callback for every single walking step |
| [opts.ignoreNotAccessible] | Boolean | <code>true</code> | Whether ignore the none-accessible directory or file |
| [opts.normalizePath] | Boolean | <code>true</code> | Normalize the path, convert the windows style to the linux one |
| [opts.maxLevel] | Number | <code>-1</code> | The maximum level of the down-walking |
| [opts.gitignore] | StringOrBoolean | <code>.gitignore</code> | Apply the nearest gitignore patterns when walking |
| opts.extensions | RegExp |  | Apply extension regex on file |

**Returns**: Array.&lt;FSItem&gt; - An Object Array representing the target directory  

<br/><br/><br/>

<a id="module_dir__FSItem"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~FSItem : Object</h5>The json object representing a directory or a file

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | String | The name of the directory or file |
| path | String | The absolute path of the directory or file |
| type | String | The FSItem type, possible values are `directory` and `file` |
| size | Number | The size of the directory or file |
| level | Number | The level of the directory or file, note that the root directory has a level with `0` |
| children | Array.&lt;FSItem&gt; | The children of the current directory |
| extension | String | The extension of the current file |


<br/><br/><br/>

<a id="module_dir__RegExpsOrFunction"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~RegExpsOrFunction</h5>RegExp Or RegExp[] Or Function


<br/><br/><br/>

<a id="module_dir__StringOrBoolean"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  dir~StringOrBoolean</h5>String Or Boolean

