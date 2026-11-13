# Relation quantifier adversarial cases

A single contract is related to multiple providers.

The architecture needs two distinct semantics:

- `quantifier: any` — at least one related repository must provide the matching fact;
- `quantifier: all` — every related repository must provide the matching fact.

If omitted, the quantifier defaults to `any` for backward compatibility.

Evidence is evaluated against the quantifier:

- ANY + one proven match -> PASS, even if another alternative is unavailable;
- ANY + no match + unknown alternative -> PARTIAL;
- ANY + no match + complete evidence everywhere -> FAIL;
- ALL + one completely analyzed missing repository -> FAIL;
- ALL + only unknown missing repositories -> PARTIAL;
- ALL + match in every related repository -> PASS.

This keeps repository topology separate from rule semantics: relations say which
repositories are connected, while the rule says whether one or every related
repository must satisfy the assertion.
