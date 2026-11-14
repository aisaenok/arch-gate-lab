# HTTP client factory characterization

These scenarios probe transport provenance through an HTTP client factory.

## Axios instance

```ts
const client = axios.create();
client.get("/api/admin");
```

The generated call targets an operation absent from OpenAPI. If the analyzer preserves
axios provenance through `create()`, API003 must reject it.

## Method alias from Axios instance

```ts
const client = axios.create();
const get = client.get;
get("/api/admin");
```

This composes factory provenance with the transport alias support already merged.

Current behavior is expected to false-pass because a `CallExpression` initializer is
not treated as transport provenance.
