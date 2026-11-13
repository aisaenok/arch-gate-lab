# Multi-contract topology adversarial case

Architecture intent:

```text
orders-contract   --implemented-by--> orders-backend
payments-contract --implemented-by--> payments-backend
```

The fixture deliberately swaps the backend implementations:

```text
orders-backend   implements GET /api/payments/{id}
payments-backend implements GET /api/orders/{id}
```

## Control: role-only policy

`current-role-only.yml` asks whether each contract operation exists in **any**
repository with role `api-provider`. It therefore returns PASS. That behavior is
kept as an explicit control showing that roles describe categories, not topology.

## Relation-scoped policy

`relation-scoped.yml` declares first-class repository relations and scopes
`memberOf` through them.

It checks both directions:

- TOPO001: contract operation -> its related backend
- TOPO002: backend endpoint -> its related contract

The deliberately swapped fixture must fail both rules.

Missing relation metadata or unavailable analyzer evidence is not guessed around:
relation-scoped checks produce PARTIAL when the intended repository cannot be
proven.
