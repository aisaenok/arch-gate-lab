# SCIP feasibility spike

## Result

**Decision: use SCIP as the semantic-resolution backend for arch-gate.**

The spike successfully generated and consumed SCIP indexes for:

- TypeScript with `scip-typescript 0.4.0`;
- Java 21/Maven with `scip-java 0.14.2`;
- binary SCIP consumption directly from Node using `@scip-code/scip 0.10.0`.

SCIP should replace compiler-resolution infrastructure that arch-gate is currently
reimplementing. It should **not** replace arch-gate's domain semantics or execution
analysis.

## What the TypeScript spike proved

### Barrel/re-export resolution

Given:

```ts
export { get } from "./http.js";
import { get } from "./barrel.js";
```

the occurrence for the imported `get` in the consumer resolves directly to:

```text
src/http.ts/get()
```

SCIP therefore gives us compiler-grade symbol identity through re-exports without
arch-gate manually following alias chains.

### Local value aliases are not data-flow

Given:

```ts
const request = get;
request(url);
```

SCIP records:

- the initializer `get` as a reference to `src/http.ts/get()`;
- the call-site `request` as a reference to the local symbol `usage.ts/request`.

SCIP does **not** say that calling `request` executes `get`.

That remains an arch-gate value-flow/call-reachability concern.

### Callback values preserve symbol identity

Given:

```ts
urls.map(get);
```

the `get` occurrence references the original `src/http.ts/get()` symbol directly.

SCIP identifies the callback value precisely, but it does not encode the execution
semantics of `Array.map`. The arch-gate call graph still needs to decide that the
callback executes.

### Interface implementations

Given:

```ts
interface HttpClient {
  get(url: string): Promise<unknown>;
}

class FetchClient implements HttpClient {
  async get(url: string) { ... }
}
```

SCIP emits implementation relationships for both:

```text
FetchClient
  -> HttpClient
  isImplementation=true

FetchClient#get()
  -> HttpClient#get()
  isImplementation=true
  isReference=true
```

This is exactly the relationship arch-gate previously reconstructed manually.

### Interface-typed dispatch

Given:

```ts
const client: HttpClient = new FetchClient();
client.get(url);
```

the call-site method occurrence references:

```text
HttpClient#get()
```

not `FetchClient#get()`.

This is correct compiler semantics. SCIP also separately provides the implementation
relationship between `FetchClient#get()` and `HttpClient#get()`.

Determining which implementation is actually bound at runtime remains an arch-gate
execution/value-flow concern.

### External transport symbols

For:

```ts
const client = axios.create();
client.get(url);
```

SCIP emits exact external symbols including:

```text
axios ... AxiosStatic#create()
axios ... Axios#get()
```

This is valuable for transport recognition: arch-gate can identify the actual imported
library symbol instead of relying only on local names such as `axios`, `client`,
`get`, or `create`.

SCIP still does not say that `axios.create()` creates an HTTP client or that
`Axios#get()` represents an HTTP GET. Those are arch-gate HTTP semantics.

## What the Java spike proved

The fixture mirrors the generated-interface pattern:

```java
public interface ApplicationApi {
    String getApplication(String id);
}

public final class ApplicationController implements ApplicationApi {
    @Override
    public String getApplication(String id) { ... }
}
```

`scip-java` emits:

```text
ApplicationController
  -> ApplicationApi
  isImplementation=true

ApplicationController#getApplication()
  -> ApplicationApi#getApplication()
  isImplementation=true
  isReference=true
```

It also emits the inverse method implementation relationship on the interface method.

This means arch-gate no longer needs to resolve Java implementations using:

- explicit-import lookup;
- same-package lookup;
- unique simple-name fallback;
- method-name + arity matching.

Java compiler/classpath resolution can be delegated to `scip-java`.

JAX-RS annotation interpretation remains an arch-gate domain adapter.

## Direct Node consumption

