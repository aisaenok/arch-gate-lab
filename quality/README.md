# Fact quality experiments

These scenarios test whether the facts extracted by the current `arch-gate` implementation are strong enough to support the architectural claims we want to make.

The important distinction is:

- **architecture expectation** — what the project policy actually means;
- **current tool result** — what the current analyzers + fact model report.

A mismatch is evidence that the facts are insufficient, even if the generic rule engine itself behaves correctly.

| Scenario | Architecture expectation | Current tool | Classification |
| --- | --- | --- | --- |
| unused axios import | PASS: importing without using transport is not an API call | FAIL API001 | false positive |
| alias to generated DTO | PASS: the alias still points to the contract-owned type | FAIL API002 | false positive |
| allowed low-level wrapper used by feature | FAIL: feature bypasses generated runtime | PASS | false negative |
| renamed handwritten wire DTO | FAIL: wire shape is recreated manually | PASS | false negative |
| extra endpoint hidden in generated directory | FAIL: runtime exposes endpoint absent from OpenAPI | PASS | false negative |
| Java endpoint absent from contract | FAIL: backend implements an undeclared endpoint | PASS | false negative / missing evidence |
| misspelled fact kind in policy | FAIL config: policy cannot be evaluated | PASS | false negative / missing policy validation |

The CI job intentionally asserts the **current behavior**, including the wrong behavior. This turns known analyzer limitations into executable evidence instead of undocumented assumptions.
