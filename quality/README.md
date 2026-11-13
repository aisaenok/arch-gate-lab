# Fact quality experiments

These scenarios characterize whether facts are strong enough to support the architecture policy.

Expected behavior:

| Scenario | Expected result | Why |
| --- | --- | --- |
| unused axios import | PASS | an import is not an HTTP call |
| alias to generated request DTO at API boundary | PASS | provenance resolves through the alias to generated code |
| low-level wrapper used directly by feature | FAIL API001 | transitive HTTP reach bypasses generated runtime |
| standalone renamed DTO with similar shape | PASS | shape similarity alone is not evidence of a wire DTO |
| manual local DTO passed to generated client | FAIL API002 | the type actually crosses the generated API boundary |
| extra endpoint hidden in generated frontend directory | FAIL API003 | generated HTTP operation is absent from OpenAPI |
| JAX-RS backend endpoint absent from contract | FAIL API005 | backend endpoint facts are matched by normalized method + path |
| OpenAPI operation without backend implementation | FAIL API006 | contract completeness is checked in the reverse direction |
| OpenAPI operation without generated frontend runtime call | FAIL API007 | generated client completeness is checked in the reverse direction |
| malformed JAX-RS source | PARTIAL / exit 3 | endpoint evidence is incomplete when Java parsing fails |
| misspelled fact kind in policy | config error / exit 2 | unknown fact vocabulary is rejected |

The Java analyzer only claims complete backend endpoint evidence when the repository explicitly declares `frameworks: [jax-rs]`. It parses Java CST, extracts class/method `@Path` plus HTTP-method annotations, and normalizes them to the same operation key used by OpenAPI.
