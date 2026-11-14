# JAX-RS interface metadata outside analyzer scope

The backend contains a concrete implementation in `src/main/java` and a generated
JAX-RS interface in `target/generated-sources/openapi/src/main/java`.

Two configurations characterize the boundary:

- `generated-in-scope.yml` includes both source roots. Expected: PASS.
- `generated-out-of-scope.yml` analyzes only `src/main/java`. The concrete class
  still says `implements ApplicationApi`, but the analyzer cannot inspect the
  interface metadata.

Current behavior for the out-of-scope case is expected to be FAIL because endpoint
evidence is reported as complete even though the implemented interface could not be
resolved.

The desired evidence semantics are more conservative: unresolved implemented
interfaces that could carry inherited endpoint metadata should prevent a confident
negative result. The gate should return PARTIAL unless the interface metadata source
is included in analysis or otherwise resolvable.
