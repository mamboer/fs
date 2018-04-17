## Run Unit Tests

```
npm test
// Or the watching mode
npm run test1
```

## Debug

1. Write a debug file at `test/debugs/your.debug.js`
2. Run the debug command

  ```
  babel-node --harmony --inspect-brk test/debugs/your.debug.js
  ```
3. Open the Chrome inspector interface

  ```
  chrome://inspect/
  ```

  You will see the files listed for inspcecting.

4. Add the `fs` folder to the chrome-devtools's workspace