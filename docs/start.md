# Getting Started

## Install

```shell
npm install --save @aotu/fs
```


## Access

- **ES6 Import (Native JS)**
  
  ```js
  import { walk, flatten }  from '@aotu/fs';
  -OR-
  import * as FS from '@aotu/fs';
  -OR-
  import FS from '@aotu/fs';
  
  walk(...)
  flatten(...)
  -OR-
  FS.walk(...)
  FS.flatten(...)
  ```
