# Fact quality experiments

These scenarios characterize whether facts are strong enough to support the architecture policy.

After the semantic-facts refactor the expected behavior is:

| Scenario | Expected result | Why |
| --- | --- | --- |
| unused axios import | PASS | an import is not an HTTP call |
| alias to generated request DTO at API boundary | PASS | provenance resolves through the alias to generated code |
| low-level wrapper used directly by feature | FAIL API001 | transitive HTTP reach bypasses generated runtime |
| standalone renamed DTO with similar shape | PASS | shape similarity alone is not evidence of a wire DTO |
| manual local DTO passed to generated client | FAIL API002 | the type actually crosses the generated API boundary |
| extra endpoint hidden in generated directory | FAIL API003 | generated HTTP operation is absent from OpenAPI |
| Java endpoint rule without Java endpoint analyzer | PARTIAL / exit 3 | evidence is unavailable, so a green verdict is impossible |
| misspelled fact kind in policy | config error / exit 2 | unknown fact vocabulary is rejected |

This deliberately distinguishes semantic evidence from heuristic guessing. The tool should only claim a violation when it can connect the code to the architecture boundary being protected.
