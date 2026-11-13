# Multi-contract topology adversarial case

Architecture intent:

```text
orders-contract   <-> orders-backend
payments-contract <-> payments-backend
```

The fixture deliberately swaps the backend implementations:

```text
orders-backend   implements GET /api/payments/{id}
payments-backend implements GET /api/orders/{id}
```

The current role-only policy asks whether each contract operation exists in **any**
repository with role `api-provider`. Therefore both operations are found and the
gate returns PASS even though both contract/provider relationships are wrong.

This is an intentional false-negative characterization. The next model change
should make repository relationships first-class so `memberOf` can constrain a
candidate fact to the provider related to the current contract repository.
