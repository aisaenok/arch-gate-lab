# Transitive topology relation paths

Architecture:

```text
frontend -> bff --forwards-to--> backend <--implemented-by-- contract
```

The intent names the BFF as the provider. The OpenAPI contract belongs to the
backend behind that BFF, so a direct contract <-> BFF relation would misrepresent
the architecture.

The policy uses an explicit bounded path:

```yaml
repositoryRelation:
  currentField: providerRepositoryId
  candidateField: repositoryId
  path:
    - type: forwards-to
      direction: outgoing
    - type: implemented-by
      direction: incoming
  quantifier: any
```

Expected behavior:

- valid-chain.yml: BFF -> orders-backend <- orders-contract, getOrder -> PASS
- wrong-chain.yml: BFF -> payments-backend <- payments-contract, getOrder -> FAIL

The engine follows only the declared steps. It does not search arbitrary reachable
nodes, infer missing edge types, or expand to an unbounded graph query.
