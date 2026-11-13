# Transitive topology characterization

Architecture:

```text
frontend -> bff -> backend <- contract
```

The intent says the frontend calls the BFF. The BFF then forwards to a backend, and
the OpenAPI contract is related to that backend.

The current `repositoryRelation` predicate can only traverse one direct edge. It
therefore looks for an `implemented-by` edge directly connected to `bff`.

That edge does not exist in either fixture, by design:

- `valid-chain.yml`: BFF forwards to orders-backend, which is implemented by orders-contract.
- `wrong-chain.yml`: BFF forwards to payments-backend, but the planned operation is getOrder.

Current behavior: both cases become PARTIAL because the engine cannot traverse the
two relation steps. A path-aware predicate should make the valid chain PASS and the
wrong chain FAIL without inventing a false direct contract -> BFF edge.
