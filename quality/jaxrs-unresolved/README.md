# JAX-RS generated interface source scope

The backend contains a concrete implementation in `src/main/java` and a generated
JAX-RS interface in `target/generated-sources/openapi/src/main/java`.

The scenarios separate configuration scope from analyzer evidence:

- `generated-in-scope.yml` includes both source roots. Expected: PASS.
- `generated-out-of-scope.yml` intentionally analyzes only `src/main/java`.
  Expected: FAIL, because the configured analysis scope excludes the metadata needed
  to prove the endpoint. This is a configuration choice, not an analyzer inference.
- `generated-source-missing.yml` explicitly declares a generated source root that
  does not exist. This means the requested analysis could not be completed and must
  be PARTIAL rather than a confident FAIL.

This matters for Maven/OpenAPI codegen pipelines: if `target/generated-sources/...`
is configured, arch-gate must distinguish "generated sources contain no endpoint"
from "generate-sources never ran / the configured source root is unavailable".
