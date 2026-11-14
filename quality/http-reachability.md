# HTTP reachability characterization

The TypeScript analyzer currently builds `http-reach` by traversing internal module
imports.

That makes this code look like an HTTP path:

```ts
import { get } from "../shared/http/client.js";

export const loadApplication = (id: string) => ({
  id,
  load: get
});
```

even though `get()` is never called.

The imported wrapper itself calls `fetch`, so module reachability produces:

```text
feature -> shared/http/client -> fetch
```

Expected architecture semantics: PASS. Mere symbol availability is not an HTTP call.

The characterization workflow currently expects FAIL to prove the false positive
before the analyzer is changed.