The spike reads both TypeScript and Java `index.scip` files directly from Node:

```ts
import { fromBinary } from "@bufbuild/protobuf";
import { IndexSchema } from "@scip-code/scip";

const index = fromBinary(
  IndexSchema,
  readFileSync("index.scip")
);
```

No Go subprocess, JSON conversion, or CLI output parsing is required inside
arch-gate.

The consumer successfully reads:

- documents;
- occurrences;
- symbol identities;
- symbol information;
- implementation relationships;
- indexer metadata.

## Important operational finding

`scip lint` reports missing `SymbolInformation` for some external symbols such as
TypeScript standard library and axios symbols.

The occurrences still contain precise fully-qualified external symbol IDs, and the
arch-gate consumer can use them.

Therefore full external-symbol metadata should not be a prerequisite for consuming a
local repository index. Missing external metadata should be treated separately from
missing local semantic evidence.

## Recommended target architecture

```text
        source repositories
               |
       language indexers
       /              \
scip-typescript     scip-java
       \              /
           index.scip
               |
        SCIP index adapter
   definitions / references /
      implementations /
       symbol identity
               |
      +--------+---------+
      |                  |
 lightweight AST      domain adapters
 call syntax/value    OpenAPI / JAX-RS /
 flow decisions       HTTP / intent
      |                  |
      +--------+---------+
               |
         arch-gate facts
               |
          rule engine
```

## Responsibility split

### Move to SCIP

- symbol identity;
- definition/reference resolution;
- imports and re-exports;
- package/classpath-aware external symbol identity;
- class/interface implementation relationships;
- method implementation/override relationships;
- most Java type/interface resolution;
- the resolution part of module dependency construction.

### Keep in arch-gate

- `http-call`;
- `http-reach`;
- execution/call graph semantics;
- local value propagation where execution matters;
- known callback execution semantics;
- runtime/DI uncertainty and PARTIAL evidence;
- HTTP library semantics such as `axios.create()`;
- HTTP method/path extraction;
- `api-boundary-type`;
- JAX-RS annotation interpretation;
- `backend-endpoint`;
- OpenAPI facts;
- intent facts;
- repository topology;
- generic rule engine.

## Migration strategy

Do not replace the existing analyzers in one change.

### Phase 1 — SCIP reader

Add a small core adapter around `@scip-code/scip` that builds maps such as:

```text
symbol -> defining document
symbol -> SymbolInformation
symbol -> implementation symbols
document -> occurrences
```

SCIP index generation remains outside the rule engine.

### Phase 2 — shadow mode

For existing fixtures, run current resolution and SCIP-backed resolution in parallel.

Compare at least:

- module dependencies;
- generated runtime symbol targets;
- TypeScript implementation relations;
- Java interface/controller relations.

A mismatch is evidence to investigate, not something to silently normalize.

### Phase 3 — replace low-level resolution

After parity is demonstrated:

1. migrate `module-dependency` symbol resolution to SCIP;
2. migrate Java interface/method implementation resolution to SCIP;
3. use SCIP external symbol identity as input to HTTP transport recognition.

Keep AST traversal only where syntax/execution shape matters.

### Phase 4 — delete obsolete compiler plumbing

Only after regression parity, remove redundant code such as:

- manual TypeScript module/alias resolution used only for symbol identity;
- Java explicit-import/same-package/simple-name fallback resolution;
- Java name+arity implementation matching.

## What SCIP does not solve

The spike deliberately demonstrates that SCIP is not a general data-flow engine.

These still require arch-gate semantics:

```ts
const request = get;
request(url);
```

```ts
urls.map(get);
```

```ts
function load(client: HttpClient) {
  return client.get("/api");
}
```

```ts
const client = axios.create();
client.get("/api");
```

SCIP tells us precisely **which symbols appear** and **how declarations relate**.
Arch-gate still decides **what executes** and **what those symbols mean architecturally**.

That is the intended boundary.
