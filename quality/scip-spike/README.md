# SCIP feasibility spike

Goal: determine which language-resolution responsibilities can move out of arch-gate
and into compiler-produced SCIP indexes.

This spike does **not** integrate SCIP into arch-gate and does not change any existing
architecture rules.

## TypeScript questions

The fixture deliberately contains:

- import through a barrel re-export;
- a local function-value alias;
- a callback function value;
- an interface and a concrete implementation;
- an interface-typed receiver backed by a concrete instance;
- an axios.create() instance.

We inspect the generated SCIP snapshot to answer:

1. Does the imported symbol through a barrel resolve to the original declaration?
2. What symbol is attached to the call through a local alias?
3. What symbol is attached to a callback value such as map(get)?
4. Does SCIP emit implementation relationships for class/interface and methods?
5. What symbol is attached to client.get() when client is typed as an interface?
6. What does SCIP know about axios.create() and the created instance?

## Java questions

The Java fixture mirrors the generated-interface pattern used by the real backend:

```java
public interface ApplicationApi {
    String getApplication(String id);
}

public final class ApplicationController implements ApplicationApi {
    @Override
    public String getApplication(String id) { ... }
}
```

We inspect whether SCIP provides compiler-resolved implementation relationships for
both the class and the overridden method.

## Expected architectural boundary

If the spike succeeds, SCIP is a candidate backend for:

- symbol identity;
- definitions/references;
- import/re-export resolution;
- class/interface implementation relations;
- Java compiler/classpath resolution.

It is **not** expected to provide:

- HTTP semantics;
- call/execution reachability;
- runtime DI binding;
- value provenance through arbitrary assignments/factories;
- OpenAPI/JAX-RS/domain-specific facts.

Those remain arch-gate semantic adapters.
