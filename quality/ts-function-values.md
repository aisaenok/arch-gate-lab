# TypeScript function-value reachability characterization

These scenarios probe the boundary of the current call graph.

1. **Local alias**
   ```ts
   const request = get;
   request(url);
   ```
   If the TypeChecker resolves the aliased call back to `get`, API001 should still FAIL.

2. **Barrel re-export**
   ```ts
   export { get } from "./client.js";
   import { get } from "../shared/http/index.js";
   get(url);
   ```
   Re-exporting a symbol must not hide the underlying wrapper call.

3. **Callback/HOF**
   ```ts
   urls.map(get);
   ```
   The wrapper is executed by the higher-order function even though it is not the direct
   CallExpression callee. This is expected to expose the current function-value
   propagation limit.

The characterization expects alias and barrel calls to remain rejected, while the
callback case currently false-passes.
