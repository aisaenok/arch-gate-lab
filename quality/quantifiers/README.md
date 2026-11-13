# Relation quantifier adversarial cases

A single contract is related to multiple providers.

Two distinct semantics are needed:

- **any** — at least one related repository must provide the matching fact;
- **all** — every related repository must provide the matching fact.

The current implementation has implicit existential matching but evidence coverage is
computed for every related repository.

That creates two problems:

1. a rule whose architectural meaning is "every related provider" silently behaves as
   "any related provider";
2. an existential rule becomes PARTIAL when one unrelated alternative has unavailable
   evidence, even if another related repository already proves the match.

These fixtures characterize both behaviors before adding an explicit quantifier.
