# arch-gate-lab

Separate polyglot monorepo used to exercise [aisaenok/arch-gate](https://github.com/aisaenok/arch-gate) against a realistic project boundary.

## Layout

```text
apps/
  frontend/                  TypeScript API consumer
packages/
  api-contracts/             OpenAPI source of truth
services/
  backend/                   Java API provider

plans/
  valid.json
  invalid-custom-http.json
  invalid-wire-source.json
  invalid-operation.json

arch-gate.yml
arch-gate.invalid-http.yml
arch-gate.invalid-dto.yml
```

Intended architecture:

```text
frontend
   |
generated runtime
   |
api-contracts
   |
backend
```

The frontend keeps its own domain model after an explicit wire -> domain mapper. Only transport models are contract-owned.

## Run locally

Keep this repository and `arch-gate` as siblings:

```text
workspace/
  arch-gate/
  arch-gate-lab/
```

Build the tool:

```bash
cd ../arch-gate
npm install
npm run build
cd ../arch-gate-lab
```

Then:

```bash
# expected PASS
node ../arch-gate/dist/src/index.js check --config ./arch-gate.yml

# expected FAIL: API001
node ../arch-gate/dist/src/index.js check --config ./arch-gate.invalid-http.yml

# expected FAIL: API002
node ../arch-gate/dist/src/index.js check --config ./arch-gate.invalid-dto.yml

# expected PASS
node ../arch-gate/dist/src/index.js plan ./plans/valid.json --config ./arch-gate.yml

# expected FAIL: PLAN002
node ../arch-gate/dist/src/index.js plan ./plans/invalid-custom-http.json --config ./arch-gate.yml

# expected FAIL: PLAN003 + PLAN004
node ../arch-gate/dist/src/index.js plan ./plans/invalid-wire-source.json --config ./arch-gate.yml

# expected FAIL: PLAN001
node ../arch-gate/dist/src/index.js plan ./plans/invalid-operation.json --config ./arch-gate.yml
```

GitHub Actions checks out `aisaenok/arch-gate` separately, builds it, and runs the same scenarios against this repository.
